export interface SentimentAnalysisInput {
  inputs: string;
}

interface SentimentScore {
  label: string;
  score: number;
}

async function query(data: SentimentAnalysisInput): Promise<SentimentScore> {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
    {
      headers: {
        Authorization: `Bearer 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`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  const result: SentimentScore[][] = await response.json();
  return result[0][0];
}

async function runQuery(response: string): Promise<string> {
  const input: SentimentAnalysisInput = { inputs: response };

  try {
    const result: SentimentScore = await query(input);
    return JSON.stringify(result, null, 2);
  } catch (error) {
    return "Error fetching sentiment";
  }
}

export default runQuery;
