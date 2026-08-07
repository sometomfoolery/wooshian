import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
    const { username, password } = await request.json();

    if (!username || !password) {
        return NextResponse.json({ error: 'You need a username and a password' }, {status: 400});
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const { data, error } = await supabase
        .from('users')
        .insert([{ username, password_hash: passwordHash }])
        .select('id, username')
        .single();
    
    if (error) {
        switch (error.code) {
            case '23505': // Duplicate key value -- assume username already exists
                return NextResponse.json({ error: 'Username already exists' }, {status: 409});
            default:
                return NextResponse.json({ error: error.code + ': ' + error.message }, {status: 400});
        }
    }

    return NextResponse.json({user: data}, {status: 201});
}