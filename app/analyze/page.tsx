'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2, CheckCircle, RotateCcw } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VerdictCard from '@/components/VerdictCard';
import RedFlagsList from '@/components/RedFlagsList';
import ActionSteps from '@/components/ActionSteps';
import LoadingSpinner from '@/components/LoadingSpinner';
import ShareModal from '@/components/ShareModal';
import { AnalysisResult } from '@/types';

export default function AnalyzePage() {
  const router = useRouter();
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [inputText, setInputText] = useState('');
  const [shared, setShared] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('scamsense_result');
    const input = sessionStorage.getItem('scamsense_input');
    if (!stored) { router.replace('/'); return; }
    try {
      setResult(JSON.parse(stored) as AnalysisResult);
      setInputText(input || '');
    } catch {
      router.replace('/');
    }
  }, [router]);

  const handleAnalyzeAnother = () => {
    sessionStorage.removeItem('scamsense_result');
    sessionStorage.removeItem('scamsense_input');
    router.push('/');
  };

  if (!result) {
    return (
      <div className="min-h-screen bg-black">
        <Navbar />
        <div className="pt-20"><LoadingSpinner /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => router.push('/')}
            className="flex items-center gap-1.5 text-[#86868b] hover:text-white text-[13px] mb-8 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[11px] uppercase tracking-widest text-[#48484a] mb-2"
          >
            Analysis Result
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white mb-6"
          >
            Here&apos;s what we found
          </motion.h1>

          <div className="mb-4">
            <VerdictCard
              verdict={result.verdict}
              confidence={result.confidence}
              category={result.category}
              explanation={result.explanation}
            />
          </div>

          {inputText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="card p-4 mb-4"
            >
              <p className="text-[11px] uppercase tracking-widest text-[#48484a] mb-2">Analyzed text</p>
              <p className="text-[#86868b] text-[13px] line-clamp-2 leading-relaxed">{inputText}</p>
            </motion.div>
          )}

          {result.redFlags?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-4"
            >
              <RedFlagsList flags={result.redFlags} />
            </motion.div>
          )}

          {(result.immediateActions?.length > 0 || result.reportTo?.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <ActionSteps actions={result.immediateActions || []} reportTo={result.reportTo || []} />
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button
              onClick={handleAnalyzeAnother}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-[#f0f0f0] text-black font-semibold rounded-full text-[14px] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Analyze Another
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              disabled={shared}
              className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 font-semibold rounded-full border text-[14px] transition-all ${
                shared
                  ? 'border-[#30d158]/30 text-[#30d158] cursor-default'
                  : 'border-[#333] text-[#86868b] hover:border-[#555] hover:text-white disabled:opacity-40'
              }`}
            >
              {shared ? <CheckCircle className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {shared ? 'Added to Community' : 'Share with Community'}
            </button>
          </motion.div>
        </div>
      </div>
      <Footer />
      {showShareModal && result && (
        <ShareModal
          result={result}
          inputText={inputText}
          onClose={() => setShowShareModal(false)}
          onShared={() => { setShared(true); setShowShareModal(false); }}
        />
      )}
    </div>
  );
}
