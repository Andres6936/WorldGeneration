import styles from '../button/index.module.css' with {type: 'css'};

import {MousePointer2, MousePointerBan} from "lucide-react";
import {useSettings} from "../../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";

export function ToggleTooltip() {
    const showTooltip = useSettings(useShallow(state => state.showTooltip));
    const setShowTooltip = useSettings(useShallow(state => state.setShowTooltip));

    return (
        <button type="button" className={styles.Button} onClick={() => setShowTooltip(!showTooltip)}>
            {showTooltip ? <MousePointer2/> : <MousePointerBan/>}
        </button>
    )
}