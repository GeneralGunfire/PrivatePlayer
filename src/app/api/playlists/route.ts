import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

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
    const redis = await getRedis();
    const raw = await redis.get(KEY);
    return raw ? (JSON.parse(raw) as PlaylistStore) : {};
  } catch {
    return {};
  }
}

async function saveStore(store: PlaylistStore) {
  const redis = await getRedis();
  await redis.set(KEY, JSON.stringify(store));
}

// GET /api/playlists
export async function GET() {
  const store = await getStore();
  return NextResponse.json(store);
}

// POST /api/playlists — create playlist
export async function POST(req: NextRequest) {
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const store = await getStore();
  const id = `pl_${Date.now()}`;
  store[id] = { id, name: name.trim(), trackIds: [], createdAt: Date.now() };

  await saveStore(store);
  return NextResponse.json(store[id]);
}
