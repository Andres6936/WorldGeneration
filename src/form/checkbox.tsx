import stylesCheckbox from "../components/checkbox/index.module.css" with {type: "css"};

import React, {useCallback} from "react";
import {CheckboxForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";
import {Checkbox} from "@base-ui-components/react";

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
        <label className={stylesCheckbox.Label}>
            <Checkbox.Root
                onCheckedChange={(checked) => onChange(checked)}
                checked={settings[name] as boolean}
                className={stylesCheckbox.Checkbox}
            >
                <Checkbox.Indicator className={stylesCheckbox.Indicator}>
                    <CheckIcon className={stylesCheckbox.Icon}/>
                </Checkbox.Indicator>
            </Checkbox.Root>
            {title}
        </label>
    )
})

function CheckIcon(props: React.ComponentProps<'svg'>) {
    return (
        <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
            <path
                d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z"/>
        </svg>
    );
}