import {create} from "zustand";
import {GenerateMap} from "../Mapper.ts";

type State = {
    maps: GenerateMap | null,
}

type Actions = {
    setMaps: (maps: State['maps']) => void,
}

export const useMaps = create<State & Actions>((set) => ({
    maps: null,
    setMaps: (maps) => set({maps: maps}),
}))

