import React, {useEffect, useRef} from "react";
import {drawAtContext} from "../core/draw.ts";
import {contrastColors} from "../Mapper.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    className?: string,
    withReduceSize?: boolean,
}


export const Biome = React.memo(({className, withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps.isReady === false) return;
        const container = drawAt.current;
        const elevation = maps.withElevation();
        const rivers = maps.withRivers();
        const biome = maps.withBiome();
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
            (v, i) => elevation[i] < 0 || rivers[i] ? [0, 40, 80, 255] : contrastColors[v],
            withReduceSize,
        );
    }, [maps, settings]);

    return (
        <canvas className={"h:full w:auto max-w:fit " + className} ref={drawAt}/>
    )
})