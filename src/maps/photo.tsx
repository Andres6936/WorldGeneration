import React, {useEffect, useRef} from "react";
import {showMap} from "../core/draw.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";

export const Photo = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || maps === null) return;
        const container = drawAt.current;
        const {
            photo
        } = maps;

        if (settings.generatePhoto) {
            const canvas = showMap(
                settings,
                photo,
                "photo",
                (v) => v
            );
            container.replaceWith(canvas);
        }
    }, [maps, settings]);

    return (
        <div ref={drawAt}/>
    )
})