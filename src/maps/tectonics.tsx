import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize: boolean,
}


export const Tectonics = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            tectonic,
        } = maps;

        const {canvasOriginalSize, canvasReduceSize} = drawAtContext(
            settings,
            tectonic,
            "tectonics",
            (v) => [0, 0, 0, v * 255]
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