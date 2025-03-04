import React from "react";

type Props = {
    children: React.ReactNode
}

export function Compare({children}: Props) {
    return (
        <div className="abs top:0 left:0 right:0 bottom:0 flex flex:1 flex:col overflow:hidden z:1">
            <div className="w:15rem overflow:hidden">
                {children}
            </div>
        </div>
    )
}