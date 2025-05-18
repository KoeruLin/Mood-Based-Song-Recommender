"use client";
import { useState, useEffect } from "react";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
}

async function getTracks(accessToken: string, data: any): Promise<Track[]> {
  const tracks: Track[] = [];
  for (const playList of data.items) {
    const list: Response = await fetch(
      `https://api.spotify.com/v1/playlists/${playList.id}/tracks`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const tracksData: any = await list.json();
    for (const song of tracksData.items) {
      tracks.push({
        id: song.track.id,
        name: song.track.name,
        artist: song.track.artists[0].name,
        image: song.track.album.images[2].url,
      });
    }
  }

  return tracks;
}

export default function SongFinder() {
  const [output, setOutput] = useState<string>("");
  const [songs, setSongs] = useState<Track[]>([]);

  useEffect((): void => {
    (async (): Promise<void> => {
      const accessToken: string | null = localStorage.getItem("access_token");
      if (!accessToken) {
        setOutput("Access token missing.");
        return;
      }
      try {
        const getPlayList: Response = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        const data: any = await getPlayList.json();
        const result: Track[] = await getTracks(accessToken, data);
        setSongs(result);
      } catch (error: any) {
        setOutput("Error fetching user profile: " + error.message);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-1">
      {songs.map((song: Track) => (
        <div
          key={song.id + songs.indexOf(song)}
          className="flex flex-col items-center gap-2"
        >
          <img src={song.image} alt={song.name} />
          <pre>{song.name}</pre>
          <pre>{song.artist}</pre>
          <hr />
          <hr />
        </div>
      ))}
      {output}
    </div>
  );
}
