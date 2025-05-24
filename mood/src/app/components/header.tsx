import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-100 p-4 border-b border-blue-200 outline-4 outline-blue-900">
      <nav className="flex gap-50 justify-center text-violet-400 font-bold">
        <Link href="/" className="hover:underline hover:text-violet-500">
          Home
        </Link>
      </nav>
    </header>
  );
}
