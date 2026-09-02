import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
        return new Response('Unauthorized', { status: 401 });
    }

    const { error } = await supabase.from('users').select('*').limit(1);

    if (error) {
        return NextResponse.json({ ok: false, error: error.message }, {status: 500});
    }

    return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}