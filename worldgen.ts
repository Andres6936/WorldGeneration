"use strict";

let randomSeed = 6;

function random() {
  let x = Math.sin(randomSeed) * 10000;
  randomSeed = (randomSeed + Math.E) % 1e8;
  return x - Math.floor(x);
}

function spread(range) {
  return range * (random() - 0.5);
}

/**
 * @param {number} x
 * @param {number} y
 */
function coord2ind([x, y], width) {
  return [Math.floor(x) + Math.floor(y * width)];
}


/**
 * Monte-Carlo approximation of the quantile
 * @param {number[]} values
 * @param {number} picks
 * @param {number} level
 */
function approximateQuantile(values: Float32Array, level: number = 0.5, picks: number = 1000): number {
  let l = values.length;
  let picked: number[] = [...Array(picks)].map(() => values[Math.floor(random() * l)]);
  picked = picked.sort();
  return picked[Math.floor(level * picked.length)];
}

function normalizeValues(values: Float32Array, picks: number = 1000): Float32Array {
  let l = values.length;
  let picked: number[] = [...Array(picks)].map(() => values[Math.floor(random() * l)]);
  let max = 0;
  for (let v of picked) if (v > max) max = v;
  return values.map((v) => v / max);
}

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
function generateMap({
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
  randomSeed = seed;

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

function generateHumidity({ width, height, elevation, wind }) : Float32Array {
  console.time("humidity");
  const mapDiagonal = Math.sqrt(width * width + height * height);

  let border = width / 2;

  let humidityImage = data2image(elevation, width, (v, i) => [
    0,
    0,
    0,
    v <= 0 ? 100 : 0,
  ]);
  let wetness = createCanvasCtx(width + border * 2, height + border * 2);

  wetness.ctx.beginPath();
  wetness.ctx.rect(border / 2, border / 2, width + border, height + border);
  wetness.ctx.lineWidth = border / 2;
  wetness.ctx.stroke();

  wetness.ctx.drawImage(humidityImage, width / 2, height / 2);

  wetness.ctx.filter = "opacity(15%)";
  const spotSize = mapDiagonal / 10;
  for (let i = 0; i < 1200; i++) {
    let start = [random() * width, random() * height];
    // @ts-ignore
    let windThere = wind[coord2ind(start, width)];
    let end = [
      start[0] + (windThere * (random() - 0.2) * width) / 8,
      start[1] + (Math.abs(windThere) * (random() - 0.5) * height) / 12,
    ];
    wetness.ctx.drawImage(
      wetness.canvas,
      start[0] + border,
      start[1] + border,
      spotSize,
      spotSize,
      end[0] + border,
      end[1] + border,
      spotSize,
      spotSize
    );
  }

  context2d(humidityImage).filter = "blur(10px)";
  context2d(humidityImage).drawImage(
    wetness.canvas,
    border,
    border,
    width,
    height,
    0,
    0,
    width,
    height
  );

  let humidity: Float32Array = image2alpha(humidityImage);

  console.timeEnd("humidity");

  return humidity;
}

interface ParametersRiversErosion {
  width: number,
  height: number,
  elevation: Float32Array,
  humidity?: any[],
  tectonic?: Float32Array,
  erosion: number,
  riversShown: number,
}

function generateRiversAndErosion({
  width,
  height,
  elevation,
  humidity,
  erosion,
  riversShown,
} : ParametersRiversErosion): Float32Array {
  console.time("rivers");

  const rivers = new Float32Array(width * height);
  let neighbors = createNeighborDeltas(width, SQUARE8)[0];

  for (
    let streamIndex = 0;
    streamIndex < erosion + riversShown;
    streamIndex++
  ) {
    let current = Math.floor(random() * width * height);
    if (elevation[current] < random()) continue;

    if (humidity && humidity[current] < random()) continue;

    let limit = 10000;

    while (elevation[current] > -0.15 && limit-- > 0) {
      if (streamIndex > erosion) {
        rivers[current] += 1;
      }
      let currentElevation = elevation[current];

      let lowestNeighbor = 0,
        lowestNeighborElevation = 100;

      for (let neighborIndex = 0; neighborIndex < 8; neighborIndex++) {
        let neighborDelta = neighbors[neighborIndex];
        if (elevation[current + neighborDelta] <= lowestNeighborElevation) {
          lowestNeighbor = current + neighborDelta;
          lowestNeighborElevation = elevation[lowestNeighbor];
        }
      }

      if (lowestNeighborElevation < currentElevation) {
        elevation[current] -= (currentElevation - lowestNeighborElevation) / 5;
        //if (rivers[lowestNeighbor]) limit -= 10;
      } else {
        elevation[current] = lowestNeighborElevation + 0.02;
      }

      current = lowestNeighbor;
    }
  }

  console.timeEnd("rivers");

  return rivers;
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


const contrastColors = mapToList({
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




/**
 * Returns a matrix of rivers sizes and directions per cell
 * @param {number[]} heights
 * @param {number[]} neighborDeltas
 * @returns {number[]}
 */
function generatePrettyRivers(heights, probability, attempts, neighborDeltas, columns) {
  let hlen = heights.length;
  let courseAt = 0;
  let course = new Int32Array(100);
  let riverDepth = new Int32Array(hlen);
  let flowsTo = new Int32Array(hlen);
  for (let riveri = 0; riveri < attempts; riveri++) {
    let at = Math.floor(random() * hlen);
    if (heights[at] <= 0 || probability[at] < random()) continue;
    courseAt = 0;    
    while (heights[at] > 0 && courseAt < 100) {
      let row = Math.floor(at / columns);
      let lowestNeighborDelta = neighborDeltas[row%2].reduce((a, b) =>
        heights[at + a] - riverDepth[at + a] <
        heights[at + b] - riverDepth[at + b]
          ? a
          : b
      );
      if (heights[at + lowestNeighborDelta] >= heights[at]) break;
      at = at + lowestNeighborDelta;
      course[courseAt++] = at;
    }
    if (courseAt > 2 && heights[at] <= 0) {
      for (let i = 0; i < courseAt; i++) {
        riverDepth[course[i]]++;
        flowsTo[course[i]] = course[i + 1];
      }
    }
  }
  return { riverDepth, flowsTo };
}