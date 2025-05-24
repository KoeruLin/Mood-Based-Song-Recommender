// Function to generate a random string of a specified length
export function generateRandomString(length: number): string {
  // Define the possible characters that the random string can contain
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  // Generate an array of random values of the specified length
  const values: Uint8Array<ArrayBuffer> = crypto.getRandomValues(
    new Uint8Array(length),
  );

  // Reduce the random values to a string by mapping each value to a character from the possible list
  return values.reduce(
    (acc: string, x: number): string => acc + possible[x % possible.length],
    "", // Initialize with an empty string
  );
}

// Function to compute the SHA-256 hash of a plain text string
export async function sha256(plain: string): Promise<ArrayBuffer> {
  // Create a TextEncoder instance to convert the string into UTF-8 encoded bytes
  const encoder = new TextEncoder();

  // Encode the plain text string into a Uint8Array
  const data: Uint8Array<ArrayBufferLike> = encoder.encode(plain);

  // Return the cryptographic hash (SHA-256) of the encoded data
  return window.crypto.subtle.digest("SHA-256", data);
}

// Function to encode an ArrayBuffer into a base64-encoded string
export function base64encode(input: ArrayBuffer): string {
  // Convert the input ArrayBuffer into a Uint8Array for byte processing
  const bytes = new Uint8Array(input);

  // Convert the bytes into a string using fromCharCode to build a character string
  const str: string = String.fromCharCode(...bytes);

  // Encode the string into base64, and replace certain characters for URL safety
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// Define constants used in the application
export const clientId = "59f27b5536e34160bd579c417670ff86"; // The ID of the client application
export const redirectUri = "http://[::1]:3000"; // The URI to redirect back to after authentication
export const scope =
  "user-read-private user-read-email user-library-read playlist-read-private"; // Scopes for the privileges required by the client
