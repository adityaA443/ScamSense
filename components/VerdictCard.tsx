'use client';
import { motion } from 'framer-motion';
import { Verdict } from '@/types';
import CircularProgress from './CircularProgress';

const VERDICT_CONFIG: Record<Verdict, {
  label: string;
  color: string;
  dotClass: string;
  badgeClass: string;
  borderColor: string;
  pulseClass: string;
}> = {
  SCAM: {
    label: 'Scam Detected',
    color: '#ff453a',
    dotClass: 'bg-[#ff453a]',
    badgeClass: 'badge-red',
    borderColor: 'rgba(255,59,48,0.3)',
    pulseClass: 'verdict-pulse-red',
  },
  LIKELY_SCAM: {
    label: 'Likely a Scam',
    color: '#ff9f0a',
    dotClass: 'bg-[#ff9f0a]',
    badgeClass: 'badge-orange',
    borderColor: 'rgba(255,159,10,0.3)',
    pulseClass: '',
  },
  SUSPICIOUS: {
    label: 'Suspicious',
    color: '#ffd60a',
    dotClass: 'bg-[#ffd60a]',
    badgeClass: 'badge-yellow',
    borderColor: 'rgba(255,214,10,0.25)',
    pulseClass: '',
  },
  SAFE: {
    label: 'Appears Safe',
    color: '#30d158',
    dotClass: 'bg-[#30d158]',
    badgeClass: 'badge-green',
    borderColor: 'rgba(48,209,88,0.25)',
    pulseClass: 'verdict-pulse-green',
  },
};

interface Props {
  verdict: Verdict;
  confidence: number;
  category: string;
  explanation: string;
}

export default function VerdictCard({ verdict, confidence, category, explanation }: Props) {
  const cfg = VERDICT_CONFIG[verdict];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-[18px] p-6 md:p-8 ${cfg.pulseClass}`}
      style={{ background: '#111', border: `1px solid ${cfg.borderColor}` }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
        {/* Confidence ring */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <CircularProgress value={confidence} color={cfg.color} size={100} />
          <span className="text-[11px] text-[#48484a] uppercase tracking-widest">Confidence</span>
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${cfg.dotClass}`} />
            <span className="text-[13px] text-[#86868b] font-medium uppercase tracking-widest">Verdict</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">{cfg.label}</h2>
          <span className={`inline-flex text-[12px] font-semibold px-2.5 py-1 rounded-full ${cfg.badgeClass} mb-4`}>
            {category}
          </span>
          <p className="text-[#86868b] text-[15px] leading-relaxed">{explanation}</p>
        </div>
      </div>
    </motion.div>
  );
}
