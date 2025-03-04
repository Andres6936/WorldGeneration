import styles from './index.module.css' with {type: 'css'};
import buttonStyles from '../components/button/index.module.css' with {type: 'css'};

import React, {useCallback, useEffect} from "react";
import {Elevation} from "../maps/elevation.tsx";
import {Menu} from "@base-ui-components/react";
import {useSettings} from "../store/useSettings.ts";
import {Layer} from "../core/enums.ts";
import {Tectonics} from "../maps/tectonics.tsx";
import {Temperature} from "../maps/temperature.tsx";
import {Wind} from "../maps/wind.tsx";
import {Humidity} from "../maps/humidity.tsx";
import {Biome} from "../maps/biome.tsx";
import {Photo} from "../maps/photo.tsx";
import {Layers} from "lucide-react";
import {ArrowSvg} from "../components/icons/arrow-svg.tsx";
import {ToggleTooltip} from "../components/actions/toggle-tooltip.tsx";
import {Compare} from "../components/compare";
import {useShallow} from "zustand/react/shallow";
import {ToggleDebugCanvas} from "../components/actions/toggle-debug-canvas.tsx";

type OptionsDraw = {
    className?: string,
}

export const Draw = React.memo(() => {
    const settings = useSettings(state => state.settings);
    const currentLayer = useSettings(state => state.currentLayer)
    const setCurrentLayer = useSettings(state => state.setCurrentLayer);
    const showDebugCanvasMap = useSettings(useShallow(state => state.showDebugCanvasMap));

    useEffect(() => {
        // Avoid show the layer of photo when the user disable the generation of photo layer
        if (!settings.generatePhoto && currentLayer === Layer.Photo) {
            setCurrentLayer(Layer.Elevation);
        }
    }, [currentLayer, settings]);

    const drawCurrentLayer = useCallback((options?: OptionsDraw) => {
        switch (currentLayer) {
            case Layer.Elevation:
                return <Elevation className={options?.className}/>
            case Layer.Tectonics:
                return <Tectonics className={options?.className}/>
            case Layer.Temperature:
                return <Temperature className={options?.className}/>
            case Layer.Wind:
                return <Wind className={options?.className}/>
            case Layer.Humidity:
                return <Humidity className={options?.className}/>
            case Layer.Biome:
                return <Biome className={options?.className}/>
            case Layer.Photo:
                return <Photo className={options?.className}/>
        }
    }, [currentLayer])

    return (
        <div
            className="abs top:0 left:0 right:0 bottom:0 flex flex:1 flex:col justify-content:center align-items:center overflow:auto">
            <div
                className={`rel transform:preserve-3d ${showDebugCanvasMap ? 'transform:scale(0.75)|translateY(5%)|rotateX(30deg)|rotateZ(10deg) ' : ''}`}>
                {drawCurrentLayer({
                    className: showDebugCanvasMap ? 'outline:1px|solid|transparent outline:#e74c3c' : ''
                })}
                
                <Compare>
                    <Biome/>
                </Compare>
            </div>

            <div className="abs bottom:1rem right:1rem flex flex:col gap:0.5rem">
                <ToggleDebugCanvas/>
                <ToggleTooltip/>

                <Menu.Root>
                    <Menu.Trigger className={buttonStyles.Button}>
                        <Layers/>
                    </Menu.Trigger>
                    <Menu.Portal>
                        <Menu.Positioner className={styles.Positioner} sideOffset={8}>
                            <Menu.Popup className={styles.Popup}>
                                <Menu.Arrow className={styles.Arrow}>
                                    <ArrowSvg/>
                                </Menu.Arrow>

                                <Menu.Item
                                    className={styles.Item}
                                    onClick={() => setCurrentLayer(Layer.Elevation)}>
                                    Elevation
                                </Menu.Item>
                                <Menu.Item
                                    className={styles.Item}
                                    onClick={() => setCurrentLayer(Layer.Tectonics)}>
                                    Tectonics
                                </Menu.Item>
                                <Menu.Item
                                    className={styles.Item}
                                    onClick={() => setCurrentLayer(Layer.Temperature)}>
                                    Temperature
                                </Menu.Item>
                                <Menu.Item
                                    className={styles.Item}
                                    onClick={() => setCurrentLayer(Layer.Wind)}>
                                    Wind
                                </Menu.Item>
                                <Menu.Item
                                    className={styles.Item}
                                    onClick={() => setCurrentLayer(Layer.Humidity)}>
                                    Humidity
                                </Menu.Item>
                                <Menu.Item
                                    className={styles.Item}
                                    onClick={() => setCurrentLayer(Layer.Biome)}>
                                    Biome
                                </Menu.Item>

                                {settings.generatePhoto && (
                                    <Menu.Item
                                        className={styles.Item}
                                        onClick={() => setCurrentLayer(Layer.Photo)}>
                                        Photo
                                    </Menu.Item>
                                )}
                            </Menu.Popup>
                        </Menu.Positioner>
                    </Menu.Portal>
                </Menu.Root>
            </div>
        </div>

    )
})

