"use client";
import { useState, useEffect } from "react";
import { refreshToken } from "./spotifyAuthentication";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
  popularity: number;
}

export async function getTracks(
  accessToken: string,
  data: any,
): Promise<Track[]> {
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
        popularity: song.track.popularity,
      });
    }
  }

  return tracks;
}

export async function getTracksString(
  accessToken: string,
  data: string[],
): Promise<Track[]> {
  const tracks: Track[] = [];
  for (const playList of data) {
    const list: Response = await fetch(
      `https://api.spotify.com/v1/tracks/${playList}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const tracksData: any = await list.json();
    tracks.push({
      id: tracksData.id,
      name: tracksData.name,
      artist: tracksData.artists[0].name,
      image: tracksData.album.images[2].url,
      popularity: tracksData.popularity,
    });
  }

  return tracks;
}

export default function SongFinder() {
  const [output, setOutput] = useState<string>("");
  const [songs, setSongs] = useState<Track[]>([]);

  useEffect((): void => {
    (async (): Promise<void> => {
      await refreshToken();
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
        if (!getPlayList.ok) {
          alert(
            `Spotify API error: ${getPlayList.status} ${getPlayList.statusText}`,
          );
        }
        const data: any = await getPlayList.json();
        const result: Track[] = await getTracks(accessToken, data);
        setSongs(result);
      } catch (error: any) {
        alert(error);
        setOutput("Error fetching user profile: " + error.message);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-1">
      {songs.map((song: Track, index: number) => (
        <div
          key={`${song.id}-${index}`}
          className="flex flex-col items-center gap-2"
        >
          <img src={song.image} alt={song.name} />
          <p>{song.id}</p>
          <p>{song.name}</p>
          <p>{song.artist}</p>
          <p>{song.popularity}</p>
          <hr />
          <hr />
        </div>
      ))}
      {output}
    </div>
  );
}
