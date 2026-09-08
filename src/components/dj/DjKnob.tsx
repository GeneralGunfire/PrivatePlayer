"use client";

import { useCallback, useEffect, useRef } from "react";

interface DjKnobProps {
  label: string;
  value: number;
  min: number;
  max: number;
  /** Value that renders as the knob's rest position — for a ±15dB EQ this
   * is 0 (pointer straight up, arc drawn outward from centre); for a
   * 0-100% effect it's the minimum (pointer fully counter-clockwise, arc
   * drawn from the left, matching a real mixer's off position). */
  centerValue?: number;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  /** Fractional step for continuous params (e.g. LFO rate in Hz). Whole
   * numbers by default, since most controls here are dB or percent. */
  step?: number;
  size?: "sm" | "md";
  /** Dims the whole control when its effect is bypassed upstream. */
  disabled?: boolean;
}

const MIN_ANGLE = -135;
const MAX_ANGLE = 135;
const SWEEP = MAX_ANGLE - MIN_ANGLE;

/**
 * Rotary knob, drag-vertical to adjust — ported from Udaan's desktop DJ
 * board (same interaction, same rAF-throttled pointer handling, same real
 * value-arc rendering). Two changes for touch: bigger hit targets (56/64px
 * here vs. 38/46px on desktop — a finger is not a mouse cursor) and
 * `touch-action: none` on the drag surface so a vertical knob-drag doesn't
 * also try to scroll the page underneath it.
 */
export function DjKnob({
  label,
  value,
  min,
  max,
  centerValue,
  onChange,
  formatValue,
  step = 1,
  size = "md",
  disabled = false,
}: DjKnobProps) {
  const dragStartRef = useRef<{ y: number; value: number } | null>(null);
  const rafRef = useRef<number | null>(null);
  const pendingValueRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const px = size === "sm" ? 52 : 64;
  const fraction = clamp01((value - min) / (max - min));
  const angle = MIN_ANGLE + fraction * SWEEP;

  const restFraction = centerValue === undefined ? 0 : clamp01((centerValue - min) / (max - min));
  const restAngle = MIN_ANGLE + restFraction * SWEEP;
  const arcFrom = Math.min(restAngle, angle);
  const arcTo = Math.max(restAngle, angle);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (disabled) return;
      e.currentTarget.setPointerCapture(e.pointerId);
      dragStartRef.current = { y: e.clientY, value };
    },
    [value, disabled],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragStartRef.current) return;
      const deltaY = dragStartRef.current.y - e.clientY;
      // Slightly longer travel than desktop (180px vs 150px) — touch drags
      // are naturally a bit less precise than a mouse, so the full range
      // spans a bit more finger travel for the same effective resolution.
      const travel = e.shiftKey ? 700 : 180;
      const deltaFraction = deltaY / travel;
      const raw = dragStartRef.current.value + deltaFraction * (max - min);
      const snapped = Math.round(raw / step) * step;
      const next = Math.min(max, Math.max(min, snapped));
      pendingValueRef.current = Number(next.toFixed(4));
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (pendingValueRef.current !== null) onChangeRef.current(pendingValueRef.current);
      });
    },
    [min, max, step],
  );

  const handlePointerUp = useCallback(() => {
    dragStartRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (pendingValueRef.current !== null) onChangeRef.current(pendingValueRef.current);
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;
      const coarse = (max - min) / 10;
      let next: number | null = null;
      if (e.key === "ArrowUp" || e.key === "ArrowRight") next = value + (e.shiftKey ? step : coarse);
      else if (e.key === "ArrowDown" || e.key === "ArrowLeft") next = value - (e.shiftKey ? step : coarse);
      else if (e.key === "Home") next = centerValue ?? min;
      if (next === null) return;
      e.preventDefault();
      onChange(Number(Math.min(max, Math.max(min, next)).toFixed(4)));
    },
    [value, min, max, step, centerValue, onChange, disabled],
  );

  const isActive = centerValue !== undefined && Math.abs(value - centerValue) > 1e-6;

  return (
    <div className={`flex flex-col items-center gap-1 select-none ${disabled ? "opacity-40" : ""}`}>
      <div
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuetext={formatValue ? formatValue(value) : String(value)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        onDoubleClick={() => centerValue !== undefined && !disabled && onChange(centerValue)}
        style={{ width: px, height: px, touchAction: "none" }}
        className={`relative rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          disabled ? "cursor-default" : "cursor-ns-resize"
        }`}
        title={`${label} — drag to adjust, double-tap to reset`}
      >
        <svg viewBox="0 0 48 48" className="h-full w-full overflow-visible">
          <path
            d={arcPath(MIN_ANGLE, MAX_ANGLE, 21)}
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {isActive && (
            <path
              d={arcPath(arcFrom, arcTo, 21)}
              fill="none"
              stroke="var(--color-accent-bright)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          )}
          <circle cx="24" cy="24" r="16" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
          <g transform={`rotate(${angle} 24 24)`}>
            <rect
              x="23.25"
              y="10"
              width="1.5"
              height="8"
              rx="0.75"
              fill={isActive ? "var(--color-accent-bright)" : "rgba(255,255,255,0.4)"}
            />
          </g>
        </svg>
      </div>
      <span className={`text-[10px] font-bold tabular-nums ${isActive ? "text-white" : "text-white/40"}`}>
        {formatValue ? formatValue(value) : value}
      </span>
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{label}</span>
    </div>
  );
}

function clamp01(v: number): number {
  return Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0;
}

function arcPath(fromDeg: number, toDeg: number, radius: number): string {
  const a = polar(fromDeg, radius);
  const b = polar(toDeg, radius);
  const largeArc = Math.abs(toDeg - fromDeg) > 180 ? 1 : 0;
  return `M ${a.x} ${a.y} A ${radius} ${radius} 0 ${largeArc} 1 ${b.x} ${b.y}`;
}

function polar(deg: number, radius: number): { x: number; y: number } {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: 24 + radius * Math.cos(rad), y: 24 + radius * Math.sin(rad) };
}
