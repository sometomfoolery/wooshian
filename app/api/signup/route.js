import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request) {
    const { username, password } = await request.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'You need a username and a password' }, {status: 400});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabaseAdmin
        .from('users')
        .insert([{ username, password: passwordHash }])
        .select('id, username')
        .single();
}