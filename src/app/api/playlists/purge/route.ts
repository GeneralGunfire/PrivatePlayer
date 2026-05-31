import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

// One-time purge of old built-in playlist data from Redis.
// Keeps only entries with "pl_" prefix (user-created).
export async function POST() {
  try {
    const redis = await getRedis();
    const raw = await redis.get("playlists");
    if (!raw) return NextResponse.json({ ok: true, removed: 0 });

    const store = JSON.parse(raw) as Record<string, unknown>;
    const before = Object.keys(store).length;

    // Remove any key that isn't a user-created playlist
    for (const key of Object.keys(store)) {
      if (!key.startsWith("pl_")) delete store[key];
    }

    const after = Object.keys(store).length;
    await redis.set("playlists", JSON.stringify(store));

    return NextResponse.json({ ok: true, removed: before - after, kept: after });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
