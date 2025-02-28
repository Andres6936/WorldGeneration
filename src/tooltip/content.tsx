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
        if (!maps.isReady) return;

        const elevation = maps.withElevation();
        const noise = maps.withNoise();
        const crust = maps.withCrust();
        const tectonic = maps.withTectonic();
        const rivers = maps.withRivers();
        const wind = maps.withWind();
        const temperature = maps.withTemperature();
        const humidity = maps.withHumidity();
        const biome = maps.withBiome();

        setElevation(elevation[index]);
        setNoise(noise[index]);
        setCrust(crust[index]);
        setTectonic(tectonic[index]);
        setRivers(rivers[index]);
        setWind(wind[index]);
        setTemperature(temperature[index]);
        setHumidity(humidity[index]);
        setBiome(biomeNames[biome[index]]?.toUpperCase());
    }, [index, maps])

    return (
        <section className="bt:1px|solid|$(color-gray-500) pt:0.5rem mt:0.5rem">
            <Info title="Elevation" value={elevation}/>
            <Info title="Noise" value={noise}/>
            <Info title="Crust" value={crust}/>
            <Info title="Tectonic" value={tectonic}/>
            <Info title="Rivers" value={rivers}/>
            <Info title="Wind" value={wind}/>
            <Info title="Temperature" value={temperature}/>
            <Info title="Humidity" value={humidity}/>

            <div className="flex flex:col bt:1px|solid|$(color-gray-500) mt:0.5rem pt:0.5rem">
                <div className="opacity:0.6 text:center">Biome</div>
                <div>{biome}</div>
            </div>
        </section>
    )
})

type InfoProps = {
    title: string
    value: number
}

const Info = React.memo(({title, value}: InfoProps) => {
    return (
        <div className="flex flex:row justify-content:space-between gap:2rem">
            <div className="opacity:0.6">{title}</div>
            <div>{value?.toFixed(2)}</div>
        </div>
    )
})