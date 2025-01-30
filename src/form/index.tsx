import {parameters} from "../Parameters.ts";
import {useEffect} from "react";
import {generate} from "../Generate.ts";
import {defaultSettings} from "../settings.ts";

export function Form() {
    useEffect(() => {
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

        document.location.hash = Object.keys(window.settings)
            .map((k) => `${k}=${window.settings[k]}`)
            .join("&");

        localStorage.mapGenSettings = JSON.stringify(window.settings);

        generate(window.settings)
    }, [window.settings]);

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
                                    onChange={({target}) => window.settings[name] = target.checked}
                                    checked={window.settings[name]}
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
                                    onChange={({target}) => window.settings[name] = target.valueAsNumber}
                                    className="number"
                                    type="number"
                                    id={name}
                                    value={window.settings[name]}
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
                                    value={window.settings[name]}
                                />
                                <div id={name + '_value'}>
                                    {window.settings[name]}
                                </div>
                            </>
                        )
                    }
                }
            })}
        </form>
    )
}