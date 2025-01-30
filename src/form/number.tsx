import React from "react";
import {NumberForm} from "../Parameters.ts";

type Props = NumberForm & {
    settings: Record<string, string | number | boolean>,
}

export const NumberInput = React.memo(({name, settings}: Props) => {
    return (
        <div className="flex flex:row gap:1rem">
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
        </div>
    )
})