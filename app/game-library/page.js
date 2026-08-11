import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

async function GameLibraryData() {
    const supabase = await createClient(supabaseUrl, supabasePublishableKey);
    const { data: games, error } = await supabase.from("games").select("*");
    if (error) {
        console.error("Error fetching games: ", error);
        return <p>Error fetching games.</p>;
    }
    return <pre>{JSON.stringify(games, null, 2)}</pre>;
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