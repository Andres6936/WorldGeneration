import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize?: boolean,
}


export const Photo = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {photo} = maps;
        const size = {w: settings.width, h: photo.length / settings.width};
        container.width = size.w;
        container.height = size.h;
        const context = container.getContext("2d");
        if (context === null) return;

        if (settings.generatePhoto) {
            drawAtContext(
                context,
                size,
                photo,
                "photo",
                (v) => v,
                withReduceSize,
            );
        }
    }, [maps, settings]);

    return (
        <canvas ref={drawAt}/>
    )
})