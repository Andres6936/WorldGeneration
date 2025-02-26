import styles from '../components/field/index.module.css' with {type: 'css'}

import React, {useCallback, useMemo} from "react";
import {NumberForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";
import {Field} from "@base-ui-components/react";


type Props = NumberForm & {}

export const NumberInput = React.memo(({title, name}: Props) => {
    const settings = useSettings(state => state.settings)
    const setSettings = useSettings(state => state.setSettings)

    const value = useMemo(() => {
        return settings[name] as number
    }, [settings])

    const onChange = useCallback((valueAsNumber: number) => {
        setSettings({
            ...settings,
            [name]: valueAsNumber,
        })
    }, [])

    return (
        <Field.Root className={styles.Field}>
            <Field.Label className={styles.Label}>
                {title}
            </Field.Label>
            <Field.Control
                onChange={({target}) => onChange(target.valueAsNumber)}
                className={styles.Input}
                type="number"
                id={name}
                value={value}
            />
        </Field.Root>
    )
})