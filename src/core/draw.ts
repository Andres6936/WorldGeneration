import {Settings} from "../global";
import {context2d, data2image} from "../CanvasContext.ts";
import {rescaleImage} from "../UtilImage.ts";

export function showMap(
    settings: Settings,
    data: Float32Array,
    title: string,
    fun: (v: number, i: number) => [number, number, number, number],
    scale = 1 / 4,
): { canvasOriginalSize: HTMLCanvasElement, canvasReduceSize: HTMLCanvasElement } {

    let image = data2image(data, settings.width, fun);
    let mini = rescaleImage(image, image.width * scale, image.height * scale);
    let ctx = context2d(mini);
    ctx.font = "14px Verdana";
    ctx.fillStyle = "white";
    ctx.strokeText(title, 5, 15);
    ctx.fillText(title, 4, 14);

    return {
        canvasOriginalSize: image,
        canvasReduceSize: mini,
    };
}