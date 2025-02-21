import styles from "./index.module.css" with {type: "css"};

import React, {useEffect, useState} from "react";
import {useSettings} from "../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";
import {Popover} from "@base-ui-components/react";
import {Content} from "./content.tsx";

export const Tooltip = React.memo(() => {
    const settings = useSettings(useShallow(state => state.settings));

    const [position, setPosition] = useState<{ x: number, y: number }>({x: 0, y: 0})
    const [showPopup, setShowPopup] = useState(false);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!e.target) return;
            if (e.target instanceof HTMLCanvasElement) {
                setShowPopup(true);
                setPosition({x: e.clientX, y: e.clientY});
                let localX = (e.offsetX / e.target.width) * settings.width;
                let localY = (e.offsetY / e.target.height) * settings.height;
                setIndex(Math.floor(localX) + Math.floor(localY) * settings.width);
            } else {
                setShowPopup(false);
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        // Clean up the event listener on component unmount to prevent memory leaks
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [settings]);

    return (
        <Popover.Root open={showPopup}>
            <Popover.Portal>
                <Popover.Trigger
                    render={(props) => (
                        <div {...props} className="abs" style={{top: position.y, left: position.x}}/>
                    )}
                />
                <Popover.Positioner sideOffset={8}>
                    <Popover.Popup className={styles.Popup}>
                        <Popover.Title className={styles.Title}>Details</Popover.Title>
                        <Content index={index}/>
                    </Popover.Popup>
                </Popover.Positioner>
            </Popover.Portal>
        </Popover.Root>
    )
})