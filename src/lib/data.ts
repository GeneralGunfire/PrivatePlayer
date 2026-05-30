export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  src: string;            // real audio file
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  tracks: Track[];
  plays?: string;
  duration?: string;
}

// ── Real tracks ───────────────────────────────────────────
export const ALL_TRACKS: Track[] = [
  {
    id: "1",
    title: "Paradise",
    artist: "Coldplay",
    album: "Mylo Xyloto",
    // Coldplay — saturated concert lights, no people
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    duration: "4:38",
    src: "/music/paradise-coldplay.mp3",
  },
  {
    id: "2",
    title: "In My Place",
    artist: "Coldplay",
    album: "A Rush of Blood to the Head",
    // Coldplay — moody atmospheric stage glow
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    duration: "3:48",
    src: "/music/in-my-place-coldplay.mp3",
  },
];

// ── Playlists ─────────────────────────────────────────────
export const PLAYLISTS: Playlist[] = [
  {
    id: "coldplay",
    name: "Coldplay",
    description: "Every Coldplay track in the collection",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tracks: ALL_TRACKS,
    plays: "2.1M",
    duration: "8 Min",
  },
  {
    id: "instrumentals",
    name: "Instrumentals",
    description: "Pure music, no words needed",
    coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",
    tracks: [],
  },
  {
    id: "movies",
    name: "Movies",
    description: "Scores and soundtracks that hit different",
    coverUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",
    tracks: [],
  },
  {
    id: "calm",
    name: "Calm",
    description: "Wind down. Breathe.",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tracks: [],
  },
  {
    id: "love",
    name: "Love",
    description: "For the moments that matter",
    coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
    tracks: [],
  },
  {
    id: "legends",
    name: "Legends",
    description: "Old music that never gets old",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    tracks: [],
  },
  {
    id: "vibes",
    name: "Vibes",
    description: "Whatever the mood calls for",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    tracks: [],
  },
];
