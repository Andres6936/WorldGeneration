import './index.css'

import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";
import {Draw} from "./draw";
import {Canvas} from "./canvas";
import {Tooltip} from "./tooltip";

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

const App = React.memo(() => {
    return (
        <>
            <Meta/>
            <Tooltip/>
            <div className="flex flex:row gap:1rem">
                <Form/>
                <Draw/>
            </div>
            <Canvas/>
        </>
    )
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)