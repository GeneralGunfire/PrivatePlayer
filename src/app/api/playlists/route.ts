import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";

// KV key that stores all user playlists
const KEY = "playlists";

export interface StoredPlaylist {
  id: string;
  name: string;
  trackIds: string[];
  createdAt: number;
}

export type PlaylistStore = Record<string, StoredPlaylist>;

async function getStore(): Promise<PlaylistStore> {
  try {
    const data = await kv.get<PlaylistStore>(KEY);
    return data ?? {};
  } catch {
    return {};
  }
}

// GET /api/playlists — return all user playlists
export async function GET() {
  const store = await getStore();
  return NextResponse.json(store);
}

// POST /api/playlists — create a new playlist
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const store = await getStore();
  const id = `pl_${Date.now()}`;
  store[id] = { id, name: name.trim(), trackIds: [], createdAt: Date.now() };

  await kv.set(KEY, store);
  return NextResponse.json(store[id]);
}
