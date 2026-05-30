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
    artist: "YOUR NAME",
    album: "TRACK ONE",
    category: "SINGLE",
    label: "SELF RELEASED",
    year: "2024",
    src: "/music/track-one.mp3",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80",
  },
  {
    id: 2,
    artist: "YOUR NAME",
    album: "TRACK TWO",
    category: "SINGLE",
    label: "SELF RELEASED",
    year: "2024",
    src: "/music/track-two.mp3",
    image:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80",
  },
  {
    id: 3,
    artist: "YOUR NAME",
    album: "TRACK THREE",
    category: "SINGLE",
    label: "SELF RELEASED",
    year: "2023",
    src: "/music/track-three.mp3",
    image:
      "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&q=80",
  },
];
