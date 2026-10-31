import type { FacebookUserProfile, FacebookLoginStatusResponse } from "../types/facebook";

const FB_APP_ID = import.meta.env.VITE_FB_APP_ID || "1469533411730984";
const FB_API_VERSION = "v21.0";

let sdkPromise: Promise<boolean> | null = null;

/**
 * Dynamically loads and initializes the official Meta/Facebook JavaScript SDK.
 */
export function initFacebookSdk(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.FB) return Promise.resolve(true);
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve) => {
    // If the script already exists
    if (document.getElementById("facebook-jssdk")) {
      if (window.FB) {
        resolve(true);
      } else {
        const checkInterval = setInterval(() => {
          if (window.FB) {
            clearInterval(checkInterval);
            resolve(true);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(checkInterval);
          resolve(!!window.FB);
        }, 5000);
      }
      return;
    }

    window.fbAsyncInit = function () {
      try {
        window.FB?.init({
          appId: FB_APP_ID,
          cookie: true,
          xfbml: false,
          version: FB_API_VERSION,
        });
        resolve(true);
      } catch (err) {
        console.warn("[Facebook SDK] Initialization error:", err);
        resolve(false);
      }
    };

    const js = document.createElement("script");
    js.id = "facebook-jssdk";
    js.src = "https://connect.facebook.net/vi_VN/sdk.js";
    js.async = true;
    js.defer = true;
    js.onerror = () => {
      console.warn("[Facebook SDK] Failed to load SDK script (network or ad-blocker).");
      resolve(false);
    };
    document.body.appendChild(js);
  });

  return sdkPromise;
}

/**
 * Direct OAuth redirect: sends the user directly to Facebook's OAuth dialog to grant public_profile.
 */
export function redirectToFacebookOAuth(): void {
  if (typeof window === "undefined") return;

  // Use current origin + pathname without hash or existing OAuth query
  const cleanUrl = new URL(window.location.href);
  cleanUrl.hash = "";
  cleanUrl.searchParams.delete("error");
  cleanUrl.searchParams.delete("error_code");
  cleanUrl.searchParams.delete("error_description");
  cleanUrl.searchParams.delete("error_reason");

  const redirectUri = cleanUrl.toString();
  const oauthUrl = `https://www.facebook.com/${FB_API_VERSION}/dialog/oauth?client_id=${FB_APP_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token&scope=public_profile`;

  window.location.href = oauthUrl;
}

/**
 * Inspects URL for OAuth response tokens after Facebook redirects back.
 */
export async function handleOAuthRedirectCallback(): Promise<{
  handled: boolean;
  user?: FacebookUserProfile;
  error?: string;
}> {
  if (typeof window === "undefined") return { handled: false };

  // Check URL hash for access_token (implicit grant)
  const hash = window.location.hash.startsWith("#") ? window.location.hash.substring(1) : "";
  const params = new URLSearchParams(hash);
  const accessToken = params.get("access_token");

  // Check query params for error or denial
  const searchParams = new URLSearchParams(window.location.search);
  const errorReason = searchParams.get("error_reason") || searchParams.get("error");

  if (errorReason) {
    // User denied or error occurred -> don't redirect again in this session
    sessionStorage.setItem("fb_skip_auth", "1");
    // Clean URL
    const cleanUrl = window.location.pathname;
    window.history.replaceState(null, "", cleanUrl);
    return {
      handled: true,
      error: "Đăng nhập Facebook bị từ chối hoặc có lỗi.",
    };
  }

  if (accessToken) {
    try {
      // Clean hash from URL bar
      const cleanUrl = window.location.pathname + window.location.search;
      window.history.replaceState(null, "", cleanUrl);

      // Fetch user profile with token
      const res = await fetch(
        `https://graph.facebook.com/me?access_token=${encodeURIComponent(
          accessToken
        )}&fields=id,name,picture.width(160).height(160)`
      );

      if (res.ok) {
        const profile: FacebookUserProfile = await res.json();
        if (profile.name) {
          try {
            localStorage.setItem("graduation_fb_user", JSON.stringify(profile));
          } catch {
            // Ignore
          }
          // Server-side verification in background
          verifyFacebookTokenOnServer(accessToken, profile.id).catch(console.warn);
          return {
            handled: true,
            user: profile,
          };
        }
      }
    } catch (err) {
      console.warn("[OAuth Callback] Error reading profile:", err);
    }
  }

  return { handled: false };
}

/**
 * Triggers Facebook Login popup dialog requesting only `public_profile`.
 */
export async function loginWithFacebook(): Promise<{
  success: boolean;
  user?: FacebookUserProfile;
  accessToken?: string;
  error?: string;
}> {
  const ready = await initFacebookSdk();
  if (!ready || !window.FB) {
    // If popup SDK fails (e.g. ad blocker), fallback to full page redirect
    redirectToFacebookOAuth();
    return {
      success: false,
      error: "Đang chuyển hướng sang Facebook...",
    };
  }

  return new Promise((resolve) => {
    window.FB?.login(
      (response: FacebookLoginStatusResponse) => {
        if (response.status === "connected" && response.authResponse) {
          const { accessToken, userID } = response.authResponse;
          window.FB?.api<FacebookUserProfile>(
            "/me",
            { fields: "id,name,picture.width(160).height(160)" },
            (profile) => {
              if (profile && profile.name) {
                resolve({
                  success: true,
                  user: profile,
                  accessToken,
                });
              } else {
                resolve({
                  success: true,
                  user: { id: userID, name: "Facebook User" },
                  accessToken,
                });
              }
            }
          );
        } else if (response.status === "not_authorized") {
          resolve({
            success: false,
            error: "Bạn chưa cấp quyền cho ứng dụng.",
          });
        } else {
          resolve({
            success: false,
            error: "Đăng nhập Facebook bị hủy.",
          });
        }
      },
      { scope: "public_profile", return_scopes: true }
    );
  });
}

/**
 * Calls backend serverless function `/api/fb-verify` to securely verify the access token.
 */
export async function verifyFacebookTokenOnServer(
  accessToken: string,
  userID: string
): Promise<{ valid: boolean; verifiedByServer: boolean; user?: Partial<FacebookUserProfile>; error?: string }> {
  try {
    const res = await fetch("/api/fb-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, userID }),
    });

    if (!res.ok) {
      return { valid: true, verifiedByServer: false };
    }

    const data = await res.json();
    return {
      valid: !!data.valid,
      verifiedByServer: !!data.verified,
      user: data.user,
    };
  } catch {
    return { valid: true, verifiedByServer: false };
  }
}
