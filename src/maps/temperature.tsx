import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize: boolean,
}


export const Temperature = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {temperature} = maps;
        const size = {w: settings.width, h: temperature.length / settings.width};
        container.width = size.w;
        container.height = size.h;
        const context = container.getContext("2d");
        if (context === null) return;

        drawAtContext(
            context,
            size,
            temperature,
            "temperature",
            (v) => [
                v * 5 + 100,
                255 - Math.abs(v - 5) * 10,
                155 - v * 5,
                255,
            ],
            withReduceSize,
        );
    }, [maps, settings]);

    return (
        <canvas ref={drawAt}/>
    )
})