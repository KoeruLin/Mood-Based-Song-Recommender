import "./globals.css";
import Input from "@/app/components/input";
import SpotifyAuth from "@/app/api/authorization/spotifyAuthentication";
import SongFinder from "@/app/api/authorization/songFinder";

export default function Home() {
  return (
    <>
      <main className="mt-6 flex justify-center font-sans items-center flex-col">
        <h1 className="text-4xl font-bold mb-4">SongFinder</h1>
        <p className="text-lg mb-8 text-blue-400 max-w-xl text-center">
          Connect your Spotify account to get recommendations from the depths of
          your playlists.
        </p>
        <Input />
      </main>
      <SongFinder />
      <SpotifyAuth />
    </>
  );
}
