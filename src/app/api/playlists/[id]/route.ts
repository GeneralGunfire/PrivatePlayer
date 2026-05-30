import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// On Vercel the filesystem is read-only — writes are accepted but not persisted.
// Playlist state is managed client-side; this endpoint is a no-op stub.

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { trackIds } = await req.json();
  if (!Array.isArray(trackIds)) {
    return NextResponse.json({ error: "trackIds must be an array" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, id, trackIds });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ ok: true, id });
}
