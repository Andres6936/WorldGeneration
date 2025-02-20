import {create} from "zustand";
import {Settings} from "../global";
import {defaultSettings} from "../settings.ts";

type State = {
    settings: Settings,
    showCanvasMap: boolean,
}

type Actions = {
    setSettings: (settings: State['settings']) => void,
    setShowCanvasMap: (showCanvasMap: State['showCanvasMap']) => void,
}

export const useSettings = create<State & Actions>((set) => ({
    settings: defaultSettings,
    showCanvasMap: false,
    setSettings: (newSettings) => set({settings: newSettings}),
    setShowCanvasMap: (showCanvasMap) => set({showCanvasMap: showCanvasMap}),
}))

