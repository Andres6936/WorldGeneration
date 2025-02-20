import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {elevation2Image} from "../UtilImage.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Elevation = React.memo(() => {
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

        showMap(
            settings,
            drawContainer,
            mapContainer,
            elevation,
            "elevation",
            elevation2Image({elevation, rivers}, settings)
            //(v,i) => v>0?[v * 400, 250 - v*150, (v - elevation[i-12*settings.width])*500, 255]:[0,0,100+v*200,255]
        );
    }, []);

    return (
        <div ref={drawAt}/>
    )
})