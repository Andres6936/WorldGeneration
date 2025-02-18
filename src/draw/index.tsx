import React, {useEffect, useRef} from "react";
import {useSettings} from "../store/useSettings.ts";
import {elevation2Image, rescaleImage} from "../UtilImage.ts";
import {contrastColors} from "../Mapper.ts";
import {Settings} from "../global";
import {context2d, data2image} from "../CanvasContext.ts";
import {useMaps} from "../store/useMaps.ts";

function showMap(
    settings: Settings,
    drawAt: HTMLDivElement,
    mapAt: HTMLDivElement,
    data: Float32Array,
    title: string,
    fun: (v: number, i: number) => [number, number, number, number],
    scale = 1 / 4,
) {

    let image = data2image(data, settings.width, fun);
    let mini = rescaleImage(image, image.width * scale, image.height * scale);
    let ctx = context2d(mini);
    ctx.font = "14px Verdana";
    ctx.fillStyle = "white";
    ctx.strokeText(title, 5, 15);
    ctx.fillText(title, 4, 14);
    mapAt.appendChild(mini);
    let id = window.maps.length;

    if (id == settings.mapMode)
        drawAt.appendChild(image);

    mini.id = "mini_" + id;
    window.maps.push(image);
    window.miniMaps.push(mini);
    mini.onclick = () => {
        settings.mapMode = id;
        drawAt.innerHTML = "";
        drawAt.appendChild(image);
    };
}


export const Draw = React.memo(() => {
    const maps = useMaps(state => state.maps);
    const settings = useSettings(state => state.settings);

    const drawAt = useRef<HTMLDivElement | null>(null);
    const mapAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (drawAt.current === null || mapAt.current === null || maps === null) return;

        const mapContainer = mapAt.current;
        const drawContainer = drawAt.current;
        const {
            elevation,
            tectonic,
            rivers,
            wind,
            temperature,
            humidity,
            biome,
            photo
        } = maps;

        console.time("Drawing & Show Map")

        drawContainer.innerHTML = "";
        mapContainer.innerHTML = "";

        window.maps = [];
        window.miniMaps = [];

        showMap(
            settings,
            drawContainer,
            mapContainer,
            elevation,
            "elevation",
            elevation2Image({elevation, rivers}, settings)
            //(v,i) => v>0?[v * 400, 250 - v*150, (v - elevation[i-12*settings.width])*500, 255]:[0,0,100+v*200,255]
        );

        showMap(
            settings,
            drawContainer,
            mapContainer,
            tectonic,
            "tectonics",
            (v) => [0, 0, 0, v * 255]
        );

        showMap(
            settings,
            drawContainer,
            mapContainer,
            temperature,
            "temperature",
            (v) => [
                v * 5 + 100,
                255 - Math.abs(v - 5) * 10,
                155 - v * 5,
                255,
            ]
        );

        showMap(
            settings,
            drawContainer,
            mapContainer,
            wind,
            "wind",
            (v) => [v * 100, 0, -v * 100, 255]
        );

        showMap(
            settings,
            drawContainer,
            mapContainer,
            humidity,
            "humidity",
            (v, i) =>
                rivers[i] && elevation[i] > 0
                    ? [0, 0, 0, 255]
                    : i % settings.width < 20
                        ? [wind[i] * 100, 0, -wind[i] * 100, 255]
                        : elevation[i] < 0
                            ? [0, 0, 0, 255]
                            : [300 - v * 1000, elevation[i] * 200 + 50, v * 350 - 150, 255]
        );

        showMap(
            settings,
            drawContainer,
            mapContainer,
            biome,
            "biome",
            (v, i) => elevation[i] < 0 || rivers[i] ? [0, 40, 80, 255] : contrastColors[v]
        );

        if (settings.generatePhoto) {
            showMap(
                settings,
                drawContainer,
                mapContainer,
                photo,
                "photo",
                (v) => v
            );
        }

        console.timeEnd("Drawing & Show Map")

    }, [maps, settings]);

    return (
        <div>
            <div ref={drawAt} id="map"></div>
            <div ref={mapAt} id="minimaps"></div>
        </div>
    )
})