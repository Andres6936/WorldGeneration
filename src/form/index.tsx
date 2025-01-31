import {parameters} from "../Parameters.ts";
import {useEffect} from "react";
import {generate} from "../Generate.ts";
import {defaultSettings} from "../settings.ts";
import {RangeInput} from "./range.tsx";
import {NumberInput} from "./number.tsx";
import {CheckboxInput} from "./checkbox.tsx";
import {TipInput} from "./tip.tsx";
import {useSettings} from "../store/useSettings.ts";

export function Form() {
    const [settings, setSettings] = useSettings(state => [state.settings, state.setSettings])

    useEffect(() => {
        globalThis.settings = defaultSettings;
        setSettings(defaultSettings);
        generate(defaultSettings);
    }, []);

    return (
        <form className="border:1px|solid|#CCC p:1rem r:0.5rem">
            {parameters.map(({name, type, element}) => {
                if (type === "tip") {
                    return (
                        <TipInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                        />
                    )
                } else if (type === "checkbox") {
                    return (
                        <CheckboxInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                            settings={settings}
                        />
                    )
                } else if (type === "number") {
                    return (
                        <NumberInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                            settings={settings}
                        />
                    )
                } else if (type === "range") {
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

            <button className="mt:1rem blue">
                Reset to default
            </button>
        </form>
    )
}