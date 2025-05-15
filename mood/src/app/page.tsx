"use client";
import "./globals.css";
import { useState } from "react";
import query, {
  SentimentAnalysisInput,
} from "@/app/components/sentimentAnalysis";

export default function Home() {
  const [output, setOutput] = useState("Loading...");

  async function runQuery(response: string) {
    const input: SentimentAnalysisInput = { inputs: response };

    try {
      const result = await query(input);
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      setOutput("Error fetching sentiment");
    }
  }

  return (
    <div>
      <button onClick={() => runQuery("I want something calm")}>
        Analyze Sentiment
      </button>
      <pre>{output}</pre>
    </div>
  );
}
