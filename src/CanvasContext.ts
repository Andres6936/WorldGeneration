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