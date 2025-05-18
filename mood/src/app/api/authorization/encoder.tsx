export function generateRandomString(length: number): string {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values: Uint8Array<ArrayBuffer> = crypto.getRandomValues(
    new Uint8Array(length),
  );
  return values.reduce(
    (acc: string, x: number): string => acc + possible[x % possible.length],
    "",
  );
}

export async function sha256(plain: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const data: Uint8Array<ArrayBufferLike> = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

export function base64encode(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input);
  const str: string = String.fromCharCode(...bytes);
  return btoa(str).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export const clientId = "59f27b5536e34160bd579c417670ff86";
export const redirectUri = "http://[::1]:3000";
export const scope = "user-read-private user-read-email user-library-read";
