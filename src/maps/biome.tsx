import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {contrastColors} from "../Mapper.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize: boolean,
}


export const Biome = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            elevation,
            rivers,
            biome,
        } = maps;
        const size = {w: settings.width, h: biome.length / settings.width};
        container.width = size.w;
        container.height = size.h;
        const context = container.getContext("2d");
        if (context === null) return;

        drawAtContext(
            context,
            size,
            biome,
            "biome",
            (v, i) => elevation[i] < 0 || rivers[i] ? [0, 40, 80, 255] : contrastColors[v]
        );
    }, [maps, settings]);

    return (
        <canvas ref={drawAt}/>
    )
})