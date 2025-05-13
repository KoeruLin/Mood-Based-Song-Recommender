import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-gray-100 p-4 border-b border-gray-300">
            <nav className="flex gap-50 justify-center text-shadow-black font-bold">
                <Link href='/energetic' className='hover:underline'>Energetic</Link>
                <Link href='/calm' className='hover:underline'>Calm</Link>
                <Link href="/" className='hover:underline'>Home</Link>
                <Link href='/melancholic' className='hover:underline'>Melancholic</Link>
                <Link href='/tense' className='hover:underline'>Tense</Link>
            </nav>
        </header>
    );
}