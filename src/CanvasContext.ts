import {ConverterFunc, Size} from "./core/types.ts";

export interface CanvasContext {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
}

export function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const canvasContext = canvas.getContext("2d");
    if (canvasContext === null) {
        throw new Error("The canvas context is null, fail in the canvas object.")
    } else {
        return canvasContext;
    }
}

/**
 * Creates canvas of the required size and returns it and it's 2d context.
 */
export function createCanvasCtx(width: number, height: number): CanvasContext {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx: CanvasRenderingContext2D = context2d(canvas);
    return {canvas, ctx};
}

export function addFilter(srcCanvas: HTMLCanvasElement, filter: string): HTMLCanvasElement {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(srcCanvas.width, srcCanvas.height);
    ctx.filter = filter;
    ctx.drawImage(srcCanvas, 0, 0);
    return canvas;
}

/**
 * Convert data to image according to callback function
 */
export function drawValuesAtContext(values: Float32Array, context: CanvasRenderingContext2D, size: Size, converter: ConverterFunc): CanvasRenderingContext2D {
    let idata: ImageData = context.createImageData(size.w, size.h);
    for (let i = 0; i < values.length; i++) {
        idata.data.set(converter(values[i], i), i * 4);
    }
    context.putImageData(idata, 0, 0);
    return context;
}

/**
 * Convert data to image according to callback function
 */
export function data2image(values: Float32Array, width: number, converter: ConverterFunc): HTMLCanvasElement {
    let height: number = values.length / width;
    let {canvas, ctx}: CanvasContext = createCanvasCtx(width, height);
    let idata: ImageData = ctx.createImageData(width, height);
    for (let i = 0; i < values.length; i++) {
        idata.data.set(converter(values[i], i), i * 4);
    }
    ctx.putImageData(idata, 0, 0);
    return canvas;
}

/**
 * Returns alpha channel of the image as numbers in 0-255 range.
 */
export function image2alpha(canvas: HTMLCanvasElement): Float32Array {
    let ctx: CanvasRenderingContext2D = context2d(canvas);
    let idata: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data: Uint8ClampedArray = idata.data;
    let values = new Float32Array(data.length / 4);
    for (let i = 0; i < data.length; i++) values[i] = data[i * 4 + 3] / 255;

    return values;
}