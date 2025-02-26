import React, {useCallback} from "react";
import {CheckboxForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = CheckboxForm & {}

export const CheckboxInput = React.memo(({title, name}: Props) => {
    const settings = useSettings(state => state.settings)
    const setSettings = useSettings(state => state.setSettings)

    const onChange = useCallback((checked: boolean) => {
        setSettings({
            ...settings,
            [name]: checked,
        })
    }, [setSettings])

    return (
        <div className="flex flex:col">
            <div>
                {title}
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