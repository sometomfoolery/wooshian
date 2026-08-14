import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export default async function Home() {
    return <div>
        <h1>Thomas</h1>
        <ul>
            <li><a href="/thomas/game-library">Game Library</a></li>
        </ul>
    </div>;
}