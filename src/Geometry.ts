import {Cell} from "./core/types.ts";

export const SQUARE: number = 0;
export const ODDR: number = 1;
export const WIDTH2: number = 2;
export const AXIAL: number = 3;
export const SQUARE8: number = 4;

interface RescaleCoordinate {
    indices: number[],
    columns: number,
    occupiedColumns: number,
    rows: number
}

/**
 * Returns indices of the elementsthat lie on a different resolution grid
 * @param {number} width
 * @param {number} height
 * @param {number} scale - how lower new resolution is
 * @param {number} layout - SQUARE for square grid,
 * ODDR returns a hex grid with even rows shifted 0.5 right and rows height being 0.75 of columns width,
 * WIDTH2 returns a hex grid with column equal to double x
 * AXIAL returns a hex grid with row shifted left by 0.5 more with each row
 */
export function rescaleCoordinates(width: number, height: number, scale: number, layout: number): RescaleCoordinate {
    let verticalScale: number = layout == 0 ? scale : scale * 0.75;

    let rows: number = Math.floor(height / verticalScale);
    let occupiedColumns: number = Math.floor(width / scale);

    let columns: number =
        layout == AXIAL
            ? Math.ceil(occupiedColumns + rows / 2)
            : layout == WIDTH2
                ? occupiedColumns * 2
                : occupiedColumns;

    let size: number = rows * columns;

    let indices: number[] = new Array(size);

    for (let row = 0; row < rows; row++) {
        let y = Math.floor((row + 0.5) * verticalScale);
        let startX = 0;
        if (layout == AXIAL) startX = -scale * 0.5 * row;
        else if (layout == ODDR) startX = row % 2 == 1 ? scale / 2 : 1;
        let step = layout == WIDTH2 ? 2 : 1;
        for (
            let column = layout == WIDTH2 && row % 2 ? 1 : 0;
            column < columns;
            column += step
        ) {
            let x = Math.floor(startX + column * scale / step);
            if (x >= 0 && x <= width) indices[row * columns + column] = y * width + x;
        }
    }
    return {indices, columns, occupiedColumns, rows};
}

/**
 * Returns the list of relative indices of neighbors for even and odd lines in clockwork order.
 * @param {*} columns
 * @param {*} geometry - one of SQUARE, ODDR or AXIAL
 */
export function createNeighborDeltas(columns: number, geometry: number) {
    let r;
    switch (geometry) {
        case SQUARE:
            r = [
                [0, -1],
                [1, 0],
                [0, 1],
                [-1, 0],
            ].map(([dx, dy]) => dy * columns + dx);
            return [r, r];
        case SQUARE8:
            r = [
                [0, -1],
                [1, -1],
                [1, 0],
                [1, 1],
                [0, 1],
                [-1, 1],
                [-1, 0],
                [-1, -1]
            ].map(([dx, dy]) => dy * columns + dx);
            return [r, r]
        case ODDR:
            return [
                [
                    [0, -1],
                    [1, 0],
                    [0, 1],
                    [-1, 1],
                    [-1, 0],
                    [-1, -1],
                ],
                [
                    [1, -1],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                    [-1, 0],
                    [0, -1],
                ],
            ].map((n) => n.map(([dx, dy]) => dy * columns + dx));
        case WIDTH2:
            r = [
                [1, -1],
                [2, 0],
                [1, 1],
                [-1, 1],
                [-2, 0],
                [-1, -1],
            ].map(([dx, dy]) => dy * columns + dx);
            return [r, r];
        case AXIAL:
            r = [
                [0, -1],
                [1, 0],
                [1, 1],
                [0, 1],
                [-1, 0],
                [-1, -1],
            ].map(([dx, dy]) => dy * columns + dx);
            return [r, r];
        default:
            throw new Error("unknown geometry");
    }
}

function ind2xy(ind: number, columns: number): [number, number] {
    let x = ind % columns;
    let y = (ind - x) / columns;
    return [x, y];
}

export function screenPos(ind: number, columns: number, layout: number, tileWidth: number, tileHeight: number = 0): [number, number] {
    let [x, y]: [number, number] = ind2xy(ind, columns);
    return [
        (x +
            (layout == AXIAL
                ? -y * 0.5
                : layout == ODDR
                    ? (y % 2) * 0.5
                    : layout == WIDTH2
                        ? -x / 2
                        : 0)) *
        tileWidth,
        y * (tileHeight || tileWidth * (layout == SQUARE ? 1 : 0.75)),
    ];
}

export function distanceBetweenCells(a: number, b: number, columns: number, layout: number = AXIAL): number {
    let dx = (b % columns) - (a % columns);
    let dy = Math.floor(b / columns) - Math.floor(a / columns);
    let dist = 0;
    switch (layout) {
        case SQUARE:
            dist = Math.abs(dx) + Math.abs(dy)
            break;
        case AXIAL:
            dist = dx * dy > 0
                ? Math.max(Math.abs(dx), Math.max(dy))
                : Math.abs(dx - dy);
            break;
        default:
            console.error("not implemented");
            debugger;
            break;
    }
    return dist;
}

export function shortestPath(world: Cell[], start: number, end: number, columns: number, neighborDeltas: number[][], cellCost: (cell: Cell) => number) {
    let bag = [start];
    let wayCost: number[] = [];
    wayCost[start] = 0;
    let prev = [];
    for (let limit = 0; limit < 10000; limit++) {
        if (bag.length == 0) return null;
        let walking = bag.shift() as number // Before validate if the bag array is empty, is safe make the cast;
        if (walking == end) {
            let r = [];
            while (walking) {
                r.push(walking);
                walking = prev[walking];
            }
            return r;
        }
        let row = Math.floor(walking / columns);
        for (let delta of neighborDeltas[row % 2]) {
            let cell = walking + delta;
            let cost = cellCost(world[cell]);
            let totalCost = cost + wayCost[walking];
            if (!(cell in wayCost) || wayCost[cell] > totalCost) {
                // @ts-ignore
                let bigger = bag.findIndex((v) => wayCost[v] > totalCost);
                bag.splice(bigger >= 0 ? bigger : bag.length, 0, cell);
                wayCost[cell] = totalCost;
                prev[cell] = walking;
            }
        }
    }
    return [];
}
