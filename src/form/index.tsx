import {parameters} from "../Parameters.ts";
import {RangeInput} from "./range.tsx";
import {NumberInput} from "./number.tsx";
import {CheckboxInput} from "./checkbox.tsx";
import {TipInput} from "./tip.tsx";
import {ButtonCanvasToggle} from "./components/button-canvas-toggle.tsx";
import {ButtonReset} from "./components/button-reset.tsx";

export function Form() {
    return (
        <form className="p:1rem" onSubmit={e => e.preventDefault()}>
            {parameters.map(({name, type, element}) => {
                if (type === "tip") {
                    return (
                        <TipInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                        />
                    )
                } else if (type === "checkbox") {
                    return (
                        <CheckboxInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                        />
                    )
                } else if (type === "number") {
                    return (
                        <NumberInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                        />
                    )
                } else if (type === "range") {
                    return (
                        <RangeInput
                            key={name}
                            name={name}
                            type={type}
                            element={element}
                        />
                    )
                }
            })}

            <ButtonReset/>
            <ButtonCanvasToggle/>
        </form>
    )
}