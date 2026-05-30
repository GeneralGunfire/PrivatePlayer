"use client";

import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import type { Track } from "@/lib/tracks";

gsap.registerPlugin(ScrambleTextPlugin);

// ── Time Display ─────────────────────────────────────────
const TimeDisplay = ({ timeZone = "UTC" }: { timeZone?: string }) => {
  const [time, setTime] = useState({ hours: "", minutes: "", dayPeriod: "" });

  useEffect(() => {
    const update = () => {
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
      }).formatToParts(new Date());
      setTime({
        hours: parts.find((p) => p.type === "hour")?.value ?? "",
        minutes: parts.find((p) => p.type === "minute")?.value ?? "",
        dayPeriod: parts.find((p) => p.type === "dayPeriod")?.value ?? "",
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timeZone]);

  return (
    <time className="corner-item bottom-right" id="current-time">
      {time.hours}
      <span className="time-blink">:</span>
      {time.minutes} {time.dayPeriod}
    </time>
  );
};

// ── Project Row ───────────────────────────────────────────
interface ProjectItemProps {
  track: Track;
  index: number;
  onMouseEnter: (index: number, imageUrl: string) => void;
  onMouseLeave: () => void;
  onClick: (index: number) => void;
  isActive: boolean;
  isPlaying: boolean;
  isIdle: boolean;
}

const ProjectItem = forwardRef<HTMLLIElement, ProjectItemProps>(
  ({ track, index, onMouseEnter, onMouseLeave, onClick, isActive, isPlaying, isIdle }, ref) => {
    const artistRef = useRef<HTMLSpanElement>(null);
    const albumRef = useRef<HTMLSpanElement>(null);
    const categoryRef = useRef<HTMLSpanElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);
    const yearRef = useRef<HTMLSpanElement>(null);

    const fields: Array<[React.RefObject<HTMLSpanElement | null>, keyof Track]> = [
      [artistRef, "artist"],
      [albumRef, "album"],
      [categoryRef, "category"],
      [labelRef, "label"],
      [yearRef, "year"],
    ];

    useEffect(() => {
      fields.forEach(([r, key]) => {
        if (!r.current) return;
        if (isActive) {
          gsap.killTweensOf(r.current);
          gsap.to(r.current, {
            duration: 0.8,
            scrambleText: {
              text: String(track[key]),
              chars: "qwerty1337h@ck3r",
              revealDelay: 0.3,
              speed: 0.4,
            },
          });
        } else {
          gsap.killTweensOf(r.current);
          r.current.textContent = String(track[key]);
        }
      });
    }, [isActive]);

    return (
      <li
        ref={ref}
        className={`project-item ${isActive ? "active" : ""} ${isIdle ? "idle" : ""}`}
        onMouseEnter={() => onMouseEnter(index, track.image)}
        onMouseLeave={onMouseLeave}
        onClick={() => onClick(index)}
        style={{ cursor: "pointer" }}
      >
        <span ref={artistRef} className="project-data artist">
          {isPlaying && isActive ? "▶ " : ""}{track.artist}
        </span>
        <span ref={albumRef} className="project-data album">
          {track.album}
        </span>
        <span ref={categoryRef} className="project-data category">
          {track.category}
        </span>
        <span ref={labelRef} className="project-data label">
          {track.label}
        </span>
        <span ref={yearRef} className="project-data year">
          {track.year}
        </span>
      </li>
    );
  }
);
ProjectItem.displayName = "ProjectItem";

// ── Main Portfolio ────────────────────────────────────────
interface MusicPortfolioProps {
  tracks: Track[];
  activeTrackIndex: number;
  isPlaying: boolean;
  onTrackSelect: (index: number) => void;
  config?: {
    timeZone?: string;
    idleDelay?: number;
  };
  socialLinks?: {
    spotify?: string;
    email?: string;
    x?: string;
  };
  location?: string;
}

const MusicPortfolio = ({
  tracks,
  activeTrackIndex,
  isPlaying,
  onTrackSelect,
  config = {},
  socialLinks = {},
  location = "",
}: MusicPortfolioProps) => {
  const { timeZone = "UTC", idleDelay = 4000 } = config;
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [isIdle, setIsIdle] = useState(true);

  const backgroundRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleAnimRef = useRef<gsap.core.Timeline | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const stopIdleAnim = useCallback(() => {
    if (idleAnimRef.current) {
      idleAnimRef.current.kill();
      idleAnimRef.current = null;
      itemRefs.current.forEach((el) => el && gsap.set(el, { opacity: 1 }));
    }
  }, []);

  const startIdleAnim = useCallback(() => {
    if (idleAnimRef.current) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      tl.to(el, { opacity: 0.05, duration: 0.1 }, i * 0.05);
      tl.to(el, { opacity: 1, duration: 0.1 }, tracks.length * 0.05 * 0.5 + i * 0.05);
    });
    idleAnimRef.current = tl;
  }, [tracks.length]);

  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      if (hoveredIndex === -1) {
        setIsIdle(true);
        startIdleAnim();
      }
    }, idleDelay);
  }, [hoveredIndex, idleDelay, startIdleAnim]);

  const stopIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
  }, []);

  const handleMouseEnter = useCallback(
    (index: number, imageUrl: string) => {
      stopIdleAnim();
      stopIdleTimer();
      setIsIdle(false);
      setHoveredIndex(index);

      if (imageUrl && backgroundRef.current) {
        const bg = backgroundRef.current;
        bg.style.transition = "none";
        bg.style.transform = "translate(-50%, -50%) scale(1.2)";
        bg.style.backgroundImage = `url(${imageUrl})`;
        bg.style.opacity = "1";
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            bg.style.transition = "opacity 0.6s ease, transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)";
            bg.style.transform = "translate(-50%, -50%) scale(1.0)";
          })
        );
      }
    },
    [stopIdleAnim, stopIdleTimer]
  );

  const handleMouseLeave = useCallback(() => {}, []);

  const handleContainerLeave = useCallback(() => {
    setHoveredIndex(-1);
    if (backgroundRef.current) backgroundRef.current.style.opacity = "0";
    startIdleTimer();
  }, [startIdleTimer]);

  useEffect(() => {
    startIdleTimer();
    return () => {
      stopIdleTimer();
      stopIdleAnim();
    };
  }, []);

  // Preload images
  useEffect(() => {
    tracks.forEach((t) => {
      if (t.image) new Image().src = t.image;
    });
  }, [tracks]);

  return (
    <div className="container">
      <main
        className={`portfolio-container ${hoveredIndex !== -1 ? "has-active" : ""}`}
        onMouseLeave={handleContainerLeave}
      >
        <h1 className="sr-only">Music Portfolio</h1>
        <ul className="project-list" role="list">
          {tracks.map((track, i) => (
            <ProjectItem
              key={track.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              track={track}
              index={i}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={onTrackSelect}
              isActive={hoveredIndex === i}
              isPlaying={isPlaying && activeTrackIndex === i}
              isIdle={isIdle}
            />
          ))}
        </ul>
      </main>

      <div
        ref={backgroundRef}
        className="background-image"
        role="img"
        aria-hidden="true"
      />

      <aside className="corner-elements">
        <div className="corner-item top-left">
          <div className="corner-square" aria-hidden="true" />
        </div>
        <nav className="corner-item top-right">
          {socialLinks.spotify && (
            <a href={socialLinks.spotify} target="_blank" rel="noopener">Spotify</a>
          )}
          {socialLinks.spotify && socialLinks.email && " | "}
          {socialLinks.email && (
            <a href={socialLinks.email}>Email</a>
          )}
          {socialLinks.email && socialLinks.x && " | "}
          {socialLinks.x && (
            <a href={socialLinks.x} target="_blank" rel="noopener">X</a>
          )}
        </nav>
        {location && <div className="corner-item bottom-left">{location}</div>}
        <TimeDisplay timeZone={timeZone} />
      </aside>
    </div>
  );
};

export default MusicPortfolio;
