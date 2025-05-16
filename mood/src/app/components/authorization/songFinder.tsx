"use client";

export async function fetchProfile() {
  const accessToken: string | null = localStorage.getItem("accessToken");
  if (!accessToken) {
    console.log("Invalid token");
    return;
  }
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data: JSON = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching profile:", error);
  }
}

export default async function SongFinder(): Promise<any> {
  const result: JSON | undefined = await fetchProfile();
  console.log(result);
  try {
    return <p>JSON.stringify(result, null, 2)</p>;
  } catch (error) {
    return <p>"Error fetching user profile"</p>;
  }
}
