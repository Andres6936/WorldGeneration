import React from "react";

type Props = {
    children: React.ReactNode
}

export function Compare({children}: Props) {
    return (
        <>
            <div className="abs top:0 left:0 right:0 bottom:0 flex flex:1 flex:col overflow:hidden z:1">
                <div className="w:15rem overflow:hidden">
                    {children}
                </div>
            </div>

            <div className="abs top:0 z:1 h:full w:2px ml:-1px bg:black left:15rem">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     className="abs z:2 color:#333 w:5px h:5px top:50% left:15rem translate(50%,50%) p:6px b:2px|solid|currentColor r:50% bg:rgba(255,255,255,1)"
                     viewBox="0 0 16 16">
                    <path d="M 6 2 L 1 8 L 6 14 M 10 2 L 15 8 L 10 14" stroke="currentColor"></path>
                </svg>
            </div>
        </>
    )
}