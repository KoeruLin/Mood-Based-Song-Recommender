// Define an interface for the input structure required by the sentiment analysis API
export interface SentimentAnalysisInput {
  inputs: string; // The text input for which sentiment analysis will be performed
}

// Define an interface to represent the sentiment analysis API response structure
interface SentimentScore {
  label: string; // Emotion or sentiment label
  score: number; // Confidence score for the detected label
}

// Function to query the sentiment analysis API
async function query(data: SentimentAnalysisInput): Promise<string> {
  const response: Response = await fetch(
    "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base", // API endpoint URL
    {
      headers: {
        Authorization: `Bearer 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`, // Authorization header with API key
        "Content-Type": "application/json", // Specify that the request body is JSON
      },
      method: "POST", // HTTP method for sending the request
      body: JSON.stringify(data), // Convert the input data into a JSON string
    },
  );

  // Parse the JSON response into the SentimentScore structure
  const result: SentimentScore[][] = await response.json();

  // Return the label of the sentiment with the highest score
  return result[0][0].label;
}

// Function to run the query and format the result
async function runQuery(response: string): Promise<string> {
  // Create the input object for the sentiment analysis query
  const input: SentimentAnalysisInput = { inputs: response };

  try {
    // Call the query function and await its response
    const result: string = await query(input);

    // Return the result as a formatted JSON string
    return JSON.stringify(result, null, 2);
  } catch (error) {
    // Return an error message if the API call fails
    return "Error fetching sentiment";
  }
}

// Export the runQuery function as the default export of the module
export default runQuery;
