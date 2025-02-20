import React from "react";
import {Elevation} from "../maps/elevation.tsx";
import {Tectonics} from "../maps/tectonics.tsx";
import {Temperature} from "../maps/temperature.tsx";
import {Wind} from "../maps/wind.tsx";
import {Humidity} from "../maps/humidity.tsx";
import {Biome} from "../maps/biome.tsx";
import {Photo} from "../maps/photo.tsx";


export const Draw = React.memo(() => {
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