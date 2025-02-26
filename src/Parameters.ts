import {Settings} from "./global";

export type CheckboxForm = {
    title: string,
    name: keyof Settings,
    type: "checkbox",
    element?: undefined,
}

export type RangeForm = {
    title: string,
    name: keyof Settings,
    type: "range",
    element: {
        max?: number,
        step?: number,
        tip?: string,
        min?: number,
    }
}

export type NumberForm = {
    title: string,
    name: keyof Settings,
    type: "number",
    element: { tip: string }
}

export type TipForm = {
    name: string,
    type: "tip",
    element?: undefined,
}


export type FormParameters = CheckboxForm | NumberForm | RangeForm | TipForm


export const parameters: FormParameters[] = [
    {title: "Seed", name: "seed", type: "number", element: {tip: "Seed for the random number generator."}},
    {title: "Width", name: "width", type: "number", element: {tip: "Map width in pixels"}},
    {title: "Height", name: "height", type: "number", element: {tip: "Map height in pixels"}},
    {
        title: "Noise Smoothness",
        name: "noiseSmoothness",
        type: "range",
        element: {max: 10, step: 0.5, tip: "Smootheness of the elevation noise"},
    },
    {
        title: "Tectonic Smoothness",
        name: "tectonicSmoothness",
        type: "range",
        element: {
            max: 10,
            step: 0.5,
            tip:
                "Smootheness of the noise that is used for tectonic plates simulation",
        },
    },
    {
        title: "Noise Factor",
        name: "noiseFactor",
        type: "range",
        element: {
            min: -5,
            max: 20,
            step: 0.5,
            tip: "Weight of the 'general purpose' elevation noise",
        },
    },
    {
        title: "Crust Factor",
        name: "crustFactor",
        type: "range",
        element: {
            min: -5,
            max: 20,
            step: 0.5,
            tip:
                "Weight of the 'tectonic plates' noise. Increase to have more mountains on the edge on continents, reduce to have them inside.",
        },
    },
    {
        title: "Tectonic Factor",
        name: "tectonicFactor",
        type: "range",
        element: {
            min: -1,
            max: 3,
            step: 0.1,
            tip: "Amount of mountains and island chains and such",
        },
    },
    {
        title: "Pangea",
        name: "pangaea",
        type: "range",
        element: {
            min: -5,
            max: 5,
            tip:
                "Increasing this will make land gravitate the centre of the map, and vice versa",
        },
    },
    {title: "Sea Ratio", name: "seaRatio", type: "range", element: {tip: "Sea percentage"}},
    {
        title: "Flatness",
        name: "flatness",
        type: "range",
        element: {tip: "Initial flatness of the non-mountain areas"},
    },
    {title: "Randomise Humidity", name: "randomiseHumidity", type: "checkbox"},
    {title: "Average Temperature", name: "averageTemperature", type: "range", element: {min: -30, max: 50, step: 1}},
    {
        title: "Erosion",
        name: "erosion",
        type: "range",
        element: {max: 100000, tip: "How long water-caused erosion will be simulated"},
    },
    {
        title: "River Shown",
        name: "riversShown",
        type: "range",
        element: {
            max: 1000,
            tip:
                "Amount of rivers and lakes shown on elevation, humidity and biome maps",
        },
    },
    {title: "Biome Scrambling", name: "biomeScrambling", type: "range", element: {tip: "Adds randomness to biomes"}},
    {name: "SET gameMapScale TO NOT 0 IF YOU WANT A GAME MAP", type: "tip"},
    {title: "Square Grid", name: "squareGrid", type: "checkbox"},
    {title: "Game Map Scale", name: "gameMapScale", type: "range", element: {min: 0, max: 4, step: 1}},
    {
        title: "Game Map Rivers",
        name: "gameMapRivers",
        type: "range",
        element: {
            max: 50000,
            step: 1000,
            tip: "How many rivers will there be on the low-res (hex) map",
        },
    },
    {name: "Graphical repesenation settings", type: "tip"},
    {title: "Generate Photo", name: "generatePhoto", type: "checkbox"},
    {title: "Discrete Heights", name: "discreteHeights", type: "range", element: {max: 40, step: 1}},
    {title: "Terrain Type Coloring", name: "terrainTypeColoring", type: "checkbox"},
];