import React, {useCallback} from "react";
import {CheckboxForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";
import styles from "../components/field/index.module.css";
import {Field} from "@base-ui-components/react";

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
        <Field.Root className={styles.Field}>
            <Field.Label className={styles.Label}>
                {title}
            </Field.Label>
            <Field.Control
                onChange={({target}) => onChange(target.checked)}
                checked={settings[name] as boolean}
                className="checkbox"
                type="checkbox"
                id={name}
            />
        </Field.Root>
    )
})