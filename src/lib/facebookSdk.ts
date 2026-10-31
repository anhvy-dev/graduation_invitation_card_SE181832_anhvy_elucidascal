/**
 * Facebook SDK module (Deprecated & Removed)
 * Facebook Login has been removed in favor of URL-based personalized invitation links (?to=Name)
 * and public invitation mode with local name personalization.
 */

export function initFacebookSdk(): Promise<boolean> {
  return Promise.resolve(false);
}

export function redirectToFacebookOAuth(): void {
  // No-op
}

export async function handleOAuthRedirectCallback(): Promise<{ handled: boolean }> {
  return { handled: false };
}

export async function loginWithFacebook(): Promise<{ success: boolean; error?: string }> {
  return {
    success: false,
    error: "Tính năng Đăng nhập Facebook đã được thay thế bằng liên kết cá nhân hóa.",
  };
}

export async function verifyFacebookTokenOnServer(): Promise<{ valid: boolean; verifiedByServer: boolean }> {
  return { valid: false, verifiedByServer: false };
}
