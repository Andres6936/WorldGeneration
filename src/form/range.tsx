import React from "react";
import {RangeForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = RangeForm & {}

export const RangeInput = React.memo(({element, title, name}: Props) => {
    const settings = useSettings(state => state.settings)

    const min = element.min || 0;
    const max = element.max || 1;
    const step = element.step || (max - min) / 100;

    return (
        <div className="flex flex:col">
            <div className="w:8rem">
                {title}
            </div>
            <input
                className="w:8rem"
                type="range"
                id={name}
                min={min}
                max={max}
                step={step}
                value={settings[name] as number}
            />
            <div className="w:4rem">
                {settings[name]}
            </div>
        </div>
    )
})