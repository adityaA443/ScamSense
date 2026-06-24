import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ScamSense — AI-Powered Scam Detector',
  description: 'Instantly detect scams and fraud with AI. Protect yourself and your loved ones from elder fraud, phishing, and social engineering attacks.',
  keywords: 'scam detector, elder fraud, phishing detection, AI fraud analysis',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0a0f1e] text-slate-100">
        {children}
      </body>
    </html>
  );
}
