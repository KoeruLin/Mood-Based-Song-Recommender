"use client";
import { useEffect, useState } from "react";
import { initiateAuthFlow, getToken, getRefreshToken } from "./authentication";

// invalid token error is because the associated token is expired so it's invalid
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
          const expire: number =
            Date.now() + Number(localStorage.getItem("expires_in")) * 1000;
          if (Date.now() > expire) {
            await getRefreshToken();
          }
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
    })();
  }, []);

  return loggedIn ? (
    <p className="flex justify-center max-w-1/12 bg-blue-500 text-white font-bold py-2 px-4 rounded">
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
