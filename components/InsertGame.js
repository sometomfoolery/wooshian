'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function getGameDesigners() {
    const supabase = createClient(supabaseUrl, supabasePublishableKey);
    const { data: designers, error } = await supabase.from("game_designers").select("*");
    return designers;
}

export default function InsertGame() {
    const [name, setName] = useState("");
    const [minimum_players, set_minimum_players] = useState("");
    const [maximum_players, set_maximum_players] = useState("");
    const [minimum_claimed_length_minutes, set_minimum_claimed_length_minutes] = useState("");
    const [maximum_claimed_length_minutes, set_maximum_claimed_length_minutes] = useState("");
    const [game_designer_id, set_game_designer_id] = useState("");
    const [game_publisher_id, set_game_publisher_id] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

    const gameDesigners = getGameDesigners();

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');

        const response = await fetch('/api/database/games/insert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                minimum_players,
                maximum_players,
                minimum_claimed_length_minutes,
                maximum_claimed_length_minutes,
                game_designer_id,
                game_publisher_id
            })
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error);
        } else {
            router.push('/games');
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Game Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                type="number"
                placeholder="Minimum Players"
                value={minimum_players}
                onChange={(e) => set_minimum_players(e.target.value)}
            />
            <input
                type="number"
                placeholder="Maximum Players"
                value={maximum_players}
                onChange={(e) => set_maximum_players(e.target.value)}
            />
            <input
                type="number"
                placeholder="Minimum Claimed Length (minutes)"
                value={minimum_claimed_length_minutes}
                onChange={(e) => set_minimum_claimed_length_minutes(e.target.value)}
            />
            <input
                type="number"
                placeholder="Maximum Claimed Length (minutes)"
                value={maximum_claimed_length_minutes}
                onChange={(e) => set_maximum_claimed_length_minutes(e.target.value)}
            />
            <input
                type="number"
                placeholder="Game Designer ID"
                value={game_designer_id}
                onChange={(e) => set_game_designer_id(e.target.value)}
            />
            <input
                type="number"
                placeholder="Game Publisher ID"
                value={game_publisher_id}
                onChange={(e) => set_game_publisher_id(e.target.value)}
            />
            <div>Game designers: {gameDesigners.map((designer) => (
                <span key={designer.id}>{designer.name}</span>
            ))}</div>
        </form>
    );
}