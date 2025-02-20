import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Wind = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            wind,
        } = maps;

        showMap(
            settings,
            drawContainer,
            mapContainer,
            wind,
            "wind",
            (v) => [v * 100, 0, -v * 100, 255]
        );
    }, []);

    return (
        <div ref={drawAt}/>
    )
})