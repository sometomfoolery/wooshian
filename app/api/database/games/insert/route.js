import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/auth';

export async function POST(request) {
    const user = await getSession();

    if (!(user?.is_site_admin)) {
        return NextResponse.json({ error: 'You are not authorized to insert into the games table' }, { status: 403 });
    }

    const {
        name,
        minimum_players,
        maximum_players,
        minimum_claimed_length_minutes,
        maximum_claimed_length_minutes,
        game_designer_id,
        game_publisher_id
    } = await request.json();

    const { error } = await supabase
        .from('games')
        .insert({
            name: name,
            minimum_players: minimum_players,
            maximum_players: maximum_players,
            minimum_claimed_length_minutes: minimum_claimed_length_minutes,
            maximum_claimed_length_minutes: maximum_claimed_length_minutes,
            game_designer_id: game_designer_id,
            game_publisher_id: game_publisher_id
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}