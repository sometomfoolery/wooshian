import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request) {
    const user = await getSession();

    if (!(user?.is_site_admin)) {
        return NextResponse.json({ error: 'You are not authorized to delete from the games table' }, { status: 403 });
    }

    const { id } = await request.json();

    const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game deleted successfully' }, { status: 200 });
}