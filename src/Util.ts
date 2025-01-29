let randomSeed = 6;

export function random() {
    let x = Math.sin(randomSeed) * 10000;
    randomSeed = (randomSeed + Math.E) % 1e8;
    return x - Math.floor(x);
}

export function spread(range) {
    return range * (random() - 0.5);
}

/**
 * @param {number} x
 * @param {number} y
 */
export function coord2ind([x, y], width) {
    return [Math.floor(x) + Math.floor(y * width)];
}


/**
 * Monte-Carlo approximation of the quantile
 * @param {number[]} values
 * @param {number} picks
 * @param {number} level
 */
export function approximateQuantile(values: Float32Array, level: number = 0.5, picks: number = 1000): number {
    let l = values.length;
    let picked: number[] = [...Array(picks)].map(() => values[Math.floor(random() * l)]);
    picked = picked.sort();
    return picked[Math.floor(level * picked.length)];
}

export function normalizeValues(values: Float32Array, picks: number = 1000): Float32Array {
    let l = values.length;
    let picked: number[] = [...Array(picks)].map(() => values[Math.floor(random() * l)]);
    let max = 0;
    for (let v of picked) if (v > max) max = v;
    return values.map((v) => v / max);
}