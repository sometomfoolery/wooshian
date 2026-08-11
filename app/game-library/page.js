import { createClient } from "@supabase/supabase-js";
import { Suspense } from "react";

async function GameLibraryData() {
    const supabase = await createClient();
    const { data: games } = await supabase.from("games").select("*");
    return games;
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