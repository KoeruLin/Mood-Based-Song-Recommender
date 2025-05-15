export interface SentimentAnalysisInput {
  inputs: string;
}

async function query(data: SentimentAnalysisInput) {
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
  const result = await response.json();
  return result[0][0];
}

async function runQuery(response: string) {
  const input: SentimentAnalysisInput = { inputs: response };

  try {
    const result = await query(input);
    return JSON.stringify(result, null, 2);
  } catch (error) {
    return "Error fetching sentiment";
  }
}

export default runQuery;
