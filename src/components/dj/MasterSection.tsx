"use client";

import { DjKnob } from "./DjKnob";
import type { MasterSettings } from "@/lib/dj/audioGraph";

interface MasterSectionProps {
  settings: MasterSettings;
  onChange: (patch: Partial<MasterSettings>) => void;
}

/**
 * The master bus strip — EQ, limiter and output trim applied to the SUMMED
 * Deck A + Deck B signal, ported from Udaan's desktop DJ board (see that
 * file's own doc comment for why this needs the shared bus rather than
 * per-deck limiters). Same defaults: flat EQ, unity output, limiter OFF —
 * nothing here colors the sound unless explicitly turned on.
 */
export function MasterSection({ settings, onChange }: MasterSectionProps) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Master</span>

      <div className="flex items-end gap-3">
        <DjKnob
          label="Low"
          value={settings.low}
          min={-12}
          max={12}
          centerValue={0}
          size="sm"
          onChange={(v) => onChange({ low: v })}
          formatValue={(v) => `${v > 0 ? "+" : ""}${Math.round(v)}dB`}
        />
        <DjKnob
          label="Mid"
          value={settings.mid}
          min={-12}
          max={12}
          centerValue={0}
          size="sm"
          onChange={(v) => onChange({ mid: v })}
          formatValue={(v) => `${v > 0 ? "+" : ""}${Math.round(v)}dB`}
        />
        <DjKnob
          label="High"
          value={settings.high}
          min={-12}
          max={12}
          centerValue={0}
          size="sm"
          onChange={(v) => onChange({ high: v })}
          formatValue={(v) => `${v > 0 ? "+" : ""}${Math.round(v)}dB`}
        />
        <DjKnob
          label="Out"
          value={settings.outputGain}
          min={0}
          max={1.5}
          centerValue={1}
          size="sm"
          onChange={(v) => onChange({ outputGain: v })}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange({ limiterEnabled: !settings.limiterEnabled })}
          title="Brickwall limiter on the summed output — prevents clipping when both decks and their effects stack up"
          className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
            settings.limiterEnabled ? "bg-accent text-white" : "bg-white/8 text-white/40 hover:bg-white/12"
          }`}
        >
          Limiter
        </button>
        {settings.limiterEnabled && (
          <label className="flex items-center gap-1.5">
            <span className="text-[9px] text-white/35">Ceiling</span>
            <input
              type="range"
              min={-12}
              max={0}
              step={0.5}
              value={settings.ceilingDb}
              onChange={(e) => onChange({ ceilingDb: Number(e.target.value) })}
              className="h-1 w-16 accent-[var(--color-accent)]"
            />
            <span className="w-9 text-right text-[9px] tabular-nums text-white/35">
              {settings.ceilingDb.toFixed(1)}dB
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
