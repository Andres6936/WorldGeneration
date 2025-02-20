import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Humidity = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            elevation,
            rivers,
            wind,
            humidity,
        } = maps;

        const canvas = showMap(
            settings,
            humidity,
            "humidity",
            (v, i) =>
                rivers[i] && elevation[i] > 0
                    ? [0, 0, 0, 255]
                    : i % settings.width < 20
                        ? [wind[i] * 100, 0, -wind[i] * 100, 255]
                        : elevation[i] < 0
                            ? [0, 0, 0, 255]
                            : [300 - v * 1000, elevation[i] * 200 + 50, v * 350 - 150, 255]
        );
        container.appendChild(canvas);
    }, []);

    return (
        <div ref={drawAt}/>
    )
})