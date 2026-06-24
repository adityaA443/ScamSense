'use client';
import { motion } from 'framer-motion';

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5">
      <motion.div
        className="w-10 h-10 rounded-full border-[3px] border-[#333]"
        style={{ borderTopColor: '#fff' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      <div className="text-center">
        <p className="text-white font-medium">Analyzing with AI</p>
        <p className="text-[#86868b] text-[13px] mt-1">This takes a few seconds</p>
      </div>
    </div>
  );
}
