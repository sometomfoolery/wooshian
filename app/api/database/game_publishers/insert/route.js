import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request) {
    const user = await getSession();

    if (!user?.is_site_admin) {
        return NextResponse.json({ error: 'You are not authorized to insert into the game publishers table' }, { status: 403 });
    }

    const {
        name
    } = await request.json();

    const { error } = await supabase
        .from('game_publishers')
        .insert({
            name: name
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game publisher inserted successfully' }, { status: 201 });
}