export function saveSettings() {
    document.location.hash = Object.keys(window.settings)
        .map((k) => `${k}=${window.settings[k]}`)
        .join("&");

    localStorage.mapGenSettings = JSON.stringify(window.settings);
}