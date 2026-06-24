'use client';
import { motion } from 'framer-motion';

interface Props {
  actions: string[];
  reportTo: string[];
}

export default function ActionSteps({ actions, reportTo }: Props) {
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div className="card p-6">
        <h3 className="text-[11px] uppercase tracking-widest text-[#86868b] mb-4">What To Do Now</h3>
        <ul className="space-y-3">
          {actions.map((action, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="flex items-start gap-3"
            >
              <span className="w-5 h-5 rounded-full bg-white/10 border border-white/10 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white mt-0.5">
                {i + 1}
              </span>
              <span className="text-[#f5f5f7] text-[14px] leading-relaxed">{action}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="card p-6">
        <h3 className="text-[11px] uppercase tracking-widest text-[#86868b] mb-4">Report To</h3>
        <ul className="space-y-3">
          {reportTo.map((org, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#86868b] flex-shrink-0" />
              <span className="text-[#f5f5f7] text-[14px]">{org}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
