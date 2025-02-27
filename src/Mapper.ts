"use strict";

import {addFilter, data2image, image2alpha} from "./CanvasContext";
import {colorFromRGBString} from "./UtilImage";
import {gradientNoise} from "./Noise";
import {approximateQuantile, normalizeValues} from "./Util";
import {generateRiversAndErosion} from "./River";
import {generateHumidity} from "./Humidity";
import {Settings} from "./global";

export class Mapper {
    private settings: Settings | null = null;
    private mapSize: number = 0
    private mapDiagonal: number = 0

    private noise: Float32Array;
    private crust: Float32Array;
    private tectonic: Float32Array;
    private elevation: Float32Array;
    private rivers: Float32Array;
    private wind: Float32Array;
    private temperature: Float32Array;
    private humidity: Float32Array;
    private biome: Float32Array;
    private photo: [number, number, number, number][] | undefined = undefined;

    public withSettings(_settings: Settings) {
        // window.randomSeed = seed;

        this.settings = _settings;
        this.mapSize = _settings.width * _settings.height;
        this.mapDiagonal = Math.sqrt(_settings.width * _settings.width + _settings.height * _settings.height);

        return this;
    }

    public withNoise() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.noise) return this.noise;

        console.time("noise");
        this.noise = image2alpha(
            addFilter(
                gradientNoise(this.settings.width, this.settings.height, 3000, this.mapDiagonal * 0.15, 0.01),
                `blur(${this.settings.noiseSmoothness}px)`
            )
        );
        console.timeEnd("noise");
        return this.noise;
    }

    public withElevation() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.elevation) return this.elevation;

        this.withNoise();
        this.withCrust();
        this.withTectonic();

        console.time("main");

        let elevation: Float32Array = this.noise.map(
            (_, i) =>
                5 +
                this.noise[i] * this.settings.noiseFactor +
                this.crust[i] * this.settings.crustFactor +
                this.tectonic[i] * this.settings.tectonicFactor +
                -this.settings.pangaea *
                (Math.abs(i / this.mapSize - 0.5) + Math.abs((i % this.settings.width) / this.settings.width - 0.5))
        );

        console.timeEnd("main");

        console.time("normalize");

        elevation = normalizeValues(elevation);
        let seaLevel: number = approximateQuantile(elevation, this.settings.seaRatio);
        this.elevation = elevation.map((v, i) =>
            v < seaLevel
                ? -Math.pow(1 - v / seaLevel, 0.35)
                : Math.pow(
                    ((v - seaLevel) * (0.5 + this.tectonic[i] * 0.5)) / (1 - seaLevel),
                    1 + 2 * this.settings.flatness
                )
        );

        console.timeEnd("normalize");

        return this.elevation;
    }

    public withCrust() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.crust) return this.crust;

        this.crust = image2alpha(
            addFilter(
                gradientNoise(this.settings.width, this.settings.height, 2000, this.mapDiagonal * 0.15, 0.03),
                `blur(${this.settings.tectonicSmoothness}px)`
            )
        );
        return this.crust;
    }

    public withTectonic() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.tectonic) return this.tectonic;

        this.withCrust();

        const tectonicMedian: number = approximateQuantile(this.crust, 0.5);
        this.tectonic = this.crust.map(
            (v) => 0.2 / (Math.abs(tectonicMedian - v) + 0.1) - 0.95
        );

        return this.tectonic;
    }

    public withRivers() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.rivers) return this.rivers;

        this.withElevation();
        this.withTectonic();

        this.rivers = generateRiversAndErosion({
            width: this.settings.width,
            height: this.settings.height,
            elevation: this.elevation,
            tectonic: this.tectonic,
            erosion: this.settings.erosion,
            riversShown: this.settings.riversShown,
        });

        return this.rivers;
    }

    public withWind() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.wind) return this.wind;

        this.withElevation();

        let wind: Float32Array = this.elevation.map(
            (h, i) =>
                Math.cos((Math.abs(0.5 - i / this.mapSize) * 4 + 0.85) * Math.PI) /
                (h < 0 ? 1 : 1 + 5 * h * h)
        );

        console.time("windSmoothing");
        this.wind = image2alpha(
            addFilter(
                data2image(wind, this.settings.width, (v) => [0, 0, 0, 127 * (v + 1)]),
                "blur(3px)"
            )
        ).map((v) => v * 2 - 1);
        console.timeEnd("windSmoothing");

        return this.wind;
    }

    public withTemperature() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.temperature) return this.temperature;

        this.withElevation();
        this.withHumidity();

        this.temperature = this.elevation.map(
            (e, i) =>
                this.settings.averageTemperature +
                25 -
                (100 * Math.abs(0.5 - i / this.mapSize)) / (0.7 + 0.6 * this.humidity[i]) -
                Math.max(0, e) * 30
        );

        //humidity = humidity.map((w, i) => w * (1 + Math.atan(-temperature[i] / 100)));

        return this.temperature;
    }

    public withHumidity() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.humidity) return this.humidity;

        this.withNoise();
        this.withElevation();
        this.withWind();

        this.humidity = generateHumidity({
            width: this.settings.width,
            height: this.settings.height,
            elevation: this.elevation,
            wind: this.wind
        });

        if (this.settings.randomiseHumidity) {
            this.humidity = this.humidity.map((v, i) =>
                Math.max(0, v + Math.sin(this.noise[i] * 50) / 10 - this.elevation[i] * 0.2)
            );
        }

        return this.humidity;
    }

    public withBiome() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.biome) return this.biome;

        this.withNoise();
        this.withTemperature();
        this.withHumidity();

        console.time("biome");
        this.biome = this.temperature.map((t, i) => {
            let b =
                biomeTable[
                    Math.floor(
                        Math.max(
                            0,
                            Math.min(
                                this.humidity[i] *
                                4.5 *
                                (1 + this.settings.biomeScrambling * Math.sin(this.noise[i] * 100)),
                                5
                            )
                        )
                    )
                    ][Math.floor(Math.max(0, Math.min(t / 10 + 1, 3)))] || 0;
            if (b == TUNDRA && this.elevation[i] > 0.5) b = MOUNTAIN;
            return b;
        });
        console.timeEnd("biome");

        return this.biome;
    }

    public withPhoto() {
        if (!this.settings) throw new Error("Settings not set");

        // Already processed, skip operation
        if (this.photo) return this.photo;

        this.withElevation();
        this.withHumidity();
        this.withTemperature();

        if (this.settings.generatePhoto) {
            console.time("photo");
            this.photo = [...this.humidity].map((w, i) => {
                if (this.elevation[i] < 0)
                    return [0, (1 + this.elevation[i]) * 55, (1 + this.elevation[i]) * 155, 255] satisfies [number, number, number, number];
                else {
                    let rgba = [
                        this.temperature[i] * 15 - w * 1000,
                        270 - w * 250,
                        this.temperature[i] * 8 - w * 700,
                        255,
                    ] satisfies [number, number, number, number];
                    for (let j = 0; j < 3; j++) {
                        if (this.temperature[i] < 0) rgba[j] = 255;
                        rgba[j] +=
                            50 +
                            -this.elevation[i] * 140 +
                            25 *
                            Math.atan(
                                120 *
                                ((this.elevation[
                                    i + this.settings.width * (i > (this.settings.width * this.settings.height) / 2 ? 1 : -1)
                                        ] || 0) -
                                    this.elevation[i])
                            );
                    }
                    return rgba satisfies [number, number, number, number];
                }
            });
            console.timeEnd("photo");
        }
        return this.photo;
    }
}

const DESERT = 1,
    GRASSLAND = 2,
    TUNDRA = 3,
    SAVANNA = 4,
    SHRUBLAND = 5,
    TAIGA = 6,
    DENSE_FOREST = 7,
    TEMPERATE_FOREST = 8,
    RAIN_FOREST = 9,
    SWAMP = 10,
    SNOW = 11,
    STEPPE = 12,
    CONIFEROUS_FOREST = 13,
    MOUNTAIN = 14,
    BEACH = 15;

// -> temperature V humidity
const biomeTable = [
    [TUNDRA, STEPPE, SAVANNA, DESERT],
    [TUNDRA, SHRUBLAND, GRASSLAND, GRASSLAND],
    [SNOW, SHRUBLAND, GRASSLAND, TEMPERATE_FOREST],
    [SNOW, CONIFEROUS_FOREST, TEMPERATE_FOREST, TEMPERATE_FOREST],
    [TAIGA, CONIFEROUS_FOREST, DENSE_FOREST, DENSE_FOREST],
    [TAIGA, CONIFEROUS_FOREST, DENSE_FOREST, RAIN_FOREST],
];

export const biomeNames = [
    "unknown",
    "desert",
    "grassland",
    "tundra",
    "savanna",
    "shrubland",
    "taiga",
    "tropical forest",
    "decidious forest",
    "rain forest",
    "swamp",
    "snow",
    "steppe",
    "coniferous forest",
    "mountain shrubland",
    "beach",
];

function mapToList(map: Record<string, string>) {
    let list: string[] = [];
    for (let key in map) {
        list[key] = map[key];
    }
    return list;
}


export const contrastColors = mapToList({
    [DESERT]: "ffff00",
    [GRASSLAND]: "40ff40",
    [TUNDRA]: "c0c0a0",
    [SAVANNA]: "c0c000",
    [SHRUBLAND]: "a0d040",
    [TAIGA]: "006080",
    [DENSE_FOREST]: "008000",
    [TEMPERATE_FOREST]: "40a040",
    [RAIN_FOREST]: "006020",
    [SWAMP]: "808000",
    [SNOW]: "ffffff",
    [STEPPE]: "c0ffa0",
    [CONIFEROUS_FOREST]: "008080",
    [MOUNTAIN]: "c080c0",
    [BEACH]: "ffff80",
}).map(colorFromRGBString);



