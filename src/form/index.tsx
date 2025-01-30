import {parameters} from "../Parameters.ts";
import {useEffect, useState} from "react";
import {generate} from "../Generate.ts";
import {defaultSettings} from "../settings.ts";

export function Form() {
    const [settings, setSettings] = useState<Record<string, string | number | boolean>>({})

    useEffect(() => {
        if (document.location.hash) {
            let records = document.location.hash
                .substr(1)
                .split("&")
                .map((s) => s.split("="));

            const localSettings: Record<string, string | number | boolean> = {}
            for (let ss of records) {
                localSettings[ss[0]] =
                    ss[1] == "false" ? false : ss[1] == "true" ? true : Number(ss[1]);
            }
            globalThis.settings = localSettings;
            setSettings(localSettings);
            generate(localSettings);
        } else {
            globalThis.settings = defaultSettings;
            setSettings(defaultSettings);
            generate(defaultSettings);
        }
    }, [setSettings]);

    return (
        <form>
            {parameters.map(({name, type, element}) => {
                switch (type) {
                    case "tip":
                        return (
                            <div className="tip">
                                {name}
                            </div>
                        )
                    case "checkbox":
                        return (
                            <>
                                <div>
                                    {name}
                                </div>
                                <input
                                    onChange={({target}) => globalThis.settings[name] = target.checked}
                                    checked={settings[name]}
                                    className="checkbox"
                                    type="checkbox"
                                    id={name}
                                />
                            </>
                        )
                    case "number":
                        return (
                            <>
                                <div>
                                    {name}
                                </div>
                                <input
                                    onChange={({target}) => globalThis.settings[name] = target.valueAsNumber}
                                    className="number"
                                    type="number"
                                    id={name}
                                    value={settings[name]}
                                />
                            </>
                        )
                    case "range": {
                        const min = element.min || 0;
                        const max = element.max || 1;
                        const step = element.step || (max - min) / 100;
                        return (
                            <>
                                <div>
                                    {name}
                                </div>
                                <input
                                    className="range"
                                    type="range"
                                    id={name}
                                    min={min}
                                    max={max}
                                    step={step}
                                    value={settings[name]}
                                />
                                <div id={name + '_value'}>
                                    {settings[name]}
                                </div>
                            </>
                        )
                    }
                }
            })}
        </form>
    )
}