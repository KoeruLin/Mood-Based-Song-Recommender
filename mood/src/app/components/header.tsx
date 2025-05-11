import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-100 p-4 border-b border-gray-300">
            <nav className="flex gap-6 justify-center">
                <Link href="/" className="text-shadow-black font-bold font-hover:underline">Home</Link>
            </nav>
        </header>
    );
}