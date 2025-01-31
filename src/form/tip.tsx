import React from "react";
import {TipForm} from "../Parameters.ts";
import {Settings} from "../global";

type Props = TipForm & {
    settings: Settings,
}

export const TipInput = React.memo(({name}: Props) => {
    return (
        <div className="tip">
            {name}
        </div>
    )
})