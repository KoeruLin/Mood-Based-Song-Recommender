import "./globals.css";
import Input from "@/app/components/input";
import SpotifyAuth from "@/app/components/authorization/spotifyAuthentication";
import SongFinder from "@/app/components/authorization/songFinder";

export default function Home() {
  return (
    <div>
      <Input />
      <main className="flex justify-center p-24 font-sans">
        <SpotifyAuth />
      </main>
      <SongFinder />
    </div>
  );
}
