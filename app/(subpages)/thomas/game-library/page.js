import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";
import styles from "./page.module.css";
import { getSession } from "@/lib/auth";
import InsertGame from "@/components/InsertGame";
import DeleteGame from "@/components/DeleteGame";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const dynamic = 'force-dynamic';

async function GameLibraryData({user}) {
    const supabase = createClient(supabaseUrl, supabasePublishableKey);
    const { data: games, error } = await supabase.from("games").select("*, game_designers(name), game_publishers(name)");
    if (error) {
        console.error("Error fetching games: ", error);
        return <p>Error fetching games.</p>;
    }

    const playerCount = (game) => {
        if (game.minimum_players && game.maximum_players) {
            return `${game.minimum_players}-${game.maximum_players}`;
        } else if (game.minimum_players) {
            return `${game.minimum_players}+`;
        } else if (game.maximum_players) {
            return `Up to ${game.maximum_players}`;
        }
    }

    const gameDuration = (game) => {
        if (game.minimum_claimed_length_minutes && game.maximum_claimed_length_minutes) {
            if (game.minimum_claimed_length_minutes === game.maximum_claimed_length_minutes) {
                return `${game.minimum_claimed_length_minutes} minutes`;
            }
            return `${game.minimum_claimed_length_minutes}-${game.maximum_claimed_length_minutes} minutes`;
        } else if (game.minimum_claimed_length_minutes) {
            return `${game.minimum_claimed_length_minutes}+ minutes`;
        } else if (game.maximum_claimed_length_minutes) {
            return `Up to ${game.maximum_claimed_length_minutes} minutes`;
        }
    }

    const htmlTable = <table>
        <thead>
            <th>Game</th>
            <th>Player Count</th>
            <th>Game Length</th>
            <th>Designer</th>
            <th>Publisher</th>
            { user?.is_site_admin && <th>Delete</th> }
        </thead>
        <tbody>
            {games.map((game) => (
                <tr key={game.id}>
                    <td><div className={styles.row-holder}>{game.name}</div></td>
                    <td><div className={styles.row-holder}>{playerCount(game)}</div></td>
                    <td><div className={styles.row-holder}>{gameDuration(game)}</div></td>
                    <td><div className={styles.row-holder}>{game.game_designers?.name}</div></td>
                    <td><div className={styles.row-holder}>{game.game_publishers?.name}</div></td>
                    { user?.is_site_admin && <td><div className={styles.row-holder}><DeleteGame gameId={game.id} /></div></td> }
                </tr>
            ))}
        </tbody>
    </table>;

    return htmlTable;
}

export default async function Home() {
    const user = await getSession();

    return (
        <div className={styles.page}>
            <h1>Game Library</h1>
            <Suspense fallback="Loading...">
                <GameLibraryData user={user} />
            </Suspense>
            <div>
                { user ? (
                    <div>
                        <h2>You are logged in as {user.username}</h2>
                        <InsertGame />
                    </div>
                ) : (
                    <h2>You are not logged in</h2>
                )}
            </div>
        </div>
    );
}