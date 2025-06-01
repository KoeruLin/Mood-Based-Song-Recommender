"use client";
import { useState, useEffect } from "react";
import { refreshToken } from "./spotifyAuthentication";

interface Track {
  id: string;
  name: string;
  artist: string;
  image: string;
  popularity: number;
  url: string;
}

/**
 * Fetches tracks for all playlists provided in the `data` object.
 * @param accessToken - Spotify API access token.
 * @param data - The playlist data retrieved from Spotify.
 * @returns Promise containing an array of tracks with relevant details.
 */
export async function getTracks(
  accessToken: string,
  data: any,
): Promise<Track[]> {
  const tracks: Track[] = []; // Initialize an empty array to store tracks.
  for (const playList of data.items) {
    // Loop through each playlist.
    const list: Response = await fetch(
      `https://api.spotify.com/v1/playlists/${playList.id}/tracks`,
      {
        // Fetch tracks for the current playlist.
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const tracksData: any = await list.json(); // Parse the response.
    for (const song of tracksData.items) {
      // Extract and store relevant track details.
      tracks.push({
        id: song.track.id,
        name: song.track.name,
        artist: song.track.artists[0].name,
        image: song.track.album.images[2].url,
        popularity: song.track.popularity,
        url: song.track.external_urls.spotify,
      });
    }
  }
  return tracks;
}

/**
 * Fetches detailed information about individual tracks using their IDs.
 * @param accessToken - Spotify API access token.
 * @param data - An array of track IDs.
 * @returns Promise containing an array of track details.
 */
export async function getTracksString(
  accessToken: string,
  data: string[],
): Promise<Track[]> {
  const tracks: Track[] = []; // Initialize an empty array to store tracks.
  for (const playList of data) {
    // Loop through each track ID.
    const list: Response = await fetch(
      `https://api.spotify.com/v1/tracks/${playList}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const tracksData: any = await list.json(); // Parse the response.
    // Push the retrieved track information into the array.
    tracks.push({
      id: tracksData.id,
      name: tracksData.name,
      artist: tracksData.artists[0].name,
      image: tracksData.album.images[2].url,
      popularity: tracksData.popularity,
      url: tracksData.external_urls.spotify,
    });
  }
  return tracks;
}

/**
 * SongFinder Component - Displays a grid of songs fetched from Spotify playlists.
 */
export default function SongFinder() {
  // State to hold any output messages displayed to the user.
  const [output, setOutput] = useState<string>("");
  // State to hold the list of tracks fetched from the API.
  const [songs, setSongs] = useState<Track[]>([]);

  useEffect((): void => {
    // useEffect runs once when the component is mounted.
    (async (): Promise<void> => {
      // Self-invoking function to fetch and display playlists' tracks.

      await refreshToken(); // Refresh the Spotify access token.

      // Retrieve the updated access token from localStorage.
      const accessToken: string | null = localStorage.getItem("access_token");
      if (!accessToken) {
        // If the token doesn't exist, display an error message.
        setOutput("Access token missing.");
        return;
      }
      try {
        // Fetch the user's playlists from the Spotify API.
        const getPlayList: Response = await fetch(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!getPlayList.ok) {
          // Handle API errors and alert the user.
          alert(
            `Spotify API error: ${getPlayList.status} ${getPlayList.statusText}`,
          );
        }
        const data: any = await getPlayList.json(); // Parse the playlist data.

        // Use the `getTracks` function to fetch tracks for all playlists.
        const result: Track[] = await getTracks(accessToken, data);

        setSongs(result); // Update the state with the fetched tracks.
      } catch (error: any) {
        // Handle unexpected errors and alert the user.
        alert(error);
        setOutput("Error fetching user profile: " + error.message);
      }
    })();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-gray-100 dark:bg-gray-900 p-4">
      {songs.map((song: Track) => (
        <div
          key={song.id}
          className="p-4 shadow-md rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <img src={song.image} alt={song.name} className="rounded-md" />
          <h3 className="mt-2 font-bold">{song.name}</h3>
          <p>{song.artist}</p>
        </div>
      ))}
    </div>
  );
}
