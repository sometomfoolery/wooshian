'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export default function InsertGame() {
    const [name, setName] = useState("");
    const [minimum_players, set_minimum_players] = useState("");
    const [maximum_players, set_maximum_players] = useState("");
    const [minimum_claimed_length_minutes, set_minimum_claimed_length_minutes] = useState("");
    const [maximum_claimed_length_minutes, set_maximum_claimed_length_minutes] = useState("");
    const [game_designer_name, set_game_designer_name] = useState("");
    const [game_publisher_name, set_game_publisher_name] = useState("");
    const [game_designers, set_game_designers] = useState([]);
    const [game_publishers, set_game_publishers] = useState([]);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        async function getGameDesigners() {
            const supabase = createClient(supabaseUrl, supabasePublishableKey);
            const { data: designers, error } = await supabase.from("game_designers").select("*");
            if (error) {
                console.error("Error fetching game designers: ", error);
                return;
            }
            set_game_designers(designers);
        }

        async function getGamePublishers() {
            const supabase = createClient(supabaseUrl, supabasePublishableKey);
            const { data: publishers, error } = await supabase.from("game_publishers").select("*");
            if (error) {
                console.error("Error fetching game publishers: ", error);
                return;
            }
            set_game_publishers(publishers);
        }

        getGameDesigners();
        getGamePublishers();
    }, []);

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
                game_designer_name,
                game_publisher_name
            })
        });

        if (response.ok) {
            setName('');
            set_minimum_players('');
            set_maximum_players('');
            set_minimum_claimed_length_minutes('');
            set_maximum_claimed_length_minutes('');
            set_game_designers([]);
            set_game_publishers([]);
            setError('');
            router.refresh();

        } else {
            const data = await response.json();
            setError(data.error);
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
            {/*<select
                value={game_designer_id}
                onChange={(e) => set_game_designer_id(e.target.value)}
            >
                <option value="">Select a game designer</option>
                {game_designers.map((designer) => (
                    <option key={designer.id} value={designer.id}>
                        {designer.name}
                    </option>
                ))}
            </select>*/}
            <div>
                <input
                    type="text"
                    placeholder="New Game Designer Name"
                    value={game_designer_name}
                    onChange={(e) => set_game_designer_name(e.target.value)}
                />
                <div>
                    {game_designers.map((designer) => (
                        <button type="button" key={designer.id} onClick = {() => set_game_designer_name(designer.name)}>
                            {designer.name}
                        </button>
                    ))}
                </div>
            </div>
            {/*<select
                value={game_publisher_id}
                onChange={(e) => set_game_publisher_id(e.target.value)}
            >
                <option value="">Select a game publisher</option>
                {game_publishers.map((publisher) => (
                    <option key={publisher.id} value={publisher.id}>
                        {publisher.name}
                    </option>
                ))}
            </select>*/}
            <div>
                <input
                    type="text"
                    placeholder="New Game Publisher Name"
                    value={game_publisher_name}
                    onChange={(e) => set_game_publisher_name(e.target.value)}
                />
                <div>
                    {game_publishers.map((publisher) => (
                        <button type="button" key={publisher.id} onClick = {() => set_game_publisher_name(publisher.name)}>
                            {publisher.name}
                        </button>
                    ))}
                </div>
            </div>
            <button type="submit">Insert Game</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    );
}