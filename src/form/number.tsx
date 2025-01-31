import React from "react";
import {NumberForm} from "../Parameters.ts";
import {Settings} from "../global";

type Props = NumberForm & {
    settings: Settings,
}

export const NumberInput = React.memo(({name, settings}: Props) => {
    return (
        <div className="flex flex:row gap:1rem">
            <div>
                {name}
            </div>
            <input
                onChange={({target}) => settings[name] = target.valueAsNumber}
                className="number"
                type="number"
                id={name}
                value={settings[name] as number}
            />
        </div>
    )
})