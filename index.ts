// @ts-nocheck

const parameters = [
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

let settings = null;

function init() {
    if (document.location.hash) {
        settings = {};
        let records = document.location.hash
            .substr(1)
            .split("&")
            .map((s) => s.split("="));
        console.log(records);
        for (let ss of records) {
            settings[ss[0]] =
                ss[1] == "false" ? false : ss[1] == "true" ? true : Number(ss[1]);
        }
        console.log(settings);
    }

    if (!settings || settings.width == 0)
        settings = JSON.parse(localStorage.mapGenSettings || defaultSettings);

    rebuildForm();
    applySettings();
}

window.onload = init;

function resetSettings() {
    settings = JSON.parse(defaultSettings);
    rebuildForm();
    applySettings();
}

let tips = {};

function rebuildForm() {
    let form = document.getElementById("form");
    form.innerHTML = "";

    for (let {name, type, element} of parameters) {
        element = element || {};
        tips[name] = element.tip;
        switch (type) {
            case "tip":
                form.innerHTML += `<div class="tip">${name}</div>`;
                break;
            case "checkbox":
                form.innerHTML += `<div>${name}</div><input class="checkbox" type="checkbox" id="${name}" ${
                    settings[name] ? "checked" : ""
                } />`;
                break;
            case "number":
                form.innerHTML += `<div>${name}</div><input class="number" type="number" id="${name}" value="${settings[name]}" />`;
                break;
            case "range":
                let min = element.min || 0;
                let max = element.max || 1;
                let step = element.step || (max - min) / 100;
                form.innerHTML += `<div>${name}</div><input class="range" type="range" id="${name}" min="${min}" max="${max}" step="${step}" value="${settings[name]}"/>
        <div id="${name}_value"></div>
        `;
                break;
        }
    }
}

function saveSettings() {
    document.location.hash = Object.keys(settings)
        .map((k) => `${k}=${settings[k]}`)
        .join("&");

    localStorage.mapGenSettings = JSON.stringify(settings);
}

function applySettings() {
    for (let {name, type} of parameters) {
        if (type == "tip") continue;
        let element = document.getElementById(name);
        settings[name] =
            element.type == "checkbox" ? element.checked : Number(element.value);
        let id_value = document.getElementById(name + "_value");
        if (id_value) id_value.innerText = String(settings[name]).substr(0, 8);
    }

    saveSettings();
    generate(settings);
}

let maps = [],
    miniMaps = [];

