import {create} from "zustand";
import {Mapper} from "../Mapper.ts";

type State = {
    maps: Mapper,
}

type Actions = {
    setMaps: (maps: State['maps']) => void,
}

export const useMaps = create<State & Actions>((set) => ({
    maps: new Mapper(),
    setMaps: (maps) => set({maps: maps}),
}))

