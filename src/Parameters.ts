export type CheckboxForm = {
    name: string,
    type: "checkbox",
    element?: undefined,
}

export type RangeForm = {
    name: string,
    type: "range",
    element: {
        max?: number,
        step?: number,
        tip?: string,
        min?: number,
    }
}

export type NumberForm = {
    name: string,
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
    {name: "seed", type: "number", element: {tip: "Seed for the random number generator."}},
    {name: "width", type: "number", element: {tip: "Map width in pixels"}},
    {name: "height", type: "number", element: {tip: "Map height in pixels"}},
    {
        name: "noiseSmoothness",
        type: "range",
        element: {max: 10, step: 0.5, tip: "Smootheness of the elevation noise"},
    },
    {
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
        name: "pangaea",
        type: "range",
        element: {
            min: -5,
            max: 5,
            tip:
                "Increasing this will make land gravitate the centre of the map, and vice versa",
        },
    },
    {name: "seaRatio", type: "range", element: {tip: "Sea percentage"}},
    {
        name: "flatness",
        type: "range",
        element: {tip: "Initial flatness of the non-mountain areas"},
    },
    {name: "randomiseHumidity", type: "checkbox"},
    {name: "averageTemperature", type: "range", element: {min: -30, max: 50, step: 1}},
    {
        name: "erosion",
        type: "range",
        element: {max: 100000, tip: "How long water-caused erosion will be simulated"},
    },
    {
        name: "riversShown",
        type: "range",
        element: {
            max: 1000,
            tip:
                "Amount of rivers and lakes shown on elevation, humidity and biome maps",
        },
    },
    {name: "biomeScrambling", type: "range", element: {tip: "Adds randomness to biomes"}},
    {name: "SET gameMapScale TO NOT 0 IF YOU WANT A GAME MAP", type: "tip"},
    {name: "squareGrid", type: "checkbox"},
    {name: "gameMapScale", type: "range", element: {min: 0, max: 4, step: 1}},
    {
        name: "gameMapRivers",
        type: "range",
        element: {
            max: 50000,
            step: 1000,
            tip: "How many rivers will there be on the low-res (hex) map",
        },
    },
    {name: "Graphical repesenation settings", type: "tip"},
    {name: "generatePhoto", type: "checkbox"},
    {name: "discreteHeights", type: "range", element: {max: 40, step: 1}},
    {name: "terrainTypeColoring", type: "checkbox"},
];