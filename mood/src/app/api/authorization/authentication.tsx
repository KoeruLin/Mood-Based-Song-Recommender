import {
  generateRandomString,
  sha256,
  base64encode,
  clientId,
  redirectUri,
  scope,
} from "./encoder";

// Defining the expected structure of the token response from Spotify's API
interface TokenResponse {
  access_token: string; // The OAuth access token
  token_type: string; // Type of the token (usually "Bearer")
  scope: string; // The scopes granted with this token
  expires_in: number; // Expiration time in seconds
  refresh_token?: string; // Optional refresh token for renewing the access token
}

/**
 * Initiates the OAuth 2.0 authorization code flow with Spotify.
 * Generates a `code_verifier` and `code_challenge` needed for PKCE (Proof Key for Code Exchange),
 * saves the `code_verifier` to localStorage, and redirects to Spotify's authorization page.
 */
export async function initiateAuthFlow(): Promise<void> {
  // Generate a random string to be used as a Code Verifier
  const codeVerifier: string = generateRandomString(64);

  // Create a hashed version of the Code Verifier using SHA-256
  const hashed: ArrayBuffer = await sha256(codeVerifier);

  // Encode the hashed value in Base64 to produce the Code Challenge
  const codeChallenge: string = base64encode(hashed);

  // Store the Code Verifier in localStorage for later use
  localStorage.setItem("code_verifier", codeVerifier);

  // Construct the Spotify authorization URL with query parameters
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  const params = {
    response_type: "code", // Requesting an authorization code
    client_id: clientId, // Client ID of the application
    scope, // The requested scopes for the token
    code_challenge_method: "S256", // Indicating the use of SHA-256 for the Code Challenge
    code_challenge: codeChallenge, // The generated Code Challenge
    redirect_uri: redirectUri, // The redirect URI for the app
  };
  authUrl.search = new URLSearchParams(params).toString();

  // Redirect the user to Spotify's authorization page to complete the login
  window.location.href = authUrl.toString();
}

/**
 * Handles the exchange of the authorization code for an access token.
 * Retrieves the `code_verifier` from localStorage (required by PKCE), sends a POST
 * request to Spotify's token endpoint, and stores the resulting tokens and expiry information in localStorage.
 *
 * @param code - The authorization code received from Spotify's redirect after user login
 */
export async function getToken(code: string): Promise<void> {
  // Retrieve the Code Verifier from localStorage
  const codeVerifier: string | null = localStorage.getItem("code_verifier");
  if (!codeVerifier) {
    throw new Error("Code verifier not found in localStorage.");
  }

  // Define the Spotify token endpoint and payload for the request
  const url = "https://accounts.spotify.com/api/token";
  const payload: RequestInit = {
    method: "POST", // Use HTTP POST as required by the API
    headers: {
      "Content-Type": "application/x-www-form-urlencoded", // URL-encoded form data
    },
    body: new URLSearchParams({
      client_id: clientId, // The application's Client ID
      grant_type: "authorization_code", // Authorization code exchange
      code, // The received authorization code
      redirect_uri: redirectUri, // The redirect URI (must match the one used in `initiateAuthFlow`)
      code_verifier: codeVerifier, // The original Code Verifier
    }),
  };

  try {
    // Send the token request to Spotify
    const response: Response = await fetch(url, payload);

    // Parse the JSON response from Spotify
    const data: TokenResponse = await response.json();

    // Store the access token and optional refresh token in localStorage
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }

    // Calculate and store the token expiry time based on the current time
    if (data.expires_in) {
      localStorage.setItem(
        "expires_at",
        (Date.now() + data.expires_in * 1000).toString(),
      );
    }
  } catch (error: any) {
    // Handle errors during the token fetch
    alert(`Error: Failed to fetch token: ${error.message}`);
  }
}

/**
 * Refreshes the OAuth access token using the stored refresh token.
 * Sends a POST request to Spotify's token endpoint and updates the stored tokens and expiry information.
 */
export async function getRefreshToken(): Promise<void> {
  // Retrieve the Refresh Token from localStorage
  const refreshToken: string | null = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    alert("Refresh token not found."); // Alert the user if no refresh token is stored
    throw new Error("Refresh token not found."); // Throw an error to indicate the missing token
  }

  // Define the Spotify token endpoint and payload for the request
  const url = "https://accounts.spotify.com/api/token";
  const payload: RequestInit = {
    method: "POST", // Use HTTP POST as required
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, // URL-encoded form data
    body: new URLSearchParams({
      grant_type: "refresh_token", // Request type for refreshing an access token
      refresh_token: refreshToken, // The stored refresh token
      client_id: clientId, // The application's Client ID
    }),
  };

  // Send the token refresh request to Spotify's token endpoint
  const response: Response = await fetch(url, payload);
  if (!response.ok) {
    // Handle errors in the response
    throw new Error(`Error: Failed to refresh token: ${response.statusText}`);
  }

  // Parse the JSON response from Spotify
  const data: TokenResponse = await response.json();

  // Update the access token and optional refresh token in localStorage
  localStorage.setItem("access_token", data.access_token);
  if (data.refresh_token) {
    localStorage.setItem("refresh_token", data.refresh_token);
  }

  // Calculate and store the updated token expiry time
  localStorage.setItem(
    "expires_at",
    (Date.now() + data.expires_in * 1000).toString(),
  );
}
