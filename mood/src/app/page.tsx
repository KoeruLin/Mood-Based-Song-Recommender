"use client";
import "./globals.css";
import { useState } from "react";
import query, { SentimentAnalysisInput } from "./components/sentimentAnalysis";

export default function Home() {
  const [output, setOutput] = useState("Loading...");

  async function runQuery(response: string) {
    const input: SentimentAnalysisInput = { input: response };

    try {
      const result = await query(input);
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput("Error fetching sentiment");
      console.error(error);
    }
  }

  return (
    <div>
      <button onClick={() => runQuery("I am happy")}>Analyze Sentiment</button>
      <pre>{output}</pre>
    </div>
  );
}
