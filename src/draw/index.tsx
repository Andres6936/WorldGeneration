import React, {useEffect, useRef} from "react";
import {useSettings} from "../store/useSettings.ts";
import {useMaps} from "../store/useMaps.ts";


export const Draw = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);
    const mapAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || mapAt.current === null || maps === null) return;

        const mapContainer = mapAt.current;
        const drawContainer = drawAt.current;

        console.time("Drawing & Show Map")

        drawContainer.innerHTML = "";
        mapContainer.innerHTML = "";

        window.maps = [];
        window.miniMaps = [];

        console.timeEnd("Drawing & Show Map")

    }, [maps, settings]);

    return (
        <div className="relative flex flex:col flex:1 bl:2px|dotted|#0F0D0E">
            <div
                className="absolute top:0 left:0 right:0 bottom:0 flex flex:1 flex:col justify-content:center align-items:center overflow:scroll">
                <div ref={drawAt} id="map"></div>
                <div ref={mapAt} id="minimaps"></div>
            </div>
        </div>
    )
})