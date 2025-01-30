import {parameters} from "../Parameters.ts";
import {useEffect, useState} from "react";
import {generate} from "../Generate.ts";
import {defaultSettings} from "../settings.ts";
import {RangeInput} from "./range.tsx";
import {NumberInput} from "./number.tsx";
import {CheckboxInput} from "./checkbox.tsx";
import {TipInput} from "./tip.tsx";

export function Form() {
    const [settings, setSettings] = useState<Record<string, string | number | boolean>>({})

    useEffect(() => {
        if (document.location.hash) {
            let records = document.location.hash
                .substr(1)
                .split("&")
                .map((s) => s.split("="));

            const localSettings = Object.fromEntries(
                records.map(([key, value]) => [
                    key,
                    value === "false" ? false : value === "true" ? true : Number(value)
                ])
            );
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
                            <TipInput
                                key={name}
                                name={name}
                                type={type}
                                element={element}
                                settings={settings}
                            />
                        )
                    case "checkbox":
                        return (
                            <CheckboxInput
                                key={name}
                                name={name}
                                type={type}
                                element={element}
                                settings={settings}
                            />
                        )
                    case "number":
                        return (
                            <NumberInput
                                key={name}
                                name={name}
                                type={type}
                                element={element}
                                settings={settings}
                            />
                        )
                    case "range":
                        return (
                            <RangeInput
                                key={name}
                                name={name}
                                type={type}
                                element={element}
                                settings={settings}
                            />
                        )
                }
            })}
        </form>
    )
}