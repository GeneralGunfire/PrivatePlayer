import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const musicDir = path.join(process.cwd(), "public", "music");
  try {
    const files = fs
      .readdirSync(musicDir)
      .filter(f => f.toLowerCase().endsWith(".mp3"))
      .sort();
    return NextResponse.json({ files });
  } catch {
    return NextResponse.json({ files: [] });
  }
}
