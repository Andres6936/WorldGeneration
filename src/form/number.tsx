import React, {useCallback} from "react";
import {NumberForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";

type Props = NumberForm & {}

export const NumberInput = React.memo(({name}: Props) => {
    const [settings, setSettings] = useSettings(state => [state.settings, state.setSettings])

    const onChange = useCallback((valueAsNumber: number) => {
        setSettings({
            ...settings,
            [name]: valueAsNumber,
        })
    }, [])

    return (
        <div className="flex flex:row gap:1rem">
            <div>
                {name}
            </div>
            <input
                onChange={({target}) => onChange(target.valueAsNumber)}
                className="number"
                type="number"
                id={name}
                value={settings[name] as number}
            />
        </div>
    )
})