import './index.css'
import stylesScrollArea from './components/scrollarea/index.module.css' with {type: 'css'};

import React, {StrictMode, useEffect} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";
import {Draw} from "./draw";
import {Canvas} from "./canvas";
import {Tooltip} from "./tooltip";
import {useMaps} from "./store/useMaps.ts";
import {useSettings} from "./store/useSettings.ts";
import {generateMap} from "./Mapper.ts";
import {useShallow} from "zustand/react/shallow";
import {ScrollArea} from "@base-ui-components/react";

const Meta = React.memo(() => {
    return (
        <>
            <img className="hidden" id="hexSheet" src="/tilesets/hexSheet.png" alt="Hidden Hex Sheet"/>
            <img className="hidden" id="squareSheet" src="/tilesets/squareSheet.png" alt="Hidden Square Sheet"/>
        </>
    )
})

const Main = React.memo(() => {
    const showCanvasMap = useSettings(useShallow(state => state.showCanvasMap));

    return (
        <div className="flex flex:1 flex:row h:100vh max-h:100vh w:100vw max-w:100vw">
            <ScrollArea.Root className={stylesScrollArea.ScrollArea}>
                <ScrollArea.Viewport className={stylesScrollArea.Viewport}>
                    <Form/>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className={stylesScrollArea.Scrollbar}>
                    <ScrollArea.Thumb className={stylesScrollArea.Thumb}/>
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>

            <div className="relative flex flex:col flex:1">
                {showCanvasMap ? <Canvas/> : <Draw/>}
            </div>
        </div>
    )
})

const App = React.memo(() => {
    const settings = useSettings(useShallow(state => state.settings));
    const setMaps = useMaps(useShallow(state => state.setMaps))

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
            <Main/>
        </>
    )
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)