import {create} from "zustand";
import {Settings} from "../d.ts";
import {defaultSettings} from "../settings.ts";
import {Layer} from "../core/enums.ts";

type State = {
    settings: Settings,
    currentLayer: Layer,
    compareLayer: Layer | null,
    showTooltip: boolean,
    showCanvasMap: boolean,
    showDebugCanvasMap: boolean,
}

type Actions = {
    setSettings: (settings: State['settings']) => void,
    setShowTooltip: (showTooltip: State['showTooltip']) => void,
    setShowCanvasMap: (showCanvasMap: State['showCanvasMap']) => void,
    setShowDebugCanvasMap: (showDebugCanvasMap: State['showDebugCanvasMap']) => void,
    setCurrentLayer: (layer: State['currentLayer']) => void,
    setCompareLayer: (layer: State['compareLayer'] | null) => void,
}

export const useSettings = create<State & Actions>((set) => ({
    settings: defaultSettings,
    showTooltip: true,
    showCanvasMap: false,
    showDebugCanvasMap: false,
    currentLayer: Layer.Elevation,
    compareLayer: null,
    setSettings: (newSettings) => set({settings: newSettings}),
    setShowTooltip: (showTooltip) => set({showTooltip: showTooltip}),
    setShowCanvasMap: (showCanvasMap) => set({showCanvasMap: showCanvasMap}),
    setShowDebugCanvasMap: (showDebugCanvasMap) => set({showDebugCanvasMap: showDebugCanvasMap}),
    setCurrentLayer: (layer) => set({currentLayer: layer}),
    setCompareLayer: (layer) => set({compareLayer: layer}),
}))

