import { PaperSize, Orientation } from "penplot";
import { polylinesToSVG } from "penplot/util/svg";
import { clipPolylinesToBox } from "penplot/util/geom";
import newArray from "new-array";
import clustering from "density-clustering";
import convexHull from "convex-hull";
import { randomFloat } from "penplot/util/random";

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

export default function createPlot(context, dimensions) {
  const [width, height] = dimensions;

  const pointCount = 50000;
  let points = newArray(pointCount).map(() => {
    const margin = 2;
    return [
      randomFloat(margin, width - margin),
      randomFloat(margin, height - margin)
    ];
  });

  const lines = [];

  const clusterCount = 4;

  setInterval(update, 1000 / 30);

  return {
    draw,
    print,
    background: "white",
    animate: true,
    clear: true
  };

  function draw() {
    lines.forEach(points => {
      context.beginPath();
      points.forEach(p => context.lineTo(p[0], p[1]));
      context.stroke();
    });
  }

  function print() {
    return polylinesToSVG(lines, {
      dimensions
    });
  }

  function clusterPoints() {
    const scan = new clustering.KMEANS();
    const clusters = scan.run(points, clusterCount).filter(c => c.length >= 3);

    if (clusters.length === 0) return;

    clusters.sort((a, b) => a.length - b.length);

    return clusters;
  }

  function convexify(cluster) {
    const positions = cluster.map(i => points[i]);

    const edges = convexHull(positions);
    if (edges.length <= 2) return;

    let path = edges.map(c => positions[c[0]]);
    path.push(path[0]);

    lines.push(path);

    points = points.filter(p => !positions.includes(p));
  }

  function pickCluster(clusters) {
    const cluster = clusters[0];
    return cluster;
  }

  function update() {
    if (points.length <= clusterCount) return;

    const clusters = clusterPoints();

    const cluster = pickCluster(clusters);

    console.log({ count: clusters.length, pointsCount: points.length });

    convexify(cluster);
  }
}
