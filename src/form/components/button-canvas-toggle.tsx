import React from "react";
import {useSettings} from "../../store/useSettings.ts";

import styles from '../../components/button/index.module.css' with {type: 'css'};

export const ButtonCanvasToggle = React.memo(() => {
    const showCanvasMap = useSettings(state => state.showCanvasMap)
    const setShowCanvasMap = useSettings(state => state.setShowCanvasMap)

    if (showCanvasMap) {
        return (
            <button className={styles.Button} onClick={() => setShowCanvasMap(false)}>
                Show canvas map
            </button>
        )
    } else {
        return (
            <button className={styles.Button} onClick={() => setShowCanvasMap(true)}>
                Hidden canvas map
            </button>
        )
    }
})