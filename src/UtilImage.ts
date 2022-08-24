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