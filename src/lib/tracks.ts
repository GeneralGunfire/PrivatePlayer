// Track type definition — source of truth
export interface Track {
  id: number;
  artist: string;
  album: string;       // song title
  category: string;
  label: string;
  year: string;
  image: string;       // cover art URL (no people — use atmosphere/abstract/concert)
  src: string;         // e.g. "/music/filename.mp3"
  duration?: number;   // seconds — auto-filled at runtime from audio metadata
}
