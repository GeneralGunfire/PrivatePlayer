export interface Track {
  id: number;
  artist: string;
  album: string;          // song title
  category: string;       // SINGLE / EP / ALBUM
  label: string;
  year: string;
  image: string;          // background art URL
  src: string;            // audio file path, e.g. "/music/my-song.mp3"
  duration?: number;      // seconds — optional, shows year if not set
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
    // Coldplay — colourful confetti/lights atmosphere matching their visual identity
    image:
      "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&q=80",
  },
];
