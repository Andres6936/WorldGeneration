export type Size = { w: number, h: number };

export type ConverterFuncPhoto = (value: [number, number, number, number], index: number) => ArrayLike<number>;

export type ConverterFunc = (value: number, index: number) => ArrayLike<number>;

/**
 * Represents a cell with various geographical and infrastructural properties.
 */
export type Cell = {
    cover: number; // 0, SNOW, or DESERT
    highlands: number; // 0, HILL, or MOUNTAIN
    water: number; // 0, WATER, or RIVER
    river: number; // If it's a river, the next cells it flows to; otherwise, 0
    vegetation: number; // 0 or FOREST
    road: number; // 0 or ROAD
    building: number; // 0 or CITY
    empty: boolean;
};

type ArrayPhoto = [number, number, number, number][];

export type GenerateMap = {
    elevation: Float32Array,
    noise: Float32Array,
    crust: Float32Array,
    tectonic: Float32Array,
    rivers: Float32Array,
    wind: Float32Array,
    temperature: Float32Array,
    humidity: Float32Array,
    biome: Float32Array,
    photo: ArrayPhoto | undefined,
}