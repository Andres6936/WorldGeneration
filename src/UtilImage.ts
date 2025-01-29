import {CanvasContext, createCanvasCtx} from "./CanvasContext";

/**
 * Returns canvas rescaled to the new size
 * @param {HTMLCanvasElement} source
 * @param {number} width
 * @param {number} height
 * @returns {HTMLCanvasElement}
 */
function rescaleImage(source: HTMLCanvasElement, width: number, height: number) {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(width, height);
    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
    return canvas;
}

/**
 * Returns canvas that is a fragment of the source canvas
 * @param {HTMLCanvasElement} image
 * @param {number} left
 * @param {number} top
 * @param {number} width
 * @param {number} height
 */
function subImage(image: HTMLCanvasElement, left: number, top: number, width: number, height: number) {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(width, height);
    ctx.drawImage(image, left, top, width, height, 0, 0, width, height);
    return canvas;
}

export function colorFromRGBString(color) {
    let n = parseInt(color, 16);
    return [Math.floor(n / 65536), Math.floor(n / 256) % 256, n % 256, 256];
}

interface ElevationImageParams {
    discreteHeights?: number,
    terrainTypeColoring?: boolean,
    hillRatio?: number,
    mountainRatio?: number,
    green?: boolean,
}

/**
 * Returns elevation image with higher elevation being brighter
 */
function elevation2Image(
    {elevation, rivers},
    {
        discreteHeights = 10,
        terrainTypeColoring = false,
        hillRatio = 0.1,
        mountainRatio = 0.02,
        green = true,
    }: ElevationImageParams
) {
    let hillElevation: number = approximateQuantile(elevation, 1 - hillRatio);
    let mountainElevation: number = approximateQuantile(elevation, 1 - mountainRatio);

    return (v, i) => {
        if (rivers[i] && v > 0) {
            return [0, v * 400, 200, 255];
        }

        let level = discreteHeights
            ? Math.floor(v * discreteHeights) / discreteHeights
            : v;

        if (v > 0) {
            if (terrainTypeColoring)
                return v < hillElevation
                    ? [32, 128, 32, 255]
                    : v < mountainElevation
                        ? [196, 196, 32, 255]
                        : [128, 32, 0, 255];
            else
                return green
                    ? [level * 400, level * 150 + 100, 50, 255]
                    : [250 - level * 300, 200 - level * 300, 0, 255];
        } else {
            return [0, level * 60 + 60, level * 80 + 100, 255];
        }
    };
}
