'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const EXAMPLES = [
  {
    label: 'IRS Tax Scam',
    text: 'IRS URGENT: You owe $2,847 in back taxes. Call 1-800-555-0199 immediately or face arrest warrant. This is your final notice before law enforcement is dispatched to your location.',
  },
  {
    label: 'Lottery Scam',
    text: "Congratulations! You've won $50,000 in the Publisher's Clearing House lottery. Send $500 processing fee to claim your prize. Call our claims office at 1-900-555-0177 within 48 hours.",
  },
  {
    label: 'Medicare Fraud',
    text: 'Medicare: Your new card is ready. Confirm your Social Security number at medicare-update.com to receive it. Failure to verify within 72 hours will result in suspension of your benefits.',
  },
];

const STATS = [
  { value: '$3.4B', label: 'lost to elder fraud yearly' },
  { value: '1 in 6', label: 'seniors targeted annually' },
  { value: '92%', label: 'of scams go unreported' },
];

export default function HomePage() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!text.trim()) { setError('Please paste some text first.'); return; }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Analysis failed');
      sessionStorage.setItem('scamsense_result', JSON.stringify(data));
      sessionStorage.setItem('scamsense_input', text.trim());
      router.push('/analyze');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      {/* Hero */}
      <section className="pt-36 pb-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck className="w-5 h-5 text-[#86868b]" />
              <span className="text-[#86868b] text-[13px] font-medium">AI Fraud Detection</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-5">
              Is this message
              <br />a scam?
            </h1>

            <p className="text-[#86868b] text-[17px] leading-relaxed mb-10 max-w-xl">
              Paste any suspicious text, email, or call transcript.
              AI analyzes it instantly and tells you exactly what to do.
            </p>
          </motion.div>

          {/* Input area */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
          >
            <div className="rounded-[18px] border border-[#333] bg-[#111] overflow-hidden focus-within:border-[#555] transition-colors">
              <textarea
                value={text}
                onChange={(e) => { setText(e.target.value); setError(''); }}
                placeholder="Paste the suspicious text here..."
                rows={6}
                maxLength={5000}
                className="w-full bg-transparent text-[#f5f5f7] placeholder-[#48484a] text-[15px] p-5 resize-none outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-5 py-3 border-t border-[#222]">
                <span className="text-[#48484a] text-[12px]">{text.length} / 5,000</span>
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !text.trim()}
                  className="flex items-center gap-2 px-5 py-2 bg-white hover:bg-[#f0f0f0] disabled:bg-[#333] disabled:text-[#666] disabled:cursor-not-allowed text-black font-semibold rounded-full text-[13px] transition-all"
                >
                  {loading ? (
                    <motion.div
                      className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5" />
                  )}
                  {loading ? 'Analyzing…' : 'Analyze'}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[#ff453a] text-[13px] mt-3 pl-1">{error}</p>
            )}

            {/* Examples */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-[#48484a] text-[12px]">Try:</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex.label}
                  onClick={() => setText(ex.text)}
                  className="text-[12px] px-3 py-1 rounded-full border border-[#2a2a2a] text-[#86868b] hover:border-[#444] hover:text-white transition-all"
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-[#86868b] text-[13px]">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-[#1a1a1a]">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="text-[11px] uppercase tracking-widest text-[#86868b] mb-3">How it works</h2>
            <p className="text-3xl font-bold text-white">Three steps. Instant answer.</p>
          </motion.div>

          <div className="space-y-px">
            {[
              { num: '01', title: 'Paste the text', desc: 'Copy any message, email, or transcript you received and paste it into the box.' },
              { num: '02', title: 'AI scans it', desc: 'Gemini AI checks it against 40+ known fraud patterns, urgent language, and deceptive tactics.' },
              { num: '03', title: 'Get your answer', desc: 'See the verdict, confidence score, red flags found, and exactly what to do next.' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-6 py-6 border-b border-[#1a1a1a] last:border-0"
              >
                <span className="text-[#48484a] text-[13px] font-mono w-6 flex-shrink-0 mt-0.5">{step.num}</span>
                <div>
                  <p className="text-white font-semibold mb-1">{step.title}</p>
                  <p className="text-[#86868b] text-[14px] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
