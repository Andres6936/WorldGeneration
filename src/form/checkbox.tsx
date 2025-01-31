import React from "react";
import {CheckboxForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = CheckboxForm & {}

export const CheckboxInput = React.memo(({name}: Props) => {
    const [settings, setSettings] = useSettings(state => [state.settings, state.setSettings])

    return (
        <div className="flex flex:row gap:1rem">
            <div>
                {name}
            </div>
            <input
                onChange={({target}) => setSettings({
                    ...settings,
                    [name]: target.checked,
                })}
                checked={settings[name] as boolean}
                className="checkbox"
                type="checkbox"
                id={name}
            />
        </div>
    )
})