import {create} from "zustand";
import {Settings} from "../global";
import {defaultSettings} from "../settings.ts";

type State = {
    settings: Settings,
}

type Actions = {
    setSettings: (settings: Settings) => void,
}

export const useSettings = create<State & Actions>((set) => ({
    settings: defaultSettings,
    setSettings: (newSettings) => set({settings: newSettings}),
}))

