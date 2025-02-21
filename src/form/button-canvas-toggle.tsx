import React from "react";
import {useSettings} from "../store/useSettings.ts";

export const ButtonCanvasToggle = React.memo(() => {
    const showCanvasMap = useSettings(state => state.showCanvasMap)
    const setShowCanvasMap = useSettings(state => state.setShowCanvasMap)

    if (showCanvasMap) {
        return (
            <button className="mt:1rem blue" onClick={() => setShowCanvasMap(false)}>
                Show canvas map
            </button>
        )
    } else {
        return (
            <button className="mt:1rem blue" onClick={() => setShowCanvasMap(true)}>
                Hidden canvas map
            </button>
        )
    }
})