import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const dynamic = 'force-dynamic';

async function GameLibraryData() {
    const supabase = createClient(supabaseUrl, supabasePublishableKey);
    const { data: games, error } = await supabase.from("games").select("*, game_designers(name), game_publishers(name)");
    if (error) {
        console.error("Error fetching games: ", error);
        return <p>Error fetching games.</p>;
    }

    const htmlTable = <table>
        <thead>
            <th>Game</th>
            <th>Player Count</th>
            <th>Game Length</th>
            <th>Designer</th>
            <th>Publisher</th>
        </thead>
        <tbody>
            {games.map((game) => (
                <tr key={game.id}>
                    <td>{game.name}</td>
                    <td>{game.minimum_players} - {game.maximum_players}</td>
                    <td>{game.minimum_claimed_length_minutes}-{game.maximum_claimed_length_minutes} minutes</td>
                    <td>{game.game_designers?.name}</td>
                    <td>{game.game_publishers?.name}</td>
                </tr>
            ))}
        </tbody>
    </table>;

    return htmlTable;
}

export default async function Home() {
    return (
        <div>
            <h1>Game Library</h1>
            <Suspense fallback="Loading...">
                <GameLibraryData />
            </Suspense>
        </div>
    );
}