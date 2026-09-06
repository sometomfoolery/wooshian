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

    const htmlTable = <div className={styles.table}>
        <div className={styles.table_header}>
            <div className={styles.table_cell}>Game</div>
            <div className={styles.table_cell}>Player Count</div>
            <div className={styles.table_cell}>Game Length</div>
            <div className={styles.table_cell}>Designer</div>
            <div className={styles.table_cell}>Publisher</div>
            { user?.is_site_admin && <div className={styles.table_cell}>Delete</div> }
        </div>
        <div className={styles.table_body}>
            {games.map((game) => (
                <div key={game.id} className={styles.table_row}>
                    <div className={styles.table_cell}>
                        <div className={styles.row_holder}>{game.name}</div>
                    </div>
                    <div className={styles.table_cell}>
                        <div className={styles.row_holder}>{playerCount(game)}</div>
                    </div>
                    <div className={styles.table_cell}>
                        <div className={styles.row_holder}>{gameDuration(game)}</div>
                    </div>
                    <div className={styles.table_cell}>
                        <div className={styles.row_holder}>{game.game_designers?.name}</div>
                    </div>
                    <div className={styles.table_cell}>
                        <div className={styles.row_holder}>{game.game_publishers?.name}</div>
                    </div>
                    { user?.is_site_admin && <div className={styles.table_cell}><div className={styles.row_holder}><DeleteGame gameId={game.id} /></div></div> }
                </div>
            ))}
        </div>
    </div>;

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