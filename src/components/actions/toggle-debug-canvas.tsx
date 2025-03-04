import {useSettings} from "../../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";
import styles from "../button/index.module.css";
import {Bug, BugOff} from "lucide-react";

export function ToggleDebugCanvas() {
    const showDebugCanvasMap = useSettings(useShallow(state => state.showDebugCanvasMap));
    const setShowDebugCanvasMap = useSettings(useShallow(state => state.setShowDebugCanvasMap));

    return (
        <button type="button" className={styles.Button} onClick={() => setShowDebugCanvasMap(!showDebugCanvasMap)}>
            {showDebugCanvasMap ? <Bug/> : <BugOff/>}
        </button>
    )
}