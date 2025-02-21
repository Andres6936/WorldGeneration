export type Size = { w: number, h: number };

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
};