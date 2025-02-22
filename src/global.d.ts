export interface Settings {
    mapMode: number,
    seed: number,
    width: number,
    height: number,
    scale: number,
    noiseFactor: number,
    crustFactor: number,
    tectonicFactor: number,
    noiseSmoothness: number,
    tectonicSmoothness: number,
    pangaea: number,
    seaRatio: number,
    flatness: number,
    randomiseHumidity: boolean,
    averageTemperature: number,
    erosion: number,
    riversShown: number,
    biomeScrambling: number,
    terrainTypeColoring: boolean,
    discreteHeights: number,
    hillRatio: number,
    mountainRatio: number,
    gameMapRivers: number,
    gameMapScale: number,
    generatePhoto: boolean,
    squareGrid: boolean,
}

declare module globalThis {
    let maps: any[];
    let miniMaps: any[];
    let tips: Record<string, any>;
    let settings: Settings;
}