"use client";
import "../globals.css";
import React, { useState } from "react";
import runQuery from "@/app/api/sentimentAnalysis";

export default function Input() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

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
    setOutput(await runQuery(prompt));
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
      </div>
    </div>
  );
}
