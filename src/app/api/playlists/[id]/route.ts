import { NextRequest, NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";
import type { PlaylistStore } from "../route";

const KEY = "playlists";

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

// PUT /api/playlists/[id] — update tracks or name
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const store = await getStore();

  if (!store[id]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (Array.isArray(body.trackIds)) store[id].trackIds = body.trackIds;
  if (typeof body.name === "string" && body.name.trim()) store[id].name = body.name.trim();

  await saveStore(store);
  return NextResponse.json(store[id]);
}

// DELETE /api/playlists/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const store = await getStore();

  if (!store[id]) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  delete store[id];
  await saveStore(store);
  return NextResponse.json({ ok: true });
}
