import {parameters} from "../Parameters.ts";

export function Form() {
    return (
        <form>
            {parameters.map(({name, type, element}) => {
                switch (type) {
                    case "tip":
                        return (
                            <div className="tip">
                                {name}
                            </div>
                        )
                    case "checkbox":
                        return (
                            <>
                                <div>
                                    {name}
                                </div>
                                <input
                                    checked={window.settings[name]}
                                    className="checkbox"
                                    type="checkbox"
                                    id={name}
                                />
                            </>
                        )
                    case "number":
                        return (
                            <>
                                <div>
                                    {name}
                                </div>
                                <input
                                    className="number"
                                    type="number"
                                    id={name}
                                    value={window.settings[name]}
                                />
                            </>
                        )
                    case "range": {
                        const min = element.min || 0;
                        const max = element.max || 1;
                        const step = element.step || (max - min) / 100;
                        return (
                            <>
                                <div>
                                    {name}
                                </div>
                                <input
                                    className="range"
                                    type="range"
                                    id={name}
                                    min={min}
                                    max={max}
                                    step={step}
                                    value={window.settings[name]}
                                />
                                <div id={name + '_value'}></div>
                            </>
                        )
                    }
                }
            })}
        </form>
    )
}