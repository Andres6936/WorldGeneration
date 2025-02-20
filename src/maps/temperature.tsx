import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
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
        const {
            temperature,
        } = maps;

        const {canvasOriginalSize, canvasReduceSize} = showMap(
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
        if (withReduceSize) {
            container.replaceWith(canvasReduceSize);
        } else {
            container.replaceWith(canvasOriginalSize);
        }
    }, [maps, settings]);

    return (
        <canvas ref={drawAt}/>
    )
})