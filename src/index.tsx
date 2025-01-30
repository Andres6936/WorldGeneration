import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {Form} from "./form";

let defaultSettings = JSON.stringify({
    mapMode: 0,
    seed: 1,
    width: 640,
    height: 640,
    scale: 1,
    noiseFactor: 10,
    crustFactor: 6,
    tectonicFactor: 3,
    noiseSmoothness: 2,
    tectonicSmoothness: 5,
    pangaea: 0,
    seaRatio: 0.55,
    flatness: 0.5,
    randomiseHumidity: false,
    averageTemperature: 15,
    erosion: 50000,
    riversShown: 400,
    biomeScrambling: 0,
    terrainTypeColoring: false,
    discreteHeights: 0,
    hillRatio: 0.12,
    mountainRatio: 0.04,
    gameMapRivers: 15000,
    gameMapScale: 2,
    generatePhoto: true,
    squareGrid: false,
});

window.tips = {};
window.maps = [];
window.miniMaps = [];
window.settings = {};
window.onload = init;

function init() {
    if (document.location.hash) {
        window.settings = {};
        let records = document.location.hash
            .substr(1)
            .split("&")
            .map((s) => s.split("="));
        console.log(records);
        for (let ss of records) {
            window.settings[ss[0]] =
                ss[1] == "false" ? false : ss[1] == "true" ? true : Number(ss[1]);
        }
        console.log(window.settings);
    }

    if (!window.settings || window.settings.width == 0)
        window.settings = JSON.parse(localStorage.mapGenSettings || defaultSettings);

}


createRoot(document.getElementById('root-form')!).render(
    <StrictMode>
        <Form/>
    </StrictMode>,
)