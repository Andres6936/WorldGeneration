import {drawValuesAtContext} from "../CanvasContext.ts";
import {rescaleContext} from "../UtilImage.ts";
import {ArrayPhoto, ConverterFunc, ConverterFuncPhoto, Size} from "./types.ts";

export function drawAtContext<DataArray extends Float32Array | ArrayPhoto>(
    context: CanvasRenderingContext2D,
    size: Size,
    data: DataArray,
    title: string,
    fun: DataArray extends ArrayPhoto ? ConverterFuncPhoto : ConverterFunc,
    withReduceSize: boolean = false,
    scale = 1 / 4,
) {
    const image = drawValuesAtContext(data, context, size, fun);

    if (withReduceSize) {
        const rescaledCanvas = rescaleContext(image, size.w * scale, size.h * scale);
        const rescaledContext = rescaledCanvas.getContext("2d");
        if (!rescaledContext) {
            throw new Error("Could not get context 2D of rescaled canvas");
        }
        rescaledContext.font = "14px Verdana";
        rescaledContext.fillStyle = "white";
        rescaledContext.strokeText(title, 5, 15);
        rescaledContext.fillText(title, 4, 14);

        context.drawImage(rescaledCanvas, 0, 0);
    }
}