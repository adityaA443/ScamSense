'use client';
import { motion } from 'framer-motion';

interface Props { flags: string[]; }

export default function RedFlagsList({ flags }: Props) {
  if (!flags.length) return null;
  return (
    <div className="card p-6">
      <h3 className="text-[11px] uppercase tracking-widest text-[#86868b] mb-4">Red Flags</h3>
      <ul className="space-y-3">
        {flags.map((flag, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 + 0.2 }}
            className="flex items-start gap-3"
          >
            <div className="w-5 h-5 rounded-full bg-[#ff453a]/15 border border-[#ff453a]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff453a]" />
            </div>
            <span className="text-[#f5f5f7] text-[14px] leading-relaxed">{flag}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
