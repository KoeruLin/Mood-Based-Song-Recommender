import "./globals.css";
import Input from "@/app/components/input";
import SpotifyAuth from "@/app/api/authorization/spotifyAuthentication";

/**
 * Home Component - The main entry point and UI for the homepage of the application.
 * Displays the app's title, description, input field, and Spotify authentication flow.
 */
export default function Home() {
  return (
    <>
      <main className="mt-6 flex justify-center font-sans items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">Song Finder</h1>
        <p className="text-lg mb-8 text-blue-400 max-w-xl text-center">
          Connect your Spotify account to get recommendations from the depths of
          your playlists.
        </p>
        <Input />
      </main>
      <SpotifyAuth />
    </>
  );
}
