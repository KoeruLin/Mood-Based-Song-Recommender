"use client";
import "../globals.css";
import { useState } from "react";
import runQuery from "@/app/components/sentimentAnalysis";

export default function Input() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");

  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    event.preventDefault();
    setPrompt(event.target.value);
    const result = await runQuery(prompt);
    setOutput(result);
  }
  // move this into the song finding file later on

  return (
    <>
      <form className="flex justify-center">
        <input
          name="Prompt"
          placeholder="Enter Prompt"
          onChange={handleChange}
          className="border border-gray-500 rounded text-xl pl-2"
        ></input>
      </form>
      <div className="text-center">{output}</div>
    </>
  );
}
