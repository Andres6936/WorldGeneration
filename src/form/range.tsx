import React from "react";
import {RangeForm} from "../Parameters.ts";

type Props = RangeForm & {
    settings: Record<string, string | number | boolean>,
}

export const RangeInput = React.memo(({element, name, settings}: Props) => {
    const min = element.min || 0;
    const max = element.max || 1;
    const step = element.step || (max - min) / 100;

    return (
        <div className="flex flex:row gap:1rem">
            <div className="w:8rem">
                {name}
            </div>
            <input
                className="w:8rem"
                type="range"
                id={name}
                min={min}
                max={max}
                step={step}
                value={settings[name]}
            />
            <div className="w:4rem">
                {settings[name]}
            </div>
        </div>
    )
})