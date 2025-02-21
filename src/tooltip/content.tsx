import React, {useEffect, useState} from "react";
import {useMaps} from "../store/useMaps.ts";
import {useShallow} from "zustand/react/shallow";
import {biomeNames} from "../Mapper.ts";

type Props = {
    index: number,
}

export const Content = React.memo(({index}: Props) => {
    const maps = useMaps(useShallow(state => state.maps));

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

        setElevation(elevation[index]);
        setNoise(noise[index]);
        setCrust(crust[index]);
        setTectonic(tectonic[index]);
        setRivers(rivers[index]);
        setWind(wind[index]);
        setTemperature(temperature[index]);
        setHumidity(humidity[index]);
        setBiome(biomeNames[biome[index]].toUpperCase());
    }, [index, maps])

    return (
        <section>
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
        </section>
    )
})