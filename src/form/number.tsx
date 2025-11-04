import styles from '../components/field/index.module.css' with { type: 'css' };

import { Field } from "@base-ui-components/react";
import { useDebounce } from '@uidotdev/usehooks';
import React, { useEffect, useState } from "react";
import { NumberForm } from "../Parameters.ts";
import { useSettings } from "../store/useSettings.ts";


type Props = NumberForm & {}

export const NumberInput = React.memo(({element, title, name}: Props) => {
    const settings = useSettings(state => state.settings)
    const setSettings = useSettings(state => state.setSettings)

    const [value, setValue] = useState(settings[name] as number)
    const debounceValue = useDebounce(value, 500)

    useEffect(() => {
        setSettings({ ...settings, [name]: debounceValue })
    }, [debounceValue])

    return (
        <Field.Root className={styles.Field + " bb:1px|solid|$(color-gray-200) pb:1rem"}>
            <Field.Label className={styles.Label}>
                {title}
            </Field.Label>
            <Field.Control
                onChange={({target}) => setValue(target.valueAsNumber)}
                className={styles.Input}
                type="number"
                id={name}
                value={value}
            />

            {element.tip && <p className="opacity:0.5 font-size:0.75rem lh:1">{element.tip}</p>}
        </Field.Root>
    )
})
