import React from "react";
import {TipForm} from "../Parameters.ts";

type Props = TipForm & {}

export const TipInput = React.memo(({name}: Props) => {
    return (
        <div className="tip">
            {name}
        </div>
    )
})