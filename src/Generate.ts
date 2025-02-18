import {generateMap} from "./Mapper";
import {
    AXIAL,
    createNeighborDeltas,
    distanceBetweenCells,
    rescaleCoordinates,
    shortestPath,
    SQUARE,
    SQUARE8
} from './Geometry'
import {generatePrettyRivers} from "./River";
import {drawTerrain, ISPATH} from "./HexDraw";
import {random, spread} from "./Util";
import {Settings} from "./global";

export function generate(drawAt: HTMLDivElement, mapAt: HTMLDivElement, settings: Settings) {
    console.time("generation");
    const {
        elevation,
        tectonic,
        rivers,
        wind,
        temperature,
        humidity,
        biome,
        photo,
    } = generateMap(settings);

    console.timeEnd("generation");

    console.time("gamemap");

    let layout = settings.squareGrid ? SQUARE : AXIAL;

    let gameCanvas = document.getElementById("gameMap");

    if (settings.gameMapScale) {
        let rescale = rescaleCoordinates(
            settings.height,
            settings.width,
            32 / settings.gameMapScale,
            layout
        );

        let hexCoords = rescale.indices;
        let {columns, row} = rescale;
        let neighborDeltas = createNeighborDeltas(columns, layout);

        console.log(rescale);

        gameCanvas.width = settings.width * settings.gameMapScale + 32;
        gameCanvas.height = settings.height * settings.gameMapScale;

        gameCanvas.setAttribute('style', `display:block;width:${gameCanvas.width}px;height:${gameCanvas.height}px;`)

        window.randomSeed = settings.seed;

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

        /**
         * @typedef Cell
         * @property {number} cover - 0, SNOW or DESERT
         * @property {number} highlands - 0, HILL or MOUNTAIN
         * @property {number} water - 0, WATER or RIVER
         * @property {number} river - if river, next cells it flows to. otherwise, 0
         * @property {number} vegetation - 0 or FOREST
         * @property {number} road - 0 or ROAD
         * @property {number} building - 0 or CITY
         */

        /** @type {Cell[]} */
        let gameMap = hexCoords.map((i, hexi) => {
            /** @type {Cell} */
            let c = {};

            let [e, h, t] = [elevation[i], humidity[i], temperature[i]];

            if (h == 0) {
                return {empty: true};
            }

            c.cover = 0;
            if (t < random() * 0.2 - 0.1) c.cover = SNOW;
            else if (h < 0.25 && t > 20) c.cover = DESERT;

            let water = e < 0;

            c.highlands = 0;
            if (!water && tectonic[i] + e > 1.3 + spread(0.8)) {
                if (e > 0.6 + spread(0.2)) c.highlands = MOUNTAIN;
                else c.highlands = HILL;
            }

            let river = riverDepth[hexi] > 3;

            if (
                h > 0.6 + spread(0.4) &&
                !water &&
                !river &&
                c.highlands != MOUNTAIN
            ) {
                c.vegetation = LIGHTFOREST;
            }

            if (!c.cover && !c.vegetation && h > 0.4) c.cover = GRASS;

            if (water) c.water = river ? RIVERDELTA : WATER;

            if (river) c.river = flowsTo[hexi];

            return c;
        });

        let cities = [];
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
            for (let delta of neighborDeltas[row % 2]) {
                let neighbor = gameMap[i + delta];
                quality +=
                    (c.river ? 10 : 0) +
                    (c.water ? 50 : 0) +
                    (c.water == RIVERDELTA ? 50 : 0) +
                    (c.cover == 0 ? 10 : 0);
            }
            if (quality / 400 > random()) {
                for (let other of cities) {
                    if (distanceBetweenCells(other, i, columns, layout) < 5) return;
                }
                c.building = CITY;
                c.road = ROAD;
                c.vegetation = 0;
                cities.push(i);
            }
        });

        console.time("roads");
        let pathfindingDeltas = layout == SQUARE ? createNeighborDeltas(columns, SQUARE8) : neighborDeltas;
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
            gameCanvas.getContext("2d"),
            tiles,
            {[RIVER]: flowsTo},
            columns,
            layout == SQUARE ? tilesetSquare : tilesetHex,
            layout
        );
    } else {
        gameCanvas.setAttribute('style', `display:none;`)
    }

    console.timeEnd("gamemap");
}

