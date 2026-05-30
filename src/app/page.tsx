"use client";

import { useState, useCallback } from "react";
import MusicPortfolio from "@/components/ui/music-portfolio";
import AudioPlayer from "@/components/ui/audio-player";
import { TRACKS } from "@/lib/tracks";

export default function Home() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerVisible, setPlayerVisible] = useState(false);

  const handleTrackSelect = useCallback((index: number) => {
    if (activeIndex === index) {
      // Toggle play/pause on same track
      setIsPlaying((p) => !p);
    } else {
      setActiveIndex(index);
      setIsPlaying(true);
    }
    setPlayerVisible(true);
  }, [activeIndex]);

  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i + 1) % TRACKS.length);
    setIsPlaying(true);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  const activeTrack = activeIndex >= 0 ? TRACKS[activeIndex] : null;

  return (
    <>
      <MusicPortfolio
        tracks={TRACKS}
        activeTrackIndex={activeIndex}
        isPlaying={isPlaying}
        onTrackSelect={handleTrackSelect}
      />

      <AudioPlayer
        track={activeTrack}
        tracks={TRACKS}
        onNext={handleNext}
        onPrev={handlePrev}
        isVisible={playerVisible}
        onClose={() => setPlayerVisible(false)}
      />
    </>
  );
}
