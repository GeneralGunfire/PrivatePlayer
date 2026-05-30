import { Track, Playlist } from './types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Celestial Echoes',
    artist: 'Lumina Theory feat. Vesper',
    album: 'Midnight Sessions',
    coverUrl: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&q=80',
    duration: '04:15'
  },
  {
    id: '2',
    title: 'Neon Echoes',
    artist: 'Vapor Theory',
    album: 'Neon Nights',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80',
    duration: '03:42'
  },
  {
    id: '3',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
    duration: '04:03'
  },
  {
    id: '4',
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=800&q=80',
    duration: '03:32'
  },
  {
    id: '5',
    title: 'Starboy',
    artist: 'The Weeknd ft. Daft Punk',
    album: 'Starboy',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
    duration: '03:50'
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Midnight Sessions',
    description: 'Curated late-night vibes for deep focus and relaxation.',
    coverUrl: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
    tracks: MOCK_TRACKS,
    plays: '1.2M',
    duration: '2H 45M'
  },
  {
    id: 'p2',
    name: 'Chill Vibes',
    coverUrl: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&q=80',
    tracks: MOCK_TRACKS.slice(0, 3)
  },
  {
    id: 'p3',
    name: 'Focus Flow',
    coverUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80',
    tracks: MOCK_TRACKS.slice(2, 5)
  }
];
