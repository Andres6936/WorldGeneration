import React, {useEffect} from "react";
import {generate} from "../Generate.ts";
import {useSettings} from "../store/useSettings.ts";

export const Draw = React.memo(() => {
    const settings = useSettings(state => state.settings);

    useEffect(() => {
        generate(settings);
    }, []);

    return (
        <div>
            <div id="map"></div>
            <div id="minimaps"></div>
        </div>
    )
})