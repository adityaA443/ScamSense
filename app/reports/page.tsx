'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThumbsUp, RefreshCw, Clock, User, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ScamReport, Verdict } from '@/types';

const VERDICT_BADGE: Record<Verdict, { label: string; cls: string }> = {
  SCAM:        { label: 'Scam',        cls: 'badge-red' },
  LIKELY_SCAM: { label: 'Likely Scam', cls: 'badge-orange' },
  SUSPICIOUS:  { label: 'Suspicious',  cls: 'badge-yellow' },
  SAFE:        { label: 'Safe',        cls: 'badge-green' },
};

const FILTERS = ['All', 'IRS Tax Scam', 'Medicare Fraud', 'Lottery Scam', 'Phishing Email', 'Tech Support Scam', 'Romance Scam', 'Social Security Scam', 'Bank Impersonation'];

const CATEGORY_OPTIONS = FILTERS.slice(1);

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
  'Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky',
  'Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
  'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico',
  'New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania',
  'Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
];

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function mostFrequent(arr: string[]): string | null {
  if (!arr.length) return null;
  const counts: Record<string, number> = {};
  for (const v of arr) { counts[v] = (counts[v] || 0) + 1; }
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

interface LiveStats {
  total: number;
  today: number;
  topCategory: string;
  topState: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [allReports, setAllReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('');
  const [upvoted, setUpvoted] = useState<Set<string>>(new Set());
  const [stats, setStats] = useState<LiveStats>({ total: 0, today: 0, topCategory: '—', topState: '—' });

  const [formOpen, setFormOpen] = useState(false);
  const [formText, setFormText] = useState('');
  const [formCategory, setFormCategory] = useState(CATEGORY_OPTIONS[0]);
  const [formState, setFormState] = useState('');
  const [formName, setFormName] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  const computeStats = useCallback((data: ScamReport[]) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayCount = data.filter((r) => r.created_at.slice(0, 10) === todayStr).length;
    const categories = data.map((r) => r.category).filter(Boolean);
    const states = data.map((r) => r.state).filter((s): s is string => Boolean(s));
    setStats({
      total: data.length,
      today: todayCount,
      topCategory: mostFrequent(categories) ?? '—',
      topState: mostFrequent(states) ?? '—',
    });
  }, []);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reports?limit=500');
      const data: ScamReport[] = await res.json();
      const safeData = Array.isArray(data) ? data : [];
      setAllReports(safeData);
      computeStats(safeData);
    } catch {
      setAllReports([]);
    } finally {
      setLoading(false);
    }
  }, [computeStats]);

  useEffect(() => { fetchReports(); }, [fetchReports]);

  useEffect(() => {
    let filtered = allReports;
    if (filter !== 'All') filtered = filtered.filter((r) => r.category === filter);
    if (stateFilter) filtered = filtered.filter((r) => r.state === stateFilter);
    setReports(filtered.slice(0, 30));
  }, [allReports, filter, stateFilter]);

  const handleUpvote = async (id: string) => {
    if (upvoted.has(id)) return;
    setUpvoted((prev) => new Set(Array.from(prev).concat(id)));
    setReports((prev) => prev.map((r) => r.id === id ? { ...r, upvotes: (r.upvotes || 0) + 1 } : r));
    try {
      await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch { /* silent */ }
  };

  const handleFormSubmit = async () => {
    if (!formText.trim()) return;
    setFormSubmitting(true);
    try {
      await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text_snippet: formText.slice(0, 100),
          verdict: 'SCAM',
          category: formCategory,
          reporter_name: formName.trim() || null,
          state: formState || null,
        }),
      });
      setFormSuccess(true);
      setFormText('');
      setFormCategory(CATEGORY_OPTIONS[0]);
      setFormState('');
      setFormName('');
      setFormOpen(false);
      await fetchReports();
      setTimeout(() => setFormSuccess(false), 3000);
    } catch {
      /* silent */
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-3xl mx-auto">

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <p className="text-[11px] uppercase tracking-widest text-[#48484a] mb-2">Community</p>
            <h1 className="text-4xl font-bold text-white mb-3">Scam Reports</h1>
            <p className="text-[#86868b] text-[15px]">
              Real reports submitted by users. Fully anonymized.{' '}
              <span className="text-[#48484a]">The feed is live — new reports appear as people submit them.</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { value: stats.total.toString(), label: 'Total Reports' },
              { value: stats.today.toString(), label: "Today's Reports" },
              { value: stats.topCategory, label: 'Top Category' },
              { value: stats.topState, label: 'Top State' },
            ].map((s) => (
              <div key={s.label} className="card p-4">
                <p className="text-[22px] font-bold text-white leading-tight truncate">{s.value}</p>
                <p className="text-[11px] text-[#86868b] mt-1">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.12 }}
            className="card mb-8 overflow-hidden"
          >
            <button
              onClick={() => setFormOpen((v) => !v)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-white font-semibold text-[15px]">Report a Scam</span>
              {formOpen ? (
                <ChevronUp className="w-4 h-4 text-[#86868b]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[#86868b]" />
              )}
            </button>

            <AnimatePresence>
              {formOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-[#1a1a1a] pt-4 space-y-3">
                    <textarea
                      value={formText}
                      onChange={(e) => setFormText(e.target.value)}
                      placeholder="Paste the scam message..."
                      rows={3}
                      className="w-full bg-black border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[14px] text-white placeholder-[#48484a] focus:outline-none focus:border-[#444] transition-colors resize-none"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-[#86868b] mb-1.5">Category</label>
                        <select
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-black border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#444] transition-colors appearance-none"
                        >
                          {CATEGORY_OPTIONS.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#86868b] mb-1.5">State</label>
                        <select
                          value={formState}
                          onChange={(e) => setFormState(e.target.value)}
                          className="w-full bg-black border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white focus:outline-none focus:border-[#444] transition-colors appearance-none"
                        >
                          <option value="">— Select state —</option>
                          {US_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#86868b] mb-1.5">Your name (optional)</label>
                      <input
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        placeholder="Anonymous"
                        className="w-full bg-black border border-[#2a2a2a] rounded-xl px-3 py-2.5 text-[13px] text-white placeholder-[#48484a] focus:outline-none focus:border-[#444] transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleFormSubmit}
                      disabled={formSubmitting || !formText.trim()}
                      className="w-full py-2.5 bg-white hover:bg-[#f0f0f0] disabled:opacity-40 text-black font-semibold rounded-full text-[14px] transition-all"
                    >
                      {formSubmitting ? 'Submitting…' : formSuccess ? 'Report submitted!' : 'Submit Report'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex items-center gap-2 mb-6 flex-wrap"
          >
            <div className="flex flex-wrap gap-1.5 flex-1">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all ${
                    filter === f
                      ? 'bg-white text-black'
                      : 'border border-[#2a2a2a] text-[#86868b] hover:border-[#444] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="bg-black border border-[#2a2a2a] rounded-lg px-3 py-1.5 text-[12px] text-[#86868b] focus:outline-none focus:border-[#444] transition-colors appearance-none"
            >
              <option value="">All States</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button onClick={fetchReports} className="p-2 border border-[#2a2a2a] rounded-lg text-[#86868b] hover:text-white hover:border-[#444] transition-all">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <motion.div
                className="w-8 h-8 rounded-full border-[3px] border-[#333]"
                style={{ borderTopColor: '#fff' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          ) : reports.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-16 text-center">
              <p className="text-white font-semibold mb-2">No reports yet</p>
              <p className="text-[#86868b] text-[14px]">
                {filter !== 'All' || stateFilter
                  ? 'No reports for this filter. Try another.'
                  : 'Analyze a scam and hit "Share with Community" to add the first report.'}
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              <div className="space-y-px">
                {reports.map((report, i) => {
                  const badge = VERDICT_BADGE[report.verdict] ?? VERDICT_BADGE.SUSPICIOUS;
                  return (
                    <motion.div
                      key={report.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-start gap-4 py-4 border-b border-[#1a1a1a] last:border-0"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${badge.cls}`}>
                            {badge.label}
                          </span>
                          <span className="text-[12px] text-[#48484a]">{report.category}</span>
                        </div>
                        {report.text_snippet && (
                          <p className="text-[#86868b] text-[13px] truncate">&ldquo;{report.text_snippet}&rdquo;</p>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#48484a]" />
                            <span className="text-[#48484a] text-[11px]">{timeAgo(report.created_at)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-[#48484a]" />
                            <span className="text-[#48484a] text-[11px]">{report.reporter_name || 'Anonymous'}</span>
                          </div>
                          {report.state && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#48484a]" />
                              <span className="text-[#48484a] text-[11px]">{report.state}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleUpvote(report.id)}
                        disabled={upvoted.has(report.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[12px] font-medium transition-all flex-shrink-0 mt-0.5 ${
                          upvoted.has(report.id)
                            ? 'border-white/20 text-white cursor-default'
                            : 'border-[#2a2a2a] text-[#48484a] hover:border-[#444] hover:text-white'
                        }`}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        {report.upvotes || 0}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </AnimatePresence>
          )}

          {reports.length > 0 && (
            <p className="text-[#48484a] text-[12px] mt-8 text-center">
              {reports.length} reports · All data anonymized
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
