interface ParametersRiversErosion {
    width: number,
    height: number,
    elevation: Float32Array,
    humidity?: any[],
    tectonic?: Float32Array,
    erosion: number,
    riversShown: number,
}

function generateRiversAndErosion({
                                      width,
                                      height,
                                      elevation,
                                      humidity,
                                      erosion,
                                      riversShown,
                                  }: ParametersRiversErosion): Float32Array {
    console.time("rivers");

    const rivers = new Float32Array(width * height);
    let neighbors = createNeighborDeltas(width, SQUARE8)[0];

    for (
        let streamIndex = 0;
        streamIndex < erosion + riversShown;
        streamIndex++
    ) {
        let current = Math.floor(random() * width * height);
        if (elevation[current] < random()) continue;

        if (humidity && humidity[current] < random()) continue;

        let limit = 10000;

        while (elevation[current] > -0.15 && limit-- > 0) {
            if (streamIndex > erosion) {
                rivers[current] += 1;
            }
            let currentElevation = elevation[current];

            let lowestNeighbor = 0,
                lowestNeighborElevation = 100;

            for (let neighborIndex = 0; neighborIndex < 8; neighborIndex++) {
                let neighborDelta = neighbors[neighborIndex];
                if (elevation[current + neighborDelta] <= lowestNeighborElevation) {
                    lowestNeighbor = current + neighborDelta;
                    lowestNeighborElevation = elevation[lowestNeighbor];
                }
            }

            if (lowestNeighborElevation < currentElevation) {
                elevation[current] -= (currentElevation - lowestNeighborElevation) / 5;
                //if (rivers[lowestNeighbor]) limit -= 10;
            } else {
                elevation[current] = lowestNeighborElevation + 0.02;
            }

            current = lowestNeighbor;
        }
    }

    console.timeEnd("rivers");

    return rivers;
}


/**
 * Returns a matrix of rivers sizes and directions per cell
 * @param {number[]} heights
 * @param {number[]} neighborDeltas
 * @returns {number[]}
 */
function generatePrettyRivers(heights, probability, attempts, neighborDeltas, columns) {
    let hlen = heights.length;
    let courseAt = 0;
    let course = new Int32Array(100);
    let riverDepth = new Int32Array(hlen);
    let flowsTo = new Int32Array(hlen);
    for (let riveri = 0; riveri < attempts; riveri++) {
        let at = Math.floor(random() * hlen);
        if (heights[at] <= 0 || probability[at] < random()) continue;
        courseAt = 0;
        while (heights[at] > 0 && courseAt < 100) {
            let row = Math.floor(at / columns);
            let lowestNeighborDelta = neighborDeltas[row % 2].reduce((a, b) =>
                heights[at + a] - riverDepth[at + a] <
                heights[at + b] - riverDepth[at + b]
                    ? a
                    : b
            );
            if (heights[at + lowestNeighborDelta] >= heights[at]) break;
            at = at + lowestNeighborDelta;
            course[courseAt++] = at;
        }
        if (courseAt > 2 && heights[at] <= 0) {
            for (let i = 0; i < courseAt; i++) {
                riverDepth[course[i]]++;
                flowsTo[course[i]] = course[i + 1];
            }
        }
    }
    return {riverDepth, flowsTo};
}