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
        game_publisher_id,
        new_game_designer_name,
        new_game_publisher_name
    } = await request.json();

    var new_game_designer_id = "";

    if (new_game_designer_name) {
        const { data: newDesigner, error: designerError } = await supabase
            .from('game_designers')
            .insert({ name: new_game_designer_name })
            .select()
            .single();

        if (designerError) {
            return NextResponse.json({ error: designerError.message }, { status: 500 });
        }

        new_game_designer_id = newDesigner.id;
    }

    var new_game_publisher_id = "";

    if (new_game_publisher_name) {
        const { data: newPublisher, error: publisherError } = await supabase
            .from('game_publishers')
            .insert({ name: new_game_publisher_name })
            .select()
            .single();

        if (publisherError) {
            return NextResponse.json({ error: publisherError.message }, { status: 500 });
        }

        new_game_publisher_id = newPublisher.id;
    }

    const final_game_designer_id = new_game_designer_id || game_designer_id || null;
    const final_game_publisher_id = new_game_designer_id || game_publisher_id || null;

    const { error } = await supabase
        .from('games')
        .insert({
            name: name,
            minimum_players: minimum_players,
            maximum_players: maximum_players,
            minimum_claimed_length_minutes: minimum_claimed_length_minutes,
            maximum_claimed_length_minutes: maximum_claimed_length_minutes,
            game_designer_id: final_game_designer_id,
            game_publisher_id: final_game_publisher_id
        });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game inserted successfully' }, { status: 201 });
}