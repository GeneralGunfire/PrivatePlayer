import { NextRequest, NextResponse } from "next/server";
import { readOverrides, writeOverrides } from "@/lib/playlist-store";

export const dynamic = "force-dynamic";

// PUT /api/playlists/[id]  { trackIds: string[] }
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { trackIds } = await req.json();
  if (!Array.isArray(trackIds)) {
    return NextResponse.json({ error: "trackIds must be an array" }, { status: 400 });
  }
  const overrides = readOverrides();
  overrides[id] = trackIds;
  writeOverrides(overrides);
  return NextResponse.json({ ok: true, id, trackIds });
}

// DELETE /api/playlists/[id]  — reset to default
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const overrides = readOverrides();
  delete overrides[id];
  writeOverrides(overrides);
  return NextResponse.json({ ok: true });
}
