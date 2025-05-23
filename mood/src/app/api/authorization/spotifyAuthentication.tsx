"use client";
import { useEffect, useState } from "react";
import { initiateAuthFlow, getToken, getRefreshToken } from "./authentication";

export async function refreshToken(): Promise<void> {
  const expire: number = Number(localStorage.getItem("expires_at"));
  if (!(Date.now() >= expire)) {
    await getRefreshToken();
  }
}
// if the issue is undefined object then it is due to the access token expiring
// to refresh the token just negate the above if condition and it will refresh

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
          await refreshToken();
          setLoggedIn(true);
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        } catch {
          console.log("Login Failed.");
        }
        return;
      }
    })();
  }, []);

  return loggedIn ? (
    <></>
  ) : (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={initiateAuthFlow}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Login with Spotify
      </button>
    </div>
  );
}
