export const defaultSettings = {
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
};

export function saveSettings() {
    document.location.hash = Object.keys(globalThis.settings)
        .map((k) => `${k}=${globalThis.settings[k]}`)
        .join("&");

    localStorage.mapGenSettings = JSON.stringify(globalThis.settings);
}