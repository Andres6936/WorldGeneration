import {create} from "zustand";
import {Settings} from "../global";
import {defaultSettings} from "../settings.ts";

type State = {
    settings: Settings,
}

type Actions = {}

export const useSettings = create<State & Actions>(() => ({
    settings: defaultSettings,
}))

