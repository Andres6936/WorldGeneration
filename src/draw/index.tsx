import React, {useEffect, useRef} from "react";
import {generate} from "../Generate.ts";
import {useSettings} from "../store/useSettings.ts";

export const Draw = React.memo(() => {
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);
    const mapAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || mapAt.current === null) return;
        // Draw the map
        generate(drawAt.current, mapAt.current, settings);
    }, []);

    return (
        <div>
            <div ref={drawAt} id="map"></div>
            <div ref={mapAt} id="minimaps"></div>
        </div>
    )
})