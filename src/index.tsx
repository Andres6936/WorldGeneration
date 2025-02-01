import './index.css'

import React, {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";
import {Draw} from "./draw";

window.tips = {};
window.maps = [];
window.miniMaps = [];

const App = React.memo(() => {
    return (
        <>
            <img className="hidden" id="hexSheet" src="/tilesets/hexSheet.png"/>
            <img className="hidden" id="squareSheet" src="/tilesets/squareSheet.png"/>
            <div id="tooltip">tooltip</div>
            <div className="flex flex:row gap:1rem">
                <Form/>
                <Draw/>
            </div>
            <canvas id="gameMap"/>
        </>
    )
})

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)