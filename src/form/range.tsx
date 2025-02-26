import React from "react";
import {RangeForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";
import styles from "../components/field/index.module.css";
import {Field} from "@base-ui-components/react";

type Props = RangeForm & {}

export const RangeInput = React.memo(({element, title, name}: Props) => {
    const settings = useSettings(state => state.settings)

    const min = element.min || 0;
    const max = element.max || 1;
    const step = element.step || (max - min) / 100;

    return (
        <Field.Root className={styles.Field}>
            <Field.Label className={styles.Label}>
                {title}
            </Field.Label>
            <Field.Control
                type="range"
                id={name}
                min={min}
                max={max}
                step={step}
                value={settings[name] as number}
            />
            <div className="w:4rem">
                {settings[name]}
            </div>
        </Field.Root>
    )
})