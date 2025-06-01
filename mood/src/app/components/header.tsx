import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-100 p-4 border-b border-blue-200 dark:border-gray-700 outline-4 outline-blue-900 dark:outline-gray-600">
      <nav className="flex justify-center gap-4 text-violet-400 font-bold">
        <Link href="/" className="hover:underline hover:text-violet-500">
          Home
        </Link>
      </nav>
    </header>
  );
}
