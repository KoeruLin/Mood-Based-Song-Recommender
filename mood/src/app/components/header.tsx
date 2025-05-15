import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-blue-100 p-4 border-b border-blue-200">
            <nav className="flex gap-50 justify-center text-violet-400 font-bold">
                <Link href='/energetic' className='hover:underline hover:text-violet-500'>Energetic</Link>
                <Link href='/calm' className='hover:underline hover:text-violet-500'>Calm</Link>
                <Link href="/" className='hover:underline hover:text-violet-500'>Home</Link>
                <Link href='/melancholic' className='hover:underline hover:text-violet-500'>Melancholic</Link>
                <Link href='/tense' className='hover:underline hover:text-violet-500'>Tense</Link>
            </nav>
        </header>
    );
}