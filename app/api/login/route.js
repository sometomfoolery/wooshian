import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabase } from '@/lib/supabase';
import { createSession } from '@/lib/auth';

export async function POST(request) {
    const { username, password } = await request.json();

    const { data: user, error } = await supabase
        .from('users')
        .select('id, password_hash')
        .eq('username', username)
        .single();

    if (error || !user) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const passwordIsValid = await bcrypt.compare(password, user.password_hash);
    if (!passwordIsValid) {
        return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    await createSession(user.id);

    return NextResponse.json({ success: true });
}