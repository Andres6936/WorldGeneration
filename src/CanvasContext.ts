interface CanvasContext {
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
}

/**
 * @returns {CanvasRenderingContext2D}
 */
function context2d(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    return canvas.getContext("2d");
}

/**
 * Creates canvas of the required size and returns it and it's 2d context.
 * @param {number} width
 * @param {number} height
 * @returns {{canvas:HTMLCanvasElement, ctx:CanvasRenderingContext2D}}
 */
function createCanvasCtx(width: number, height: number): CanvasContext {
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    let ctx: CanvasRenderingContext2D = context2d(canvas);
    return {canvas, ctx};
}

function addFilter(srcCanvas: HTMLCanvasElement, filter: string): HTMLCanvasElement {
    let {canvas, ctx}: CanvasContext = createCanvasCtx(srcCanvas.width, srcCanvas.height);
    ctx.filter = filter;
    ctx.drawImage(srcCanvas, 0, 0);
    return canvas;
}

/**
 * Convert data to image according to callback function
 * @param {any[]} values
 * @param {number} width
 * @param {(v:number, i:number) => [number,number,number,number]} converter
 * @returns {HTMLCanvasElement}
 */
function data2image(values: Float32Array, width: number, converter: (v: number, i: number) => [number, number, number, number]): HTMLCanvasElement {
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
 * @param {HTMLCanvasElement} canvas
 * @returns {values:Float32Array[]}
 */
function image2alpha(canvas: HTMLCanvasElement): Float32Array {
    let ctx: CanvasRenderingContext2D = context2d(canvas);
    let idata: ImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let data: Uint8ClampedArray = idata.data;
    let values = new Float32Array(data.length / 4);
    for (let i = 0; i < data.length; i++) values[i] = data[i * 4 + 3] / 255;

    return values;
}