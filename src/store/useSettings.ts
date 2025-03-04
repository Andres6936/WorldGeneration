import {create} from "zustand";
import {Settings} from "../d.ts";
import {defaultSettings} from "../settings.ts";
import {Layer} from "../core/enums.ts";

type State = {
    settings: Settings,
    currentLayer: Layer,
    showCanvasMap: boolean,
}

type Actions = {
    setSettings: (settings: State['settings']) => void,
    setShowCanvasMap: (showCanvasMap: State['showCanvasMap']) => void,
    setCurrentLayer: (layer: State['currentLayer']) => void,
}

export const useSettings = create<State & Actions>((set) => ({
    settings: defaultSettings,
    showCanvasMap: false,
    currentLayer: Layer.Elevation,
    setSettings: (newSettings) => set({settings: newSettings}),
    setShowCanvasMap: (showCanvasMap) => set({showCanvasMap: showCanvasMap}),
    setCurrentLayer: (layer) => set({currentLayer: layer}),
}))

