'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#222] bg-black/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-white" />
          <span className="font-semibold text-[15px] text-white tracking-tight">ScamSense</span>
        </Link>

        <div className="flex items-center gap-1">
          {[
            { href: '/', label: 'Detect' },
            { href: '/reports', label: 'Reports' },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors ${
                pathname === href
                  ? 'bg-white text-black'
                  : 'text-[#86868b] hover:text-white'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
