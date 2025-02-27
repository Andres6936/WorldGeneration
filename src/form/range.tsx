import stylesField from "../components/field/index.module.css" with {type: "css"};
import stylesSlider from "../components/slider/index.module.css" with {type: "css"};

import React from "react";
import {RangeForm} from "../Parameters.ts";
import {useSettings} from "../store/useSettings.ts";
import {Field, Slider} from "@base-ui-components/react";

type Props = RangeForm & {}

export const RangeInput = React.memo(({element, title, name}: Props) => {
    const settings = useSettings(state => state.settings)

    const min = element.min || 0;
    const max = element.max || 1;
    const step = element.step || (max - min) / 100;

    return (
        <Field.Root className={stylesField.Field}>
            <Field.Label className={stylesField.Label}>
                {title}: <span className="ml:1rem font:1rem">{settings[name]}</span>
            </Field.Label>

            <div className="flex flex:row gap:0.85rem align-items:center">
                <p>{min}</p>
                <Slider.Root
                    min={min}
                    max={max}
                    step={step}
                    value={settings[name] as number}
                >
                    <Slider.Control className={stylesSlider.Control}>
                        <Slider.Track className={stylesSlider.Track}>
                            <Slider.Indicator className={stylesSlider.Indicator}/>
                            <Slider.Thumb className={stylesSlider.Thumb}/>
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <p>{max}</p>
            </div>
        </Field.Root>
    )
})