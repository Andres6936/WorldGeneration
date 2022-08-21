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