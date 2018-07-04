import newArray from "new-array";
import { randomFloat } from "penplot/util/random";
import triangulate from "delaunay-triangulate";

function delaunay(width, height) {
  const pointCount = 200;
  const positions = newArray(pointCount).map(() => {
    const margin = 2;
    return [
      randomFloat(margin, width - margin),
      randomFloat(margin, height - margin)
    ];
  });

  const cells = triangulate(positions);

  const lines = cells.map(cell => {
    const triangle = cell.map(i => positions[i]);
    triangle.push(triangle[0]);
    return triangle;
  });

  return lines;
}

export default delaunay;
