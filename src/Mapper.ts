"use strict";


import {addFilter, data2image, image2alpha} from "./CanvasContext";
import {colorFromRGBString} from "./UtilImage";
import {gradientNoise} from "./Noise";
import {approximateQuantile, normalizeValues} from "./Util";
import {generateRiversAndErosion} from "./River";
import {generateHumidity} from "./Humidity";

interface GenerateMap {
  elevation: Float32Array,
  noise: Float32Array,
  crust: Float32Array,
  tectonic: Float32Array,
  rivers: Float32Array,
  wind: Float32Array,
  temperature: Float32Array,
  humidity: Float32Array,
  biome: Float32Array,
  photo,
}

/**
 * @param {number} width
 * @param {number} height
 */
export function generateMap({
  width,
  height,
  seed,
  seaRatio,
  flatness,
  noiseSmoothness,
  tectonicSmoothness,
  noiseFactor,
  crustFactor,
  tectonicFactor,
  averageTemperature,
  biomeScrambling,
  pangaea,
  erosion,
  riversShown,
  randomiseHumidity,
  generatePhoto
}) : GenerateMap {
  window.randomSeed = seed;

  const mapSize = width * height;
  const mapDiagonal = Math.sqrt(width * width + height * height);

  console.time("noise");

  let noise: Float32Array = image2alpha(
    addFilter(
      gradientNoise(width, height, 3000, mapDiagonal * 0.15, 0.01),
      `blur(${noiseSmoothness}px)`
    )
  );
  let crust: Float32Array = image2alpha(
    addFilter(
      gradientNoise(width, height, 2000, mapDiagonal * 0.15, 0.03),
      `blur(${tectonicSmoothness}px)`
    )
  );
  console.timeEnd("noise");

  console.time("main");

  let tectonicMedian: number = approximateQuantile(crust, 0.5);

  let tectonic: Float32Array = crust.map(
    (v) => 0.2 / (Math.abs(tectonicMedian - v) + 0.1) - 0.95
  );

  let elevation : Float32Array= noise.map(
    (_, i) =>
      5 +
      noise[i] * noiseFactor +
      crust[i] * crustFactor +
      tectonic[i] * tectonicFactor +
      -pangaea *
        (Math.abs(i / mapSize - 0.5) + Math.abs((i % width) / width - 0.5))
  );

  console.timeEnd("main");

  console.time("normalize");

  elevation = normalizeValues(elevation);

  let seaLevel: number = approximateQuantile(elevation, seaRatio);

  elevation = elevation.map((v, i) =>
    v < seaLevel
      ? -Math.pow(1 - v / seaLevel, 0.35)
      : Math.pow(
          ((v - seaLevel) * (0.5 + tectonic[i] * 0.5)) / (1 - seaLevel),
          1 + 2 * flatness
        )
  );

  console.timeEnd("normalize");

  let rivers: Float32Array = generateRiversAndErosion({
    width,
    height,
    elevation,
    tectonic,
    erosion,
    riversShown,
  });

  let wind: Float32Array = elevation.map(
      (h, i) =>
          Math.cos((Math.abs(0.5 - i / mapSize) * 4 + 0.85) * Math.PI) /
          (h < 0 ? 1 : 1 + 5 * h * h)
  );

  console.time("windSmoothing");
  wind = image2alpha(
    addFilter(
      data2image(wind, width, (v) => [0, 0, 0, 127 * (v + 1)]),
      "blur(3px)"
    )
  ).map((v) => v * 2 - 1);
  console.timeEnd("windSmoothing");

  let humidity: Float32Array = generateHumidity({ width, height, elevation, wind });

  if (randomiseHumidity) {
    humidity = humidity.map((v, i) =>
      Math.max(0, v + Math.sin(noise[i] * 50) / 10 - elevation[i] * 0.2)
    );
  }

  let temperature: Float32Array = elevation.map(
      (e, i) =>
          averageTemperature +
          25 -
          (100 * Math.abs(0.5 - i / mapSize)) / (0.7 + 0.6 * humidity[i]) -
          Math.max(0, e) * 30
  );

  //humidity = humidity.map((w, i) => w * (1 + Math.atan(-temperature[i] / 100)));

  console.time("biome");
  let biome: Float32Array = temperature.map((t, i) => {
    let b =
        biomeTable[
            Math.floor(
                Math.max(
                    0,
                    Math.min(
                        humidity[i] *
                        4.5 *
                        (1 + biomeScrambling * Math.sin(noise[i] * 100)),
                        5
            )
          )
        )
      ][Math.floor(Math.max(0, Math.min(t / 10 + 1, 3)))] || 0;
    if (b == TUNDRA && elevation[i] > 0.5) b = MOUNTAIN;
    return b;
  });
  console.timeEnd("biome");

  /**@type {number[][]} */
  let photo;
  if (generatePhoto) {
    console.time("photo");
    // @ts-ignore
    photo = [...humidity].map((w, i) => {
      if (elevation[i] < 0)
        return [0, (1 + elevation[i]) * 55, (1 + elevation[i]) * 155, 255];
      else {
        let rgba = [
          temperature[i] * 15 - w * 1000,
          270 - w * 250,
          temperature[i] * 8 - w * 700,
          255,
        ];
        for (let j = 0; j < 3; j++) {
          if (temperature[i] < 0) rgba[j] = 255;
          rgba[j] +=
            50 +
            -elevation[i] * 140 +
            25 *
              Math.atan(
                120 *
                  ((elevation[
                    i + width * (i > (width * height) / 2 ? 1 : -1)
                  ] || 0) -
                    elevation[i])
              );
        }
        return rgba;
      }
    });
    console.timeEnd("photo");
  }

  return {
    elevation,
    noise,
    crust,
    tectonic,
    rivers,
    wind,
    temperature,
    humidity,
    biome,
    photo,
  };
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

const biomeNames = [
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

function mapToList(m) {
  let l = [];
  for (let k in m) {
    l[k] = m[k];
  }
  return l;
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



