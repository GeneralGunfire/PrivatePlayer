export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
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

export type ViewType = 'home' | 'search' | 'library' | 'player';
