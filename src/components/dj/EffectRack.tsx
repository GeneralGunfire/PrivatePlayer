"use client";

import { useMemo, useState } from "react";
import { DjKnob } from "./DjKnob";
import { RACK_SECTIONS, type ParamSpec, type ParamValues } from "@/lib/dj/dsp";

interface EffectRackProps {
  specs: ParamSpec[];
  values: ParamValues;
  onChange: (patch: ParamValues) => void;
}

/**
 * The deck's effect rack, rendered from the chain's own parameter schema —
 * ported from Udaan's desktop DJ board unchanged in structure (grouped
 * sections, four always-visible + the rest in an on-demand drawer). Touch
 * targets on the section-toggle pills and knobs are sized for fingers
 * (see DjKnob's own comment on that).
 */
export function EffectRack({ specs, values, onChange }: EffectRackProps) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const specByKey = useMemo(() => new Map(specs.map((s) => [s.key, s])), [specs]);
  const sections = useMemo(
    () =>
      RACK_SECTIONS.map((section) => ({
        ...section,
        specs: section.keys.map((k) => specByKey.get(k)).filter((s): s is ParamSpec => Boolean(s)),
      })).filter((s) => s.specs.length > 0),
    [specByKey],
  );

  const primary = sections.filter((s) => s.primary);
  const secondary = sections.filter((s) => !s.primary);

  return (
    <div className="flex flex-col gap-3">
      {primary.map((section) => (
        <Section key={section.id} label={section.label}>
          <div className="flex flex-wrap items-end justify-center gap-3">
            {section.specs.map((spec) => (
              <Control key={spec.key} spec={spec} values={values} onChange={onChange} />
            ))}
          </div>
        </Section>
      ))}

      <div className="flex flex-wrap gap-1.5 border-t border-white/8 pt-3">
        {secondary.map((section) => {
          const engaged = section.specs.some((s) => isEngaged(s, values));
          const open = openSection === section.id;
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => setOpenSection(open ? null : section.id)}
              aria-expanded={open}
              className={`relative rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                open ? "bg-white/15 text-white" : "text-white/40 hover:bg-white/8 hover:text-white/70"
              }`}
            >
              {section.label}
              {engaged && (
                <span
                  aria-label="active"
                  className="bg-accent-bright absolute top-0.5 right-1 h-1.5 w-1.5 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {secondary
        .filter((s) => s.id === openSection)
        .map((section) => (
          <Section key={section.id} label={section.label}>
            <div className="flex flex-wrap items-end justify-center gap-3">
              {section.specs.map((spec) => (
                <Control key={spec.key} spec={spec} values={values} onChange={onChange} size="sm" />
              ))}
            </div>
          </Section>
        ))}
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{label}</span>
      {children}
    </div>
  );
}

function Control({
  spec,
  values,
  onChange,
  size = "md",
}: {
  spec: ParamSpec;
  values: ParamValues;
  onChange: (patch: ParamValues) => void;
  size?: "sm" | "md";
}) {
  if (spec.kind === "toggle") {
    const on = values[spec.key] === true;
    return (
      <button
        type="button"
        onClick={() => onChange({ [spec.key]: !on })}
        aria-pressed={on}
        title={spec.label}
        className={`rounded-lg px-3 py-2 text-[10px] font-bold tracking-wide transition-colors ${
          on ? "bg-red-500 text-white" : "bg-white/8 text-white/40 hover:bg-white/12"
        }`}
      >
        {spec.label.replace(/^Kill\s*/i, "").toUpperCase()}
      </button>
    );
  }

  const raw = values[spec.key];
  const value = typeof raw === "number" && Number.isFinite(raw) ? raw : spec.neutral;
  return (
    <DjKnob
      label={spec.label}
      value={value}
      min={spec.min}
      max={spec.max}
      centerValue={spec.neutral}
      step={spec.step ?? 1}
      size={size}
      formatValue={spec.format}
      onChange={(v) => onChange({ [spec.key]: v })}
    />
  );
}

function isEngaged(spec: ParamSpec, values: ParamValues): boolean {
  const v = values[spec.key];
  if (spec.kind === "toggle") return v === true;
  return typeof v === "number" && Math.abs(v - spec.neutral) > 1e-6;
}
