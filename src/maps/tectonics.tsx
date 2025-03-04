import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    className?: string,
    withReduceSize?: boolean,
}


export const Tectonics = React.memo(({className, withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps.isReady === false) return;
        const container = drawAt.current;
        const tectonic = maps.withTectonic();
        const size = {w: settings.width, h: tectonic.length / settings.width};
        container.width = size.w;
        container.height = size.h;
        const context = container.getContext("2d");
        if (context === null) return;

        drawAtContext(
            context,
            size,
            tectonic,
            "tectonics",
            (v) => [0, 0, 0, v * 255],
            withReduceSize,
        );
    }, [maps, settings]);

    return (
        <canvas className={"h:full w:auto max-w:fit " + className} ref={drawAt}/>
    )
})