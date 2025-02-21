import React, {useCallback} from "react";
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

import styles from './index.module.css' with {type: 'css'};
import buttonStyles from '../components/button/index.module.css' with {type: 'css'};

export const Draw = React.memo(() => {
    const currentLayer = useSettings(state => state.currentLayer)
    const setCurrentLayer = useSettings(state => state.setCurrentLayer);

    const drawCurrentLayer = useCallback(() => {
        switch (currentLayer) {
            case Layer.Elevation:
                return <Elevation/>
            case Layer.Tectonics:
                return <Tectonics/>
            case Layer.Temperature:
                return <Temperature/>
            case Layer.Wind:
                return <Wind/>
            case Layer.Humidity:
                return <Humidity/>
            case Layer.Biome:
                return <Biome/>
            case Layer.Photo:
                return <Photo/>
        }
    }, [currentLayer])

    return (
        <div className="relative flex flex:col flex:1 bl:2px|dotted|$(color-gray-900)">
            <div
                className="absolute top:0 left:0 right:0 bottom:0 flex flex:1 flex:col justify-content:center align-items:center overflow:auto">
                {drawCurrentLayer()}

                <div className="abs bottom:1rem right:1rem">
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
                                    <Menu.Item
                                        className={styles.Item}
                                        onClick={() => setCurrentLayer(Layer.Photo)}>
                                        Photo
                                    </Menu.Item>
                                </Menu.Popup>
                            </Menu.Positioner>
                        </Menu.Portal>
                    </Menu.Root>
                </div>
            </div>
        </div>
    )
})

