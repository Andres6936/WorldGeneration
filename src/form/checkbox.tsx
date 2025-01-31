import React from "react";
import {CheckboxForm} from "../Parameters.ts";
import {Settings} from "../global";

type Props = CheckboxForm & {
    settings: Settings,
}

export const CheckboxInput = React.memo(({name, settings}: Props) => {
    return (
        <div className="flex flex:row gap:1rem">
            <div>
                {name}
            </div>
            <input
                onChange={({target}) => settings[name] = target.checked}
                checked={settings[name] as boolean}
                className="checkbox"
                type="checkbox"
                id={name}
            />
        </div>
    )
})