import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {elevation2Image} from "../UtilImage.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = {
    withReduceSize: boolean,
}

export const Elevation = React.memo(({withReduceSize}: Props) => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            elevation,
            rivers,
        } = maps;

        const {canvasOriginalSize, canvasReduceSize} = showMap(
            settings,
            elevation,
            "elevation",
            elevation2Image({elevation, rivers}, settings)
        );
        if (withReduceSize) {
            container.replaceWith(canvasReduceSize);
        } else {
            container.replaceWith(canvasOriginalSize);
        }
    }, [maps, settings]);

    return (
        <div ref={drawAt}/>
    )
})