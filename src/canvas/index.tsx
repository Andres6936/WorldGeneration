import React, {useEffect, useRef} from "react";
import {useMaps} from "../store/useMaps.ts";
import {useSettings} from "../store/useSettings.ts";
import {
    AXIAL,
    createNeighborDeltas,
    distanceBetweenCells,
    rescaleCoordinates,
    shortestPath,
    SQUARE,
    SQUARE8
} from "../Geometry.ts";
import {generatePrettyRivers} from "../River.ts";
import {drawTerrain, ISPATH} from "../HexDraw.ts";
import {random, spread} from "../Util.ts";
import {useShallow} from "zustand/react/shallow";
import {Cell} from "../core/types.ts";
import stylesScrollArea from "../components/scrollarea/index.module.css";
import {ScrollArea} from "@base-ui-components/react";

const EMPTY_CELL: Cell = {
    cover: 0,
    highlands: 0,
    water: 0,
    river: 0,
    vegetation: 0,
    road: 0,
    building: 0,
    empty: true,
};

export const Canvas = React.memo(() => {
    const maps = useMaps(useShallow(state => state.maps));
    const settings = useSettings(useShallow(state => state.settings));

    const canvasAt = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (canvasAt.current === null || !maps.isReady) return;

        const elevation = maps.withElevation();
        const tectonic = maps.withTectonic();
        const temperature = maps.withTemperature();
        const humidity = maps.withHumidity();

        console.time("Drawing Canvas Map");

        let typeLayout = settings.squareGrid ? SQUARE : AXIAL;
        let container = canvasAt.current;

        if (settings.gameMapScale) {
            let rescale = rescaleCoordinates(
                settings.width,
                settings.height,
                32 / settings.gameMapScale,
                typeLayout
            );

            let hexCoords = rescale.indices;
            let {columns} = rescale;
            let neighborDeltas = createNeighborDeltas(columns, typeLayout);

            console.log(rescale);

            container.width = settings.width * settings.gameMapScale + 32;
            container.height = settings.height * settings.gameMapScale;

            container.setAttribute('style', `display:block;width:${container.width}px;height:${container.height}px;`)

            // window.randomSeed = settings.seed;

            let {riverDepth, flowsTo} = generatePrettyRivers(
                hexCoords.map((i) => elevation[i]),
                hexCoords.map((i) => Math.max(humidity[i], elevation[i])),
                settings.gameMapRivers,
                neighborDeltas,
                columns
            );

            const WATER = 1,
                ROAD = 2,
                BRIDGE = 3,
                HILLROAD = 4,
                DESERT = 5,
                GRASS = 6,
                SNOW = 7,
                RIVER = 8,
                DIRT = 9,
                STEPPE = 10,
                RIVERDELTA = 11,
                HILL = 30,
                CITY = 31,
                DIRTHILL = 32,
                MOUNTAIN = 33,
                FOREST = 34,
                LIGHTFOREST = 35,
                GRASS1 = 36,
                SNOWHILL = 37,
                DESERTHILL = 38,
                HILLFOREST = 39;

            let tilesetHex = {
                tilesSize: 32,
                connected: [
                    [WATER, 0, 0],
                    [ROAD, 1, 0],
                    [DESERT, 1, 3],
                    [DIRT, 2, 0],
                    [GRASS, 4, 0],
                    [BRIDGE, 5, 0],
                    [SNOW, 5, 3],
                    [HILLROAD, 6, 0],
                    [RIVER, 6, 3],
                    [RIVERDELTA, 7, 3],
                ],
                single: [
                    [HILL, 3, 1],
                    [CITY, 5, 6],
                    [DIRTHILL, 3, 5],
                    [SNOWHILL, 3, 6],
                    [DESERTHILL, 3, 7],
                    [MOUNTAIN, 4, 4],
                    [FOREST, 3, 3],
                    [LIGHTFOREST, 4, 6],
                    [HILLFOREST, 4, 7],
                    [STEPPE, 7, 1],
                    [GRASS1, 4, 3],
                ],
                grouped: [
                    [RIVER, RIVERDELTA],
                    [ROAD, BRIDGE, HILLROAD],
                ],
                tilesheet: document.getElementById("hexSheet"),
            };

            let tilesetSquare = {
                tilesSize: 32,
                connected: [
                    [WATER, 0, 7],
                    [ROAD, 0, 3, ISPATH],
                    [BRIDGE, 0, 3, ISPATH],
                    [DESERT, 8, 0],
                    [RIVERDELTA, 8, 3],
                    [RIVER, 8, 6],
                    [SNOW, 2, 7],
                    [GRASS, 4, 7],
                ],
                single: [
                    [HILL, 3, 0],
                    [DIRTHILL, 3, 1],
                    [SNOWHILL, 3, 2],
                    [DESERTHILL, 3, 3],
                    [CITY, 5, 6],
                    [MOUNTAIN, 4, 4],
                    [FOREST, 3, 3],
                    [LIGHTFOREST, 4, 6],
                    [HILLFOREST, 4, 7],
                    [STEPPE, 7, 1],
                    [GRASS1, 4, 3],
                ],
                grouped: [
                    [RIVER, RIVERDELTA],
                    [ROAD, BRIDGE, HILLROAD],
                ],
                tilesheet: document.getElementById("squareSheet"),
            };


            let gameMap: Cell[] = hexCoords.map((i, hexi) => {
                let cell: Cell = {...EMPTY_CELL, empty: false};

                let [e, h, t] = [elevation[i], humidity[i], temperature[i]];

                if (h == 0) {
                    return {...EMPTY_CELL, empty: true};
                }

                cell.cover = 0;
                if (t < random() * 0.2 - 0.1) cell.cover = SNOW;
                else if (h < 0.25 && t > 20) cell.cover = DESERT;

                let water = e < 0;

                cell.highlands = 0;
                if (!water && tectonic[i] + e > 1.3 + spread(0.8)) {
                    if (e > 0.6 + spread(0.2)) cell.highlands = MOUNTAIN;
                    else cell.highlands = HILL;
                }

                let river = riverDepth[hexi] > 3;

                if (
                    h > 0.6 + spread(0.4) &&
                    !water &&
                    !river &&
                    cell.highlands != MOUNTAIN
                ) {
                    cell.vegetation = LIGHTFOREST;
                }

                if (!cell.cover && !cell.vegetation && h > 0.4) cell.cover = GRASS;

                if (water) cell.water = river ? RIVERDELTA : WATER;

                if (river) cell.river = flowsTo[hexi];

                return cell;
            });

            let cities: number[] = [];
            gameMap.forEach((c, i) => {
                let quality =
                    10 +
                    (c.empty ? -10000 : 0) +
                    (c.water ? -1000 : 0) +
                    (c.river ? 10 : 0) +
                    (c.highlands == MOUNTAIN ? -1000 : 0) +
                    (c.highlands == HILL ? -10 : 0) +
                    (c.highlands == DESERT ? -10 : 0);
                let row = Math.floor(i / columns);
                for (let _ of neighborDeltas[row % 2]) {
                    quality +=
                        (c.river ? 10 : 0) +
                        (c.water ? 50 : 0) +
                        (c.water == RIVERDELTA ? 50 : 0) +
                        (c.cover == 0 ? 10 : 0);
                }
                if (quality / 400 > random()) {
                    for (let other of cities) {
                        if (distanceBetweenCells(other, i, columns, typeLayout) < 5) return;
                    }
                    c.building = CITY;
                    c.road = ROAD;
                    c.vegetation = 0;
                    cities.push(i);
                }
            });

            console.time("roads");
            let pathfindingDeltas = typeLayout == SQUARE ? createNeighborDeltas(columns, SQUARE8) : neighborDeltas;
            for (let start of cities) {
                let end = cities[Math.floor(random() * cities.length)];
                let path = shortestPath(
                    gameMap,
                    start,
                    end,
                    columns,
                    pathfindingDeltas,
                    (c) =>
                        !c || c.empty
                            ? 1000000
                            : c.road
                                ? 5
                                : c.water
                                    ? 500
                                    : c.river
                                        ? 100
                                        : c.highlands == MOUNTAIN
                                            ? 2000
                                            : c.highlands
                                                ? 100
                                                : 30
                );
                for (let c of path) {
                    gameMap[c].road = ROAD;
                    if (gameMap[c].vegetation == FOREST)
                        gameMap[c].vegetation = LIGHTFOREST;
                }
            }
            console.timeEnd("roads");

            let tiles = gameMap.map((c) => {
                let sprites = [GRASS1];

                if (c.cover) sprites.push(c.cover);

                if (c.highlands == HILL) {
                    if (!c.road)
                        sprites.push(
                            c.cover == DESERT ? DIRTHILL : c.cover == SNOW ? SNOWHILL : HILL
                        );
                } else if (c.highlands == MOUNTAIN) {
                    sprites.push(MOUNTAIN);
                }

                if (c.river) sprites.push(RIVER);

                if (c.water) {
                    if (c.water == RIVERDELTA) {
                        sprites.push(WATER);
                    }
                    sprites.push(c.water);
                }

                if (c.road)
                    sprites.push(
                        c.river || c.water ? BRIDGE : c.highlands ? HILLROAD : ROAD
                    );

                if (c.vegetation == LIGHTFOREST)
                    sprites.push(c.highlands && !c.road ? HILLFOREST : LIGHTFOREST);

                if (c.vegetation == FOREST) sprites.push(FOREST);

                if (c.vegetation == FOREST) sprites.push(FOREST);

                if (c.building) sprites.push(c.building);

                return sprites;
            });

            drawTerrain(
                container.getContext("2d"),
                tiles,
                {[RIVER]: flowsTo},
                columns,
                typeLayout == SQUARE ? tilesetSquare : tilesetHex,
                typeLayout
            );
        } else {
            container.setAttribute('style', `display:none;`)
        }

        console.timeEnd("Drawing Canvas Map");

    }, [maps, settings]);

    return (
        <div className="abs top:0 left:0 right:0 bottom:0 flex flex:1">
            <ScrollArea.Root className="box:border w:full">
                <ScrollArea.Viewport className={stylesScrollArea.Viewport}>
                    <ScrollArea.Content className="flex flex:1 justify-content:center align-items:center">
                        <canvas ref={canvasAt} className="max-w:max p:2rem"/>
                    </ScrollArea.Content>
                </ScrollArea.Viewport>
                <ScrollArea.Scrollbar className={stylesScrollArea.Scrollbar}>
                    <ScrollArea.Thumb className={stylesScrollArea.Thumb}/>
                </ScrollArea.Scrollbar>
            </ScrollArea.Root>
        </div>
    )
})
