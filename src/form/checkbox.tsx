import React from "react";
import {CheckboxForm} from "../Parameters.ts";

type Props = CheckboxForm & {
    settings: Record<string, string | number | boolean>,
}

export const CheckboxInput = React.memo(({name, settings}: Props) => {
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
})