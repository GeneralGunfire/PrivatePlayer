import type { Track } from "@/lib/tracks";

export interface Playlist {
  id: string;
  name: string;
  description: string;
  color: string;        // dominant accent (used for hero gradient)
  cover: string;        // cover image URL
  trackIds: number[];   // ordered list of track IDs
}

// ── All tracks ────────────────────────────────────────────
export const ALL_TRACKS: Track[] = [
  {
    id: 1,
    artist: "Coldplay",
    album: "Paradise",
    category: "SINGLE",
    label: "Parlophone",
    year: "2011",
    src: "/music/paradise-coldplay.mp3",
    // Coldplay — saturated concert lights, no people
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
  },
  {
    id: 2,
    artist: "Coldplay",
    album: "In My Place",
    category: "SINGLE",
    label: "Parlophone",
    year: "2002",
    src: "/music/in-my-place-coldplay.mp3",
    // Coldplay — moody stage glow
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  },
];

// ── Playlists ─────────────────────────────────────────────
export const PLAYLISTS: Playlist[] = [
  {
    id: "coldplay",
    name: "Coldplay",
    description: "Every Coldplay track in the collection",
    color: "#4f8ef7",
    cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    trackIds: [1, 2],
  },
  {
    id: "instrumentals",
    name: "Instrumentals",
    description: "Pure music, no words needed",
    color: "#c084fc",
    cover: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&q=80",
    trackIds: [],
  },
  {
    id: "movies",
    name: "Movies",
    description: "Scores and soundtracks that hit different",
    color: "#f97316",
    cover: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80",
    trackIds: [],
  },
  {
    id: "calm",
    name: "Calm",
    description: "Wind down. Breathe.",
    color: "#34d399",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
    trackIds: [],
  },
  {
    id: "love",
    name: "Love",
    description: "For the moments that matter",
    color: "#f43f5e",
    cover: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&q=80",
    trackIds: [],
  },
  {
    id: "legends",
    name: "Legends",
    description: "Old music that never gets old",
    color: "#fbbf24",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&q=80",
    trackIds: [],
  },
  {
    id: "vibes",
    name: "Vibes",
    description: "Whatever the mood calls for",
    color: "#06b6d4",
    cover: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&q=80",
    trackIds: [],
  },
];

export function getPlaylistTracks(playlist: Playlist): Track[] {
  return playlist.trackIds
    .map(id => ALL_TRACKS.find(t => t.id === id))
    .filter(Boolean) as Track[];
}
