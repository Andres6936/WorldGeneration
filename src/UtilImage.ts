import {CanvasContext, createCanvasCtx} from "./CanvasContext";
import {approximateQuantile} from "./Util";

/**
 * Returns canvas rescaled to the new size
 */
export function rescaleImage(source: HTMLCanvasElement, width: number, height: number) {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(width, height);
    ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
    return canvas;
}

/**
 * Returns canvas rescaled to the new size
 */
export function rescaleContext(source: CanvasRenderingContext2D, width: number, height: number) {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(width, height);
    ctx.drawImage(source.canvas, 0, 0, source.canvas.width, source.canvas.height, 0, 0, width, height);
    return canvas;
}

/**
 * Returns canvas that is a fragment of the source canvas
 */
export function subImage(image: HTMLCanvasElement, left: number, top: number, width: number, height: number) {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(width, height);
    ctx.drawImage(image, left, top, width, height, 0, 0, width, height);
    return canvas;
}

export function colorFromRGBString(color: string): [number, number, number, number] {
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
export function elevation2Image(
    {elevation, rivers}: { elevation: Float32Array, rivers: Float32Array },
    {
        discreteHeights = 10,
        terrainTypeColoring = false,
        hillRatio = 0.1,
        mountainRatio = 0.02,
        green = true,
    }: ElevationImageParams
): (v: number, i: number) => [number, number, number, number] {
    let hillElevation: number = approximateQuantile(elevation, 1 - hillRatio);
    let mountainElevation: number = approximateQuantile(elevation, 1 - mountainRatio);

    return (v: number, i: number) => {
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
