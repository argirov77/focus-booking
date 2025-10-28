import Link from 'next/link';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Focus Booking',
  description: 'Simple booking frontend for FastAPI backend',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Focus Booking</h1>
            <nav className="text-sm">
              <Link className="hover:underline" href="/">
                Home
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        <footer className="border-t bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-gray-500">© {new Date().getFullYear()} Focus</div>
        </footer>
      </body>
    </html>
  );
}
