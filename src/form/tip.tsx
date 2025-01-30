import React from "react";
import {TipForm} from "../Parameters.ts";

type Props = TipForm & {
    settings: Record<string, string | number | boolean>,
}

export const TipInput = React.memo(({name, settings}: Props) => {
    return (
        <div className="tip">
            {name}
        </div>
    )
})