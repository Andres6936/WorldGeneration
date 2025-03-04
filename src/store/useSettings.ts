import {create} from "zustand";
import {Settings} from "../d.ts";
import {defaultSettings} from "../settings.ts";
import {Layer} from "../core/enums.ts";

type State = {
    settings: Settings,
    currentLayer: Layer,
    compareLayer: Layer,
    showCompare: boolean,
    showTooltip: boolean,
    showCanvasMap: boolean,
    showDebugCanvasMap: boolean,
}

type Actions = {
    setSettings: (settings: State['settings']) => void,
    setShowTooltip: (showTooltip: State['showTooltip']) => void,
    setShowCompare: (showCompare: State['showCompare']) => void,
    setShowCanvasMap: (showCanvasMap: State['showCanvasMap']) => void,
    setShowDebugCanvasMap: (showDebugCanvasMap: State['showDebugCanvasMap']) => void,
    setCurrentLayer: (layer: State['currentLayer']) => void,
}

export const useSettings = create<State & Actions>((set) => ({
    settings: defaultSettings,
    showTooltip: true,
    showCompare: false,
    showCanvasMap: false,
    showDebugCanvasMap: false,
    currentLayer: Layer.Elevation,
    compareLayer: Layer.Biome,
    setSettings: (newSettings) => set({settings: newSettings}),
    setShowTooltip: (showTooltip) => set({showTooltip: showTooltip}),
    setShowCompare: (showCompare) => set({showCompare: showCompare}),
    setShowCanvasMap: (showCanvasMap) => set({showCanvasMap: showCanvasMap}),
    setShowDebugCanvasMap: (showDebugCanvasMap) => set({showDebugCanvasMap: showDebugCanvasMap}),
    setCurrentLayer: (layer) => set({currentLayer: layer}),
}))

