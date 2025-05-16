"use client";
import { useState, useEffect } from "react";

export default function SongFinder() {
  const [output, setOutput] = useState<string>("Test");

  useEffect((): void => {
    (async (): Promise<void> => {
      const accessToken: string | null = localStorage.getItem("accessToken");
      if (!accessToken) {
        setOutput("Access token missing.");
        return;
      }
      try {
        const response: Response = await fetch(
          "https://api.spotify.com/v1/me",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data: any = await response.json();
        setOutput(JSON.stringify(data, null, 2));
      } catch (error: any) {
        setOutput("Error fetching user profile: " + error.message);
      }
    })();
  }, []);

  return <pre>{output}</pre>;
}
