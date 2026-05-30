/**
 * Playlist store — server-side read/write of playlists.json
 * Stores per-playlist overrides: { [playlistId]: string[] } (array of track IDs)
 * An empty array means "remove all", undefined means "use default from data.ts"
 */
import fs from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "public", "playlists.json");

export type PlaylistOverrides = Record<string, string[]>;

export function readOverrides(): PlaylistOverrides {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch {
    return {};
  }
}

export function writeOverrides(data: PlaylistOverrides) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}
