import React, {useState} from "react";
import {useSettings} from "../../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";

type Props = {
    children: React.ReactNode
}

export function Compare({children}: Props) {
    const [value, setValue] = useState(50);

    const showDebugCanvasMap = useSettings(useShallow(state => state.showDebugCanvasMap));

    return (
        <>
            <div
                className={`abs top:0 left:0 right:0 bottom:0 flex flex:1 flex:col overflow:hidden z:1 w:${value}% ${showDebugCanvasMap ? 'translateZ(calc(120px*2)) shadow:0|calc(120px*0.66)|5px|rgb(0|0|0/0.5) outline:2px|solid|transparent outline:#2ecc71 will-change:transform ~easing:ease-out transition:transform|1s,outline|1s,box-shadow|1s,opacity|1s ' : ''}`}>
                <div className={`overflow:hidden`}>
                    {children}
                </div>
            </div>

            <div
                className={`abs top:0 z:1 h:full w:2px ml:-1px bg:black left:${value}% ${showDebugCanvasMap ? 'translateZ(calc(120px*3)) will-change:transform ~easing:ease-out transition:transform|1s,outline|1s,box-shadow|1s,opacity|1s ' : ''} `}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                     className={`abs z:2 color:#333 w:32px h:32px top:50% left:${value}% translate(-50%,-50%) p:6px b:2px|solid|currentColor r:50% bg:rgba(255,255,255,1) max-w:fit`}
                     viewBox="0 0 16 16">
                    <path d="M 6 2 L 1 8 L 6 14 M 10 2 L 15 8 L 10 14" stroke="currentColor"
                          className="stroke:2px"></path>
                </svg>
            </div>

            <input
                className={`appearance:none abs top:0 left:calc(32px/-2) width:calc(100%+32px) h:full opacity:0 z:2 cursor:col-resize bg:transparent opacity:1 ${showDebugCanvasMap ? 'translateZ(calc(120px*2)) outline:2px|solid|transparent outline:#3498db will-change:transform ~easing:ease-out transition:transform|1s,outline|1s,box-shadow|1s,opacity|1s ' : ''}`}
                type="range" min="0" step="0.5" max="100" value={value}
                onChange={e => setValue(e.target.valueAsNumber)}/>
        </>
    )
}