import React, {useEffect, useState} from "react";
import {biomeNames} from "../Mapper.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";

import styles from "./index.module.css" with {type: "css"};

export const Tooltip = React.memo(() => {
    const maps = useMaps(useShallow(state => state.maps));
    const settings = useSettings(useShallow(state => state.settings));

    const [isCanvas, setIsCanvas] = useState(true);
    const [elevation, setElevation] = useState(0);
    const [noise, setNoise] = useState(0);
    const [crust, setCrust] = useState(0);
    const [tectonic, setTectonic] = useState(0);
    const [rivers, setRivers] = useState(0);
    const [wind, setWind] = useState(0);
    const [temperature, setTemperature] = useState(0);
    const [humidity, setHumidity] = useState(0);
    const [biome, setBiome] = useState("");

    useEffect(() => {
        if (maps === null) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!e.target) return;

            if (e.target instanceof HTMLCanvasElement) {
                setIsCanvas(true);
                let localX = (e.offsetX / e.target.width) * settings.width;
                let localY = (e.offsetY / e.target.height) * settings.height;
                let ind = Math.floor(localX) + Math.floor(localY) * settings.width;
                const {
                    elevation,
                    noise,
                    crust,
                    tectonic,
                    rivers,
                    wind,
                    temperature,
                    humidity,
                    biome
                } = maps;

                setElevation(elevation[ind]);
                setNoise(noise[ind]);
                setCrust(crust[ind]);
                setTectonic(tectonic[ind]);
                setRivers(rivers[ind]);
                setWind(wind[ind]);
                setTemperature(temperature[ind]);
                setHumidity(humidity[ind]);
                setBiome(biomeNames[biome[ind]].toUpperCase());
            } else {
                setIsCanvas(false);
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        // Clean up the event listener on component unmount to prevent memory leaks
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [maps, settings]);

    return (
        <div className={styles.Tooltip + (isCanvas ? " block " : " hidden ")}>
            <div>Elevation</div>
            <div>{elevation}</div>
            <div>Noise</div>
            <div>{noise}</div>
            <div>Crust</div>
            <div>{crust}</div>
            <div>Tectonic</div>
            <div>{tectonic}</div>
            <div>Rivers</div>
            <div>{rivers}</div>
            <div>Wind</div>
            <div>{wind}</div>
            <div>Temperature</div>
            <div>{temperature}</div>
            <div>Humidity</div>
            <div>{humidity}</div>
            <div>Biome</div>
            <div>{biome}</div>
        </div>
    )
})