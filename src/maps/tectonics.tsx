import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Tectonics = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            tectonic,
        } = maps;

        const {canvasOriginalSize} = showMap(
            settings,
            tectonic,
            "tectonics",
            (v) => [0, 0, 0, v * 255]
        );
        container.replaceWith(canvasOriginalSize);
    }, [maps, settings]);

    return (
        <div ref={drawAt}/>
    )
})