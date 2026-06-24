import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { Verdict } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '20');

    const state = searchParams.get('state');

    let query = supabase
      .from('scam_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (state && state !== 'all') {
      query = query.eq('state', state);
    }

    const { data, error } = await query;

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (error: unknown) {
    console.error('Reports fetch error:', error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { text_snippet, verdict, category, reporter_name, state } = await request.json();

    if (!text_snippet || !verdict || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const snippet = typeof text_snippet === 'string' ? text_snippet.slice(0, 100) : '';

    const insertData: {
      text_snippet: string;
      verdict: Verdict;
      category: string;
      reporter_name?: string;
      state?: string;
    } = { text_snippet: snippet, verdict: verdict as Verdict, category };

    if (reporter_name && typeof reporter_name === 'string') {
      insertData.reporter_name = reporter_name;
    }
    if (state && typeof state === 'string') {
      insertData.state = state;
    }

    const { data, error } = await supabase
      .from('scam_reports')
      .insert([insertData])
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Report submit error:', error);
    const message = error instanceof Error ? error.message : 'Failed to save report';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const { data, error } = await supabase.rpc('increment_upvotes', { report_id: id });
    if (error) {
      // Fallback: manual increment
      const { data: current } = await supabase
        .from('scam_reports')
        .select('upvotes')
        .eq('id', id)
        .single();
      const { data: updated } = await supabase
        .from('scam_reports')
        .update({ upvotes: ((current?.upvotes as number) || 0) + 1 })
        .eq('id', id)
        .select()
        .single();
      return NextResponse.json(updated);
    }
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to upvote';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
