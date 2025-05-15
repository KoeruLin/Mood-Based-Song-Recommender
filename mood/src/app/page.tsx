"use client";
import { useState } from "react";
import "./globals.css";
import runQuery from "@/app/components/sentimentAnalysis";

export default function Home() {
  const [output, setOutput] = useState("Loading...");

  async function handleClick() {
    const result = await runQuery("Give me something exciting and energetic");
    setOutput(result);
  }

  return (
    <div>
      <button onClick={() => handleClick()}>Analyze Sentiment</button>
      <pre>{output}</pre>
    </div>
  );
}
