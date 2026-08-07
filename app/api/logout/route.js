import { NextResponse } from "next/server";
import { killSession } from "@/lib/auth";

export async function POST() {
    await killSession();
    return NextResponse.json({ success: true });
}