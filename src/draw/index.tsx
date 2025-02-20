import React, {useEffect, useRef} from "react";
import {useSettings} from "../store/useSettings.ts";
import {useMaps} from "../store/useMaps.ts";
import {Elevation} from "../maps/elevation.tsx";
import {Tectonics} from "../maps/tectonics.tsx";
import {Temperature} from "../maps/temperature.tsx";
import {Wind} from "../maps/wind.tsx";
import {Humidity} from "../maps/humidity.tsx";
import {Biome} from "../maps/biome.tsx";
import {Photo} from "../maps/photo.tsx";


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
                <Elevation withReduceSize={false}/>

                <div className="flex flex:row">
                    <Elevation withReduceSize/>
                    <Tectonics withReduceSize/>
                    <Temperature withReduceSize/>
                    <Wind withReduceSize/>
                    <Humidity withReduceSize/>
                    <Biome withReduceSize/>
                    <Photo withReduceSize/>
                </div>
            </div>
        </div>
    )
})