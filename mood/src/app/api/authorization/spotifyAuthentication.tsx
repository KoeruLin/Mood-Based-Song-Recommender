"use client";
import { useEffect, useState } from "react";
import { initiateAuthFlow, getToken, getRefreshToken } from "./authentication";

export async function refreshToken(): Promise<void> {
  const expire: number = Number(localStorage.getItem("expires_at"));
  if (Date.now() >= expire) {
    await getRefreshToken();
  }
}
// if the issue is undefined object then it is due to the access token expiring
// to refresh the token just negate the above if condition and it will refresh

export default function SpotifyAuth() {
  // This is a React functional component to handle the Spotify authentication logic.

  const [loggedIn, setLoggedIn] = useState(false);
  // State variable `loggedIn` to indicate whether the user is logged in. Defaults to `false`.

  useEffect((): void => {
    // `useEffect` is used to perform authentication-related side effects.
    if (typeof window === "undefined") return;
    // Ensure the code runs only in the browser environment, since window is unavailable on the server.

    const params = new URLSearchParams(window.location.search);
    // Extract query parameters from the current URL.

    const code: string | null = params.get("code");
    // Retrieve the `code` parameter (authorization code) from the URL.

    const error: string | null = params.get("error");
    // Retrieve the `error` parameter from the URL, if present.

    (async (): Promise<void> => {
      // Immediately-invoked asynchronous function to handle the authentication logic.

      if (error) {
        // If an error exists in the URL:
        alert("Authorization denied. Please try again.");
        // Show an alert to the user about the authorization denial.

        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        // Remove error-related query parameters from the URL to clean up the state.
        return;
      }

      if (code) {
        // If an authorization code exists:
        try {
          await getToken(code);
          // Use the `getToken` function to exchange the authorization code for an access token.

          await refreshToken();
          // Refresh the newly generated token immediately.

          setLoggedIn(true);
          // Update the `loggedIn` state to `true` once the user is successfully authenticated.

          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
          // Remove the authorization code from the URL for cleanliness.
        } catch {
          console.log("Login Failed.");
          // Log a message to the console if the login process fails.
        }
        return;
      }
    })();
  }, []);
  // The empty dependency array ensures this effect runs only once when the component mounts.

  return loggedIn ? (
    // Render empty content if the user is logged in.
    <></>
  ) : (
    <div className="flex flex-col items-center gap-2">
      {/* Render a login button if the user is not logged in. */}
      <button
        onClick={initiateAuthFlow}
        // Trigger the authentication flow when the button is clicked.
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        // Tailwind CSS classes for styling the button.
      >
        Login with Spotify
        {/* Button label */}
      </button>
    </div>
  );
}
