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
        game_designer_name,
        game_publisher_name
    } = await request.json();

    async function get_or_create(table, name) {
        if (!name) return null;

        const { date: existing, error } = await supabase
            .from(table)
            .select()
            .eq('name', name)
            .single();

        if (error) {
            const { data: created } = await supabase
                .from(table)
                .insert({ name: name })
                .select()
                .single();
            return created.id;
        }

        return existing.id;
    }

    const reworked_game_designer_id = await get_or_create('game_designers', game_designer_name);
    const reworked_game_publishers_id = await get_or_create('game_publishers', game_publisher_name);

    const nullable_maximum_players = maximum_players || null;
    const nullable_minimum_claimed_length_minutes = minimum_claimed_length_minutes || null;
    const nullable_maximum_claimed_length_minutes = maximum_claimed_length_minutes || null;

    const { error } = await supabase
        .from('games')
        .insert({
            name: name,
            minimum_players: minimum_players,
            maximum_players: nullable_maximum_players,
            minimum_claimed_length_minutes: nullable_minimum_claimed_length_minutes,
            maximum_claimed_length_minutes: nullable_maximum_claimed_length_minutes,
            game_designer_id: reworked_game_designer_id,
            game_publisher_id: reworked_game_publishers_id
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game inserted successfully' }, { status: 201 });
}