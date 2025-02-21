import React, {useEffect, useRef} from "react";
import {biomeNames} from "../Mapper.ts";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";
import {useShallow} from "zustand/react/shallow";

export const Tooltip = React.memo(() => {
    const maps = useMaps(useShallow(state => state.maps));
    const settings = useSettings(useShallow(state => state.settings));

    const tooltipAt = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (tooltipAt.current === null || maps === null) return;
        const container = tooltipAt.current;

        const handleMouseMove = (e: MouseEvent) => {
            if (!e.target) return;

            container.style.left = Math.min(window.innerWidth - 300, e.screenX + 20).toString();
            container.style.top = Math.min(window.innerHeight - 200, e.screenY - 40).toString();

            let isCanvas = e.target.tagName == "CANVAS";
            let id = e.target.id;
            container.style.display = isCanvas ? "grid" : window.tips[id] ? "block" : "none";

            if (isCanvas) {
                let localX = (e.offsetX / e.target.width) * settings.width;
                let localY = (e.offsetY / e.target.height) * settings.height;
                let ind = Math.floor(localX) + Math.floor(localY) * settings.width;
                container.innerHTML = Object.keys(maps)
                    .map((key) =>
                        key == "photo"
                            ? ""
                            : `<div>${key}</div><div>${
                                key == "biome"
                                    ? biomeNames[maps[key][ind]].toUpperCase()
                                    : maps[key][ind]
                            }</div>`
                    )
                    .join("");
            } else if (tips[id]) {
                container.innerHTML = tips[id];
            }
        }

        window.addEventListener('mousemove', handleMouseMove)

        // Clean up the event listener on component unmount to prevent memory leaks
        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
        }
    }, [maps, settings]);

    return (
        <div ref={tooltipAt} id="tooltip"/>
    )
})