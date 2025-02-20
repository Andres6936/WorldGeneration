import './index.css'

import React, {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";
import {Draw} from "./draw";
import {Canvas} from "./canvas";
import {Tooltip} from "./tooltip";
import {useMaps} from "./store/useMaps.ts";
import {useSettings} from "./store/useSettings.ts";
import {generateMap} from "./Mapper.ts";

window.tips = {};
window.maps = [];
window.miniMaps = [];

const Meta = React.memo(() => {
    return (
        <>
            <img className="hidden" id="hexSheet" src="/tilesets/hexSheet.png" alt="Hidden Hex Sheet"/>
            <img className="hidden" id="squareSheet" src="/tilesets/squareSheet.png" alt="Hidden Square Sheet"/>
        </>
    )
})

const LayoutMain = React.memo(() => {
    return (
        <div className="flex flex:1 flex:row bg:red h:100vh w:100vw">
            <Form/>
            <Draw/>
        </div>
    )
})

const App = React.memo(() => {
    const settings = useSettings(state => state.settings);
    const setMaps = useMaps(state => state.setMaps)

    useEffect(() => {
        console.time("Generation Map")
        // Generate the map with the current settings
        setMaps(generateMap(settings))
        console.timeEnd("Generation Map")

    }, [settings, setMaps]);

    return (
        <>
            <Meta/>
            <Tooltip/>
            <LayoutMain/>
            <Canvas/>
        </>
    )
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)