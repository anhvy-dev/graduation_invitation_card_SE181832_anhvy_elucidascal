export interface FacebookAuthResponse {
  accessToken: string;
  expiresIn: number;
  signedRequest: string;
  userID: string;
  data_access_expiration_time?: number;
  graphDomain?: string;
}

export interface FacebookLoginStatusResponse {
  status: "connected" | "not_authorized" | "unknown";
  authResponse?: FacebookAuthResponse;
}

export interface FacebookUserProfile {
  id: string;
  name: string;
  picture?: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

export interface FacebookSDK {
  init(params: {
    appId: string;
    cookie?: boolean;
    xfbml?: boolean;
    version: string;
  }): void;
  getLoginStatus(
    callback: (response: FacebookLoginStatusResponse) => void,
    roundtrip?: boolean
  ): void;
  login(
    callback: (response: FacebookLoginStatusResponse) => void,
    options?: { scope?: string; return_scopes?: boolean }
  ): void;
  logout(callback?: (response: unknown) => void): void;
  api<T = unknown>(
    path: string,
    params: Record<string, unknown>,
    callback: (response: T) => void
  ): void;
  api<T = unknown>(
    path: string,
    callback: (response: T) => void
  ): void;
}

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: FacebookSDK;
  }
}
