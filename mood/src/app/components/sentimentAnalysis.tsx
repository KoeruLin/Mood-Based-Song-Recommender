const API_KEY = process.env.HUGGING_FACE_API_KEY!;

export interface SentimentAnalysisInput {
  input: string;
}

async function query(data: SentimentAnalysisInput) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",
    {
      headers: {
        Authorization: API_KEY,
        //authorization error
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    },
  );
  return await response.json();
}

export default query;
