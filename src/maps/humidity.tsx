import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize?: boolean,
}


export const Humidity = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps.isReady === false) return;
        const container = drawAt.current;
        const elevation = maps.withElevation();
        const rivers = maps.withRivers();
        const wind = maps.withWind();
        const humidity = maps.withHumidity();

        const size = {w: settings.width, h: humidity.length / settings.width};
        container.width = size.w;
        container.height = size.h;
        const context = container.getContext("2d");
        if (context === null) return;

        drawAtContext(
            context,
            size,
            humidity,
            "humidity",
            (v, i) =>
                rivers[i] && elevation[i] > 0
                    ? [0, 0, 0, 255]
                    : i % settings.width < 20
                        ? [wind[i] * 100, 0, -wind[i] * 100, 255]
                        : elevation[i] < 0
                            ? [0, 0, 0, 255]
                            : [300 - v * 1000, elevation[i] * 200 + 50, v * 350 - 150, 255],
            withReduceSize,
        );
    }, [maps, settings]);

    return (
        <canvas ref={drawAt}/>
    )
})