"use client";
import { useEffect, useState } from "react";
import { initiateAuthFlow, getToken } from "./authentication";

export default function SpotifyAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect((): void => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const code: string | null = params.get("code");
    const error: string | null = params.get("error");

    (async (): Promise<void> => {
      try {
        await login(code, error);
      } catch (error) {
        throw new Error("Login process failed: " + error);
      }
    })();
  }, []);

  const login = async (
    code: string | null,
    error: string | null,
  ): Promise<void> => {
    if (error) {
      alert("Authorization denied. Please try again.");
      window.history.replaceState({}, document.title, window.location.pathname);
      setLoggedIn(false);
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
      } catch (error) {
        alert(error);
      }
      return;
    }

    const accessToken: string | null = localStorage.getItem("access_token");

    if (accessToken) {
      setLoggedIn(true);
    }
  };

  if (loggedIn) {
    return (
      <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded">
        Logged In
      </p>
    );
  }

  return (
    <button
      onClick={initiateAuthFlow}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Login with Spotify
    </button>
  );
}
