import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize: boolean,
}


export const Photo = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            photo
        } = maps;

        if (settings.generatePhoto) {
            const {canvasOriginalSize, canvasReduceSize} = showMap(
                settings,
                photo,
                "photo",
                (v) => v
            );
            if (withReduceSize) {
                container.replaceWith(canvasReduceSize);
            } else {
                container.replaceWith(canvasOriginalSize);
            }
        }
    }, [maps, settings]);

    return (
        <canvas ref={drawAt}/>
    )
})