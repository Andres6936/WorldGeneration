import styles from "../button/index.module.css" with {type: "css"};
import buttonStyles from "../button/index.module.css" with {type: "css"};

import {useSettings} from "../../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";
import {AlignHorizontalJustifyCenter} from "lucide-react";
import {Menu} from "@base-ui-components/react";
import {ArrowSvg} from "../icons/arrow-svg.tsx";
import {Layer} from "../../core/enums.ts";

export function ToggleCompareLayer() {
    const settings = useSettings(useShallow(state => state.settings));
    const setCompareLayer = useSettings(useShallow(state => state.setCompareLayer));

    return (
        <Menu.Root>
            <Menu.Trigger className={buttonStyles.Button}>
                <AlignHorizontalJustifyCenter/>
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner className={styles.Positioner} sideOffset={8}>
                    <Menu.Popup className={styles.Popup}>
                        <Menu.Arrow className={styles.Arrow}>
                            <ArrowSvg/>
                        </Menu.Arrow>

                        <Menu.Item
                            className={styles.Item}
                            onClick={() => setCompareLayer(Layer.Elevation)}>
                            Elevation
                        </Menu.Item>
                        <Menu.Item
                            className={styles.Item}
                            onClick={() => setCompareLayer(Layer.Tectonics)}>
                            Tectonics
                        </Menu.Item>
                        <Menu.Item
                            className={styles.Item}
                            onClick={() => setCompareLayer(Layer.Temperature)}>
                            Temperature
                        </Menu.Item>
                        <Menu.Item
                            className={styles.Item}
                            onClick={() => setCompareLayer(Layer.Wind)}>
                            Wind
                        </Menu.Item>
                        <Menu.Item
                            className={styles.Item}
                            onClick={() => setCompareLayer(Layer.Humidity)}>
                            Humidity
                        </Menu.Item>
                        <Menu.Item
                            className={styles.Item}
                            onClick={() => setCompareLayer(Layer.Biome)}>
                            Biome
                        </Menu.Item>

                        {settings.generatePhoto && (
                            <Menu.Item
                                className={styles.Item}
                                onClick={() => setCompareLayer(Layer.Photo)}>
                                Photo
                            </Menu.Item>
                        )}
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    )
}