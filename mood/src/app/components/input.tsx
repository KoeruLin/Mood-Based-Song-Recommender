"use client";
import "../globals.css";
import React, { useState } from "react";
import { readID, allTracks } from "@/app/api/readID";
import { getTracksString } from "@/app/api/authorization/songFinder";
import runQuery from "@/app/api/sentimentAnalysis";

export default function Input() {
  const [prompt, setPrompt] = useState(""); // Store user input from the input field.
  const [output, setOutput] = useState(""); // Store the message to display to the user.
  const [tracks, setTracks] = useState<any[]>([]); // Store track data received from the API.

  /**
   * Handles changes in the input field.
   * @param event - React input change event.
   */
  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    // Check if the user is authenticated by looking for an access token in localStorage.
    if (!localStorage.getItem("access_token")) {
      // Display a warning message if there is no access token.
      setOutput("Please login to Spotify so I can steal your data.");
      return;
    }

    // Update the prompt state with the user's input.
    setPrompt(event.target.value);
  }

  /**
   * Handles form submission.
   * @param event - React form submit event.
   */
  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    // Exit if the prompt field is empty or contains only whitespace.
    if (prompt.trim() === "") {
      return;
    }

    setOutput(""); // Clear the output message.
    event.preventDefault(); // Prevent the default form submission behavior.

    // Perform sentiment analysis with the user-provided prompt.
    const result: string = await runQuery(prompt);
    // Extract and preprocess the sentiment analysis result.
    const trimmedResult: string = JSON.parse(result).toLowerCase().trim();

    // Check if the trimmed result exists in `allTracks` (emotion-to-track mappings).
    if (trimmedResult in allTracks) {
      // Fetch an array of tracks associated with the specific emotion.
      const specificEmotion: string[] =
        allTracks[trimmedResult as keyof typeof allTracks];
      const topFiveTracks: string[] = await readID(specificEmotion);

      // Fetch full track details using Spotify's API.
      const fetchedTracks = await getTracksString(
        localStorage.getItem("access_token") as string, // Retrieve the access token.
        topFiveTracks, // Pass the list of track IDs.
      );

      // Update the track state with the fetched data.
      setTracks(fetchedTracks);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Form for user input */}
      <form
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg flex items-center gap-2"
        onSubmit={handleSubmit}
      >
        {/* Input field */}
        <input
          name="Prompt"
          onChange={handleChange} // Listen for changes to update the prompt state.
          placeholder="Enter Prompt" // Placeholder text
          className="flex-grow border border-gray-300 rounded-lg text-lg p-3 bg-gray-100 dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-violet-600"
        />
        {/* Submit button */}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
        >
          Submit
        </button>
      </form>

      {/* Output container */}
      <div className="mt-6 w-full bg-white p-4 rounded-xl shadow text-center text-gray-700 whitespace-pre-wrap">
        {/* Display the output message */}
        <p className="text-lg text-blue-950 font-bold mb-2">{output}</p>
        {/* Map over all tracks found*/}
        {tracks && tracks.length > 0 && (
          <div className="flex flex-col space-y-6 mt-4">
            {tracks.map((track: any, index: number): any => (
              <div
                key={`${track.id}-${index}`} // Unique key for each track (ID - Index).
                className="flex flex-row items-center gap-4"
              >
                {/* Track image */}
                <img
                  className="size-1/8 rounded-full aspect-square object-cover filter drop-shadow-lg"
                  src={track.image} // Display track image.
                  alt={track.name} // Accessibility text for the image.
                />
                {/* Track name */}
                <button
                  onClick={(): Window | null =>
                    window.open(track.url, "_blank")
                  }
                  className="text-blue-300 font-bold text-base mb-2 filter drop-shadow-lg hover: underline cursor-pointer"
                >
                  {track.name}
                </button>
                {/* Track artist */}
                <p className="text-blue-400 font-bold text-base mb-2 filter drop-shadow-lg">
                  {track.artist}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
