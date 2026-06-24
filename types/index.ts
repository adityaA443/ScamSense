export type Verdict = 'SCAM' | 'LIKELY_SCAM' | 'SUSPICIOUS' | 'SAFE';

export interface AnalysisResult {
  verdict: Verdict;
  confidence: number;
  category: string;
  redFlags: string[];
  explanation: string;
  immediateActions: string[];
  reportTo: string[];
}

export interface ScamReport {
  id: string;
  text_snippet: string;
  verdict: Verdict;
  category: string;
  created_at: string;
  upvotes: number;
  reporter_name?: string;
  state?: string;
}
