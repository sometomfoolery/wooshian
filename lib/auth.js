import { cookies } from 'next/headers';
import { supabase } from './supabase';

const SESSION_COOKIE = 'session_id';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

export async function createSession(userId) {
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    const { data, error } = await supabase
        .from('sessions')
        .insert([{ user_id: userId, expires_at: expiresAt.toISOString() }])
        .select('id')
        .single();

    if (error) throw error;

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, data.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: expiresAt,
        path: '/',
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const { data, error } = await supabase
        .from('sessions')
        .select('user_id, expires_at, users (id, username, is_site_admin)')
        .eq('id', sessionId)
        .single();
    
    if (error || !data) return null;
    if (new Date(data.expires_at) < new Date()) return null;

    return data.users;
}

export async function killSession() {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (sessionId) {
        await supabase.from('sessions').delete().eq('id', sessionId);
        cookieStore.delete(SESSION_COOKIE);
    }
}