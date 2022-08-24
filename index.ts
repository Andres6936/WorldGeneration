// @ts-nocheck

const parameters = [
    ["seed", "number", {tip: "Seed for the random number generator."}],
    ["width", "number", {tip: "Map width in pixels"}],
    ["height", "number", {tip: "Map height in pixels"}],
    [
        "noiseSmoothness",
        "range",
        {max: 10, step: 0.5, tip: "Smootheness of the elevation noise"},
    ],
    [
        "tectonicSmoothness",
        "range",
        {
            max: 10,
            step: 0.5,
            tip:
                "Smootheness of the noise that is used for tectonic plates simulation",
        },
    ],
    [
        "noiseFactor",
        "range",
        {
            min: -5,
            max: 20,
            step: 0.5,
            tip: "Weight of the 'general purpose' elevation noise",
        },
    ],
    [
        "crustFactor",
        "range",
        {
            min: -5,
            max: 20,
            step: 0.5,
            tip:
                "Weight of the 'tectonic plates' noise. Increase to have more mountains on the edge on continents, reduce to have them inside.",
        },
    ],
    [
        "tectonicFactor",
        "range",
        {
            min: -1,
            max: 3,
            step: 0.1,
            tip: "Amount of mountains and island chains and such",
        },
    ],
    [
        "pangaea",
        "range",
        {
            min: -5,
            max: 5,
            tip:
                "Increasing this will make land gravitate the centre of the map, and vice versa",
        },
    ],
    ["seaRatio", "range", {tip: "Sea percentage"}],
    [
        "flatness",
        "range",
        {tip: "Initial flatness of the non-mountain areas"},
    ],
    ["randomiseHumidity", "checkbox"],
    ["averageTemperature", "range", {min: -30, max: 50, step: 1}],
    [
        "erosion",
        "range",
        {max: 100000, tip: "How long water-caused erosion will be simulated"},
    ],
    [
        "riversShown",
        "range",
        {
            max: 1000,
            tip:
                "Amount of rivers and lakes shown on elevation, humidity and biome maps",
        },
    ],
    ["biomeScrambling", "range", {tip: "Adds randomness to biomes"}],
    ["SET gameMapScale TO NOT 0 IF YOU WANT A GAME MAP", "tip"],
    ["squareGrid", "checkbox"],
    ["gameMapScale", "range", {min: 0, max: 4, step: 1}],
    [
        "gameMapRivers",
        "range",
        {
            max: 50000,
            step: 1000,
            tip: "How many rivers will there be on the low-res (hex) map",
        },
    ],
    ["Graphical repesenation settings", "tip"],
    ["generatePhoto", "checkbox"],
    ["discreteHeights", "range", {max: 40, step: 1}],
    ["terrainTypeColoring", "checkbox"],
];

let miniMapSize = 200;

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

    for (let param of parameters) {
        let [id, type, also] = param;
        also = also || {};
        tips[id] = also.tip;
        switch (type) {
            case "tip":
                form.innerHTML += `<div class="tip">${id}</div>`;
                break;
            case "checkbox":
                form.innerHTML += `<div>${id}</div><input class="checkbox" type="checkbox" id="${id}" ${
                    settings[id] ? "checked" : ""
                } />`;
                break;
            case "number":
                form.innerHTML += `<div>${id}</div><input class="number" type="number" id="${id}" value="${settings[id]}" />`;
                break;
            case "range":
                let min = also.min || 0;
                let max = also.max || 1;
                let step = also.step || (max - min) / 100;
                form.innerHTML += `<div>${id}</div><input class="range" type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${settings[id]}"/>
        <div id="${id}_value"></div>
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
    for (let [id, type] of parameters) {
        if (type == "tip") continue;
        let element = document.getElementById(id);
        settings[id] =
            element.type == "checkbox" ? element.checked : Number(element.value);
        let id_value = document.getElementById(id + "_value");
        if (id_value) id_value.innerText = String(settings[id]).substr(0, 8);
    }

    saveSettings();

    generate(settings);
}

let maps = [],
    miniMaps = [];

function showMap(data, title, fun, scale = 1 / 4) {
    let image = data2image(data, settings.width, fun);
    let mini = rescaleImage(image, image.width * scale, image.height * scale);
    let ctx = context2d(mini);
    ctx.font = "14px Verdana";
    ctx.fillStyle = "white";
    ctx.strokeText(title, 5, 15);
    ctx.fillText(title, 4, 14);
    document.getElementById("minimaps").appendChild(mini);
    let id = maps.length;

    if (id == settings.mapMode)
        document.getElementById("map").appendChild(image);

    mini.id = "mini_" + id;
    maps.push(image);
    miniMaps.push(mini);
    mini.onclick = () => {
        settings.mapMode = id;
        saveSettings();
        document.getElementById("map").innerHTML = "";
        document.getElementById("map").appendChild(image);
    };
}
