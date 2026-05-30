import { NextResponse } from "next/server";
import { readOverrides } from "@/lib/playlist-store";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(readOverrides());
}
