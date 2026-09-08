/**
 * Public surface of the DSP layer.
 *
 * Everything outside `lib/dsp/` imports from here rather than reaching
 * into individual effect modules, so the internal file layout can change
 * without touching hooks or components.
 */
export type { Effect, EffectFactory, ParamSpec, ParamValues } from './types'
export { defaultsFor, num, bool, dbToLinear, safeParam, RAMP } from './types'
export { WetDryEffect } from './wetDry'
export { EffectChain, createDeckChain, createStemChain, chainDefaults, deckChainDefaults } from './chain'
export { ECHO_DIVISIONS, divisionToMs } from './effects/time'

import type { ParamValues } from './types'
import { deckChainDefaults } from './chain'

/**
 * The rest position for a deck's whole rack, derived from the effect
 * schema rather than hand-written. A literal defaults object silently
 * drifts the moment an effect gains a parameter, and a missing entry
 * means that knob starts wherever its fallback happens to land instead of
 * at a deliberate, verified-inert value.
 *
 * Computed lazily (not at module scope) — this module gets imported by
 * player-context.tsx, which the root layout pulls in, and Next.js
 * evaluates that during server-side prerendering, where OfflineAudioContext
 * (which deckChainDefaults() constructs) does not exist. Udaan itself
 * never hit this: it's a Tauri webview, never server-rendered. `typeof
 * window === 'undefined'` during that prerender pass returns an empty
 * object instead of throwing; every real client render recomputes the
 * real defaults once and caches them.
 */
let cachedDefaults: ParamValues | null = null
export function getDeckDefaults(): ParamValues {
  if (typeof window === 'undefined') return {}
  if (!cachedDefaults) cachedDefaults = deckChainDefaults()
  return cachedDefaults
}

/**
 * Groups of parameters as the UI presents them. Kept here rather than in
 * a component so both decks, the preset system, and any future stem lane
 * agree on what belongs together — and so adding an effect means adding
 * one entry here, not editing panel markup.
 */
export interface RackSection {
  id: string
  label: string
  /** Parameter keys drawn in this section, in order. */
  keys: string[]
  /** Sections a user reaches for constantly sit outside the FX drawer. */
  primary?: boolean
}

export const RACK_SECTIONS: RackSection[] = [
  { id: 'level', label: 'Level', keys: ['gain'], primary: true },
  { id: 'eq', label: 'EQ', keys: ['bass', 'mid', 'treble'], primary: true },
  { id: 'kills', label: 'Kill', keys: ['killBass', 'killMid', 'killTreble'], primary: true },
  { id: 'filter', label: 'Filter', keys: ['filterSweep'], primary: true },
  { id: 'tone', label: 'Tone', keys: ['enhancer', 'muffle'] },
  { id: 'drive', label: 'Drive', keys: ['drive', 'bitcrush'] },
  { id: 'mod', label: 'Modulation', keys: ['flangerDepth', 'flangerRate', 'phaserDepth', 'phaserRate', 'wahDepth', 'wahRate'] },
  { id: 'space', label: 'Space', keys: ['echoAmount', 'echoTimeMs', 'echoFeedback', 'reverbAmount', 'reverbSize'] },
  { id: 'rhythm', label: 'Rhythm', keys: ['gateDepth', 'gateRate'] },
]
