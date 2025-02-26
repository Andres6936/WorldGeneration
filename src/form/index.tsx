import {parameters} from "../Parameters.ts";
import {RangeInput} from "./range.tsx";
import {NumberInput} from "./number.tsx";
import {CheckboxInput} from "./checkbox.tsx";
import {TipInput} from "./tip.tsx";
import {ButtonCanvasToggle} from "./components/button-canvas-toggle.tsx";
import {ButtonReset} from "./components/button-reset.tsx";

export function Form() {
    return (
        <form className="p:1rem overflow-y:scroll" onSubmit={e => e.preventDefault()}>
            {parameters.map(param => {
                if (param.type === "tip") {
                    return (
                        <TipInput
                            key={param.name}
                            {...param}
                        />
                    )
                } else if (param.type === "checkbox") {
                    return (
                        <CheckboxInput
                            key={param.name}
                            {...param}
                        />
                    )
                } else if (param.type === "number") {
                    return (
                        <NumberInput
                            key={param.name}
                            {...param}
                        />
                    )
                } else if (param.type === "range") {
                    return (
                        <RangeInput
                            key={param.name}
                            {...param}
                        />
                    )
                }
            })}

            <ButtonReset/>
            <ButtonCanvasToggle/>
        </form>
    )
}