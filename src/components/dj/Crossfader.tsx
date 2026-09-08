"use client";

interface CrossfaderProps {
  /** -1 = full Deck A, 0 = center (both full), 1 = full Deck B. */
  value: number;
  onChange: (v: number) => void;
}

/**
 * A/B crossfader — ported from Udaan's desktop DJ board (same center-plays-
 * both behavior, a real mixer crossfader rather than two independent
 * volume sliders). Rebuilt as a bigger custom slider for touch: a native
 * <input type="range"> thumb is a small fixed target regardless of styling
 * on most mobile browsers, so this uses a larger, custom-drawn thumb with
 * `touch-action: none` on the whole track.
 */
export function Crossfader({ value, onChange }: CrossfaderProps) {
  function percentFromClientX(el: HTMLElement, clientX: number): number {
    const rect = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return frac * 2 - 1;
  }

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    onChange(percentFromClientX(e.currentTarget, e.clientX));
  }
  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.buttons !== 1 && e.pointerType !== "touch") return;
    if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
    onChange(percentFromClientX(e.currentTarget, e.clientX));
  }

  const thumbPercent = ((value + 1) / 2) * 100;

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-widest">
        <span className="text-accent-bright">A</span>
        <span className="text-white/30">Crossfader</span>
        <span className="text-white">B</span>
      </div>
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        className="relative h-9 w-full cursor-pointer rounded-full bg-white/8"
        style={{ touchAction: "none" }}
      >
        <div
          className="absolute top-1/2 h-7 w-7 -translate-y-1/2 rounded-full bg-white shadow-lg transition-[left] duration-75"
          style={{ left: `calc(${thumbPercent}% - 14px)` }}
        />
      </div>
    </div>
  );
}
