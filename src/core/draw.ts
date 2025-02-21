import {context2d, drawValuesAtContext} from "../CanvasContext.ts";
import {rescaleImage} from "../UtilImage.ts";
import {Size} from "./types.ts";

export function drawAtContext(
    context: CanvasRenderingContext2D,
    size: Size,
    data: Float32Array,
    title: string,
    fun: (v: number, i: number) => [number, number, number, number],
    scale = 1 / 4,
    withReduceSize: boolean = false,
) {
    const image = drawValuesAtContext(data, context, size, fun);

    if (withReduceSize) {
        let mini = rescaleImage(image, size.w * scale, size.h * scale);
        let ctx = context2d(mini);
        ctx.font = "14px Verdana";
        ctx.fillStyle = "white";
        ctx.strokeText(title, 5, 15);
        ctx.fillText(title, 4, 14);
    }
}