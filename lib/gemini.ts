import Groq from 'groq-sdk';
import { AnalysisResult } from '@/types';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are ScamSense, an expert AI fraud detection system specializing in elder fraud, scams, and social engineering attacks. Analyze the provided text and determine if it is a scam.

You MUST respond with ONLY valid JSON (no markdown, no code blocks, no extra text) in this exact format:
{
  "verdict": "SCAM" | "LIKELY_SCAM" | "SUSPICIOUS" | "SAFE",
  "confidence": <number 0-100>,
  "category": "<specific scam type or 'Legitimate' if safe>",
  "redFlags": ["<red flag 1>", "<red flag 2>"],
  "explanation": "<clear explanation of why this is or isn't a scam>",
  "immediateActions": ["<action 1>", "<action 2>"],
  "reportTo": ["<authority 1>", "<authority 2>"]
}

Verdict guidelines:
- SCAM: Clear definitive scam (>85% confidence)
- LIKELY_SCAM: Strong fraud indicators (65-85%)
- SUSPICIOUS: Some red flags but uncertain (40-65%)
- SAFE: Appears legitimate (<40% scam probability)

Common categories: IRS Tax Scam, Medicare Fraud, Social Security Scam, Lottery Scam, Grandparent Scam, Romance Scam, Tech Support Scam, Phishing Email, Charity Fraud, Investment Fraud, Bank Impersonation, Package Delivery Scam`;

export async function analyzeText(text: string): Promise<AnalysisResult> {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Analyze this text:\n\n"${text}"` },
    ],
    temperature: 0.1,
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? '';
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  return JSON.parse(cleaned) as AnalysisResult;
}
