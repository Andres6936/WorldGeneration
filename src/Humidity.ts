function generateHumidity({width, height, elevation, wind}): Float32Array {
    console.time("humidity");
    const mapDiagonal = Math.sqrt(width * width + height * height);

    let border = width / 2;

    let humidityImage = data2image(elevation, width, (v, i) => [
        0,
        0,
        0,
        v <= 0 ? 100 : 0,
    ]);
    let wetness = createCanvasCtx(width + border * 2, height + border * 2);

    wetness.ctx.beginPath();
    wetness.ctx.rect(border / 2, border / 2, width + border, height + border);
    wetness.ctx.lineWidth = border / 2;
    wetness.ctx.stroke();

    wetness.ctx.drawImage(humidityImage, width / 2, height / 2);

    wetness.ctx.filter = "opacity(15%)";
    const spotSize = mapDiagonal / 10;
    for (let i = 0; i < 1200; i++) {
        let start = [random() * width, random() * height];
        // @ts-ignore
        let windThere = wind[coord2ind(start, width)];
        let end = [
            start[0] + (windThere * (random() - 0.2) * width) / 8,
            start[1] + (Math.abs(windThere) * (random() - 0.5) * height) / 12,
        ];
        wetness.ctx.drawImage(
            wetness.canvas,
            start[0] + border,
            start[1] + border,
            spotSize,
            spotSize,
            end[0] + border,
            end[1] + border,
            spotSize,
            spotSize
        );
    }

    context2d(humidityImage).filter = "blur(10px)";
    context2d(humidityImage).drawImage(
        wetness.canvas,
        border,
        border,
        width,
        height,
        0,
        0,
        width,
        height
    );

    let humidity: Float32Array = image2alpha(humidityImage);

    console.timeEnd("humidity");

    return humidity;
}
