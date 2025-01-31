import React, {useCallback} from "react";
import {CheckboxForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = CheckboxForm & {}

export const CheckboxInput = React.memo(({name}: Props) => {
    const [settings, setSettings] = useSettings(state => [state.settings, state.setSettings])

    const onChange = useCallback((checked: boolean) => {
        setSettings({
            ...settings,
            [name]: checked,
        })
    }, [])

    return (
        <div className="flex flex:row gap:1rem">
            <div>
                {name}
            </div>
            <input
                onChange={({target}) => onChange(target.checked)}
                checked={settings[name] as boolean}
                className="checkbox"
                type="checkbox"
                id={name}
            />
        </div>
    )
})