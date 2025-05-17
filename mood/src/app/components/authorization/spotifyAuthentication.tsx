"use client";
import { useEffect, useState } from "react";
import { initiateAuthFlow, getToken, getRefreshToken } from "./authentication";

export default function SpotifyAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect((): void => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code: string | null = params.get("code");
    const error: string | null = params.get("error");

    (async (): Promise<void> => {
      if (error) {
        alert("Authorization denied. Please try again.");
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname,
        );
        return;
      }

      if (code) {
        try {
          await getToken(code);
          setLoggedIn(true);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch {
          alert("Login failed. Try again.");
        }
        return;
      }

      const token: string | null = localStorage.getItem("access_token");
      if (token) {
        const response: Response = await fetch(
          "https://api.spotify.com/v1/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (response.ok) {
          setLoggedIn(true);
        } else {
          try {
            await getRefreshToken();
            const newToken: string | null =
              localStorage.getItem("access_token");
            const newResponse: Response = await fetch(
              "https://api.spotify.com/v1/me",
              {
                headers: { Authorization: `Bearer ${newToken}` },
              },
            );

            if (newResponse.ok) {
              setLoggedIn(true);
            } else {
              alert("Session expired. Please log in again.");
            }
          } catch {
            alert("Could not refresh session.");
          }
        }
      }
    })();
  }, []);

  return loggedIn ? (
    <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
      Logged In
    </p>
  ) : (
    <button
      onClick={initiateAuthFlow}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login with Spotify
    </button>
  );
}
