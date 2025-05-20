"use client";
import "../globals.css";
import React, { useState } from "react";
import { readID, allTracks } from "@/app/api/readID";
import { getTracks, getTracksString } from "@/app/api/authorization/songFinder";
import runQuery from "@/app/api/sentimentAnalysis";

export default function Input() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [tracks, setTracks] = useState<any[]>([]);

  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    if (event.target.value.trim() === "") {
      setOutput("");
    }
    setPrompt(event.target.value);
  }
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();
    const result: string = await runQuery(prompt);
    const trimmedResult: string = JSON.parse(result).toLowerCase().trim();
    if (trimmedResult in allTracks) {
      const specificEmotion: string[] =
        allTracks[trimmedResult as keyof typeof allTracks];
      const topFiveTracks: string[] = await readID(specificEmotion);
      const fetchedTracks = await getTracksString(
        localStorage.getItem("access_token") as string,
        topFiveTracks,
      );
      setTracks(fetchedTracks);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg flex items-center gap-2"
        onSubmit={handleSubmit}
      >
        <input
          name="Prompt"
          onChange={handleChange}
          placeholder="Enter Prompt"
          className="flex-grow border border-gray-300 rounded-lg text-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
        >
          Submit
        </button>
      </form>

      <div className="mt-6 w-full max-w-md bg-white p-4 rounded-xl shadow text-center text-gray-700 whitespace-pre-wrap">
        {output}
        {tracks && tracks.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-6">
            {tracks.map((track: any, index: number) => (
              <div
                key={`${track.id}-${index}`}
                className="flex flex-col items-center gap-2"
              >
                <img src={track.image} alt={track.name} />
                <p>{track.name}</p>
                <p>{track.artist}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
