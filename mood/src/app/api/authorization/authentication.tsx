import {
  generateRandomString,
  sha256,
  base64encode,
  clientId,
  redirectUri,
  scope,
} from "./encoder";

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

export async function initiateAuthFlow(): Promise<void> {
  const codeVerifier: string = generateRandomString(64);
  const hashed: ArrayBuffer = await sha256(codeVerifier);
  const codeChallenge: string = base64encode(hashed);

  localStorage.setItem("code_verifier", codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: "code",
    client_id: clientId,
    scope,
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  };
  authUrl.search = new URLSearchParams(params).toString();

  window.location.href = authUrl.toString();
}

export async function getToken(code: string): Promise<void> {
  const codeVerifier: string | null = localStorage.getItem("code_verifier");
  if (!codeVerifier) {
    throw new Error("Code verifier not found in localStorage.");
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  };
  try {
    const response: Response = await fetch(url, payload);
    const data: TokenResponse = await response.json();
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    if (data.expires_in) {
      localStorage.setItem(
        "expires_at",
        (Date.now() + data.expires_in * 1000).toString(),
      );
    }
  } catch (error: any) {
    alert(`Error: Failed to fetch token: ${error.message}`);
  }
}

export async function getRefreshToken(): Promise<void> {
  const refreshToken: string | null = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    alert("Refresh token not found.");
    throw new Error("Refresh token not found.");
  }

  const url = "https://accounts.spotify.com/api/token";
  const payload: RequestInit = {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };

  const response: Response = await fetch(url, payload);
  if (!response.ok) {
    throw new Error(`Error: Failed to refresh token: ${response.statusText}`);
  }

  const data: TokenResponse = await response.json();
  localStorage.setItem("access_token", data.access_token);
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }
  localStorage.setItem(
    "expires_at",
    (Date.now() + data.expires_in * 1000).toString(),
  );
}
