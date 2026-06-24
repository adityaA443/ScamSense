'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnalysisResult, Verdict } from '@/types';

interface ShareModalProps {
  result: AnalysisResult;
  inputText: string;
  onClose: () => void;
  onShared: () => void;
}

const VERDICT_BADGE: Record<Verdict, { label: string; cls: string }> = {
  SCAM:        { label: 'Scam',        cls: 'badge-red' },
  LIKELY_SCAM: { label: 'Likely Scam', cls: 'badge-orange' },
  SUSPICIOUS:  { label: 'Suspicious',  cls: 'badge-yellow' },
  SAFE:        { label: 'Safe',        cls: 'badge-green' },
};

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

export default function ShareModal({ result, inputText, onClose, onShared }: ShareModalProps) {
  const [name, setName] = useState('');
  const [state, setState] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const badge = VERDICT_BADGE[result.verdict] ?? VERDICT_BADGE.SUSPICIOUS;

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text_snippet: inputText.slice(0, 100),
          verdict: result.verdict,
          category: result.category,
          reporter_name: name.trim() || null,
          state: state || null,
        }),
      });
      onShared();
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="card p-6 w-full max-w-md"
        >
          <p className="text-[11px] uppercase tracking-widest text-[#48484a] mb-1">Community</p>
          <h2 className="text-xl font-bold text-white mb-5">Share with Community</h2>

          <div className="flex items-center gap-2 mb-5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
              {badge.label}
            </span>
            <span className="text-[13px] text-[#86868b]">{result.category}</span>
          </div>

          <div className="space-y-3 mb-6">
            <div>
              <label className="block text-[12px] text-[#86868b] mb-1.5">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anonymous"
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[14px] text-white placeholder-[#48484a] focus:outline-none focus:border-[#444] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[12px] text-[#86868b] mb-1.5">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#111] border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[#444] transition-colors appearance-none"
              >
                <option value="">— Select state —</option>
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-3 bg-white hover:bg-[#f0f0f0] disabled:opacity-50 text-black font-semibold rounded-full text-[14px] transition-all mb-3"
          >
            {submitting ? 'Submitting…' : 'Share Report'}
          </button>

          <button
            onClick={onClose}
            className="w-full text-[13px] text-[#86868b] hover:text-white transition-colors py-1"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
