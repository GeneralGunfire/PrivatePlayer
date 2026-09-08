"use client";

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ensureMasterBus,
  getMasterBus,
  applyMasterSettings,
  MASTER_DEFAULTS,
  type MasterSettings,
} from '../audioGraph'

export interface MasterBusControls {
  settings: MasterSettings
  setSettings: (patch: Partial<MasterSettings>) => void
  reset: () => void
  /** FFT tap on the summed post-master signal — for a mix-level meter, as
   * distinct from each deck's own analyser (which shows only that deck). */
  analyser: AnalyserNode | null
}

/**
 * React binding for the shared master bus (lib/audioGraph.ts) — the stage
 * that only became possible once both decks stopped owning separate
 * AudioContexts and started summing into one node.
 *
 * The bus itself is a module-level singleton with page lifetime, not React
 * state, because it is shared by both decks and must survive this panel
 * unmounting. This hook only mirrors its settings into React and pushes
 * changes back down; it never creates or destroys the bus's nodes.
 */
export function useMasterBus(): MasterBusControls {
  const [settings, setSettingsState] = useState<MasterSettings>(MASTER_DEFAULTS)
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null)
  const settingsRef = useRef<MasterSettings>(MASTER_DEFAULTS)
  settingsRef.current = settings

  // The bus only exists after the first user-gesture play on either deck,
  // which may well be AFTER this panel mounts. Rather than poll, adopt it
  // opportunistically: if it already exists take it now, otherwise pick it
  // up on the next settings change (which is itself a user gesture).
  useEffect(() => {
    const bus = getMasterBus()
    if (bus) setAnalyser(bus.analyser)
  }, [])

  const setSettings = useCallback((patch: Partial<MasterSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch }
      const bus = ensureMasterBus()
      if (bus) {
        applyMasterSettings(bus, next, bus.ctx.currentTime)
        setAnalyser((cur) => cur ?? bus.analyser)
      }
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setSettingsState(MASTER_DEFAULTS)
    const bus = getMasterBus()
    if (bus) applyMasterSettings(bus, MASTER_DEFAULTS, bus.ctx.currentTime)
  }, [])

  return { settings, setSettings, reset, analyser }
}
