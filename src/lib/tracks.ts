export interface Track {
  id: number;
  artist: string;
  album: string;          // song title
  category: string;       // SINGLE / EP / ALBUM
  label: string;
  year: string;
  image: string;          // background art URL
  src: string;            // audio file path, e.g. "/music/my-song.mp3"
}

// ─────────────────────────────────────────────────────────
//  ADD YOUR TRACKS HERE
//  src: drop the .mp3 into /public/music/ and reference as "/music/filename.mp3"
//  image: Unsplash URL or any hosted image
// ─────────────────────────────────────────────────────────
export const TRACKS: Track[] = [
  {
    id: 1,
    artist: "COLDPLAY",
    album: "PARADISE",
    category: "SINGLE",
    label: "PARLOPHONE",
    year: "2011",
    src: "/music/paradise-coldplay.mp3",
    // Dreamy hot air balloon over golden fields — matches the Paradise video
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80",
  },
];
