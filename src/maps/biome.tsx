import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {contrastColors} from "../Mapper.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Biome = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            elevation,
            rivers,
            biome,
        } = maps;

        const canvas = showMap(
            settings,
            biome,
            "biome",
            (v, i) => elevation[i] < 0 || rivers[i] ? [0, 40, 80, 255] : contrastColors[v]
        );
        container.appendChild(canvas);
    }, [maps, settings]);

    return (
        <div ref={drawAt}/>
    )
})