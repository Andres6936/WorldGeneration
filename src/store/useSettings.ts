import {create} from "zustand";
import {Settings} from "../d.ts";
import {defaultSettings} from "../settings.ts";
import {Layer} from "../core/enums.ts";

type State = {
    settings: Settings,
    currentLayer: Layer,
    showTooltip: boolean,
    showCanvasMap: boolean,
}

type Actions = {
    setSettings: (settings: State['settings']) => void,
    setShowTooltip: (showTooltip: State['showTooltip']) => void,
    setShowCanvasMap: (showCanvasMap: State['showCanvasMap']) => void,
    setCurrentLayer: (layer: State['currentLayer']) => void,
}

export const useSettings = create<State & Actions>((set) => ({
    settings: defaultSettings,
    showTooltip: true,
    showCanvasMap: false,
    currentLayer: Layer.Elevation,
    setSettings: (newSettings) => set({settings: newSettings}),
    setShowTooltip: (showTooltip) => set({showTooltip: showTooltip}),
    setShowCanvasMap: (showCanvasMap) => set({showCanvasMap: showCanvasMap}),
    setCurrentLayer: (layer) => set({currentLayer: layer}),
}))

