interface Settings {
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

let maps = [];
let miniMaps = [];
let settings: Partial<Settings> = {};

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
    if (form === null) {
        throw new Error("Cannot found the Form in the DOM.")
    }
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
    for (const {name, type} of parameters) {
        if (type == "tip") continue;
        const element = document.getElementById(name) as HTMLInputElement;
        if (element.type == "checkbox") {
            settings[name] = element.checked;
        } else {
            settings[name] = Number(element.value);
        }

        let id_value = document.getElementById(name + "_value");
        if (id_value) id_value.innerText = String(settings[name]).substr(0, 8);
    }

    saveSettings();
    generate(settings);
}