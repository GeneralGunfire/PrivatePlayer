import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { PlaylistStore } from "../route";

const KEY = "playlists";

async function getStore(): Promise<PlaylistStore> {
  try {
    const data = await kv.get<PlaylistStore>(KEY);
    return data ?? {};
  } catch {
    return {};
  }
}

// PUT /api/playlists/[id] — update tracks or rename
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

  await kv.set(KEY, store);
  return NextResponse.json(store[id]);
}

// DELETE /api/playlists/[id] — remove a playlist
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
  await kv.set(KEY, store);
  return NextResponse.json({ ok: true });
}
