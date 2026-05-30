import { NextResponse } from "next/server";

// On Vercel the filesystem is read-only — playlist overrides can't be persisted
// server-side. Return an empty overrides object; the client falls back to the
// defaults defined in data.ts.
export const dynamic = "force-static";

export async function GET() {
  return NextResponse.json({});
}
