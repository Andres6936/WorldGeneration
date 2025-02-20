import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Temperature = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            temperature,
        } = maps;

        const canvas = showMap(
            settings,
            temperature,
            "temperature",
            (v) => [
                v * 5 + 100,
                255 - Math.abs(v - 5) * 10,
                155 - v * 5,
                255,
            ]
        );
        container.replaceWith(canvas);
    }, [maps, settings]);

    return (
        <div ref={drawAt}/>
    )
})