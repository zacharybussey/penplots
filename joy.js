import { PaperSize, Orientation } from "penplot";
import { polylinesToSVG } from "penplot/util/svg";
import { clipPolylinesToBox } from "penplot/util/geom";
import { random } from "penplot/util/random";

export const orientation = Orientation.PORTRAIT;
export const dimensions = [27.94, 35.56];

export default function createPlot(context, dimensions) {
  const [width, height] = dimensions;
  let lines = [];
  const step = 0.8;

  for (let i = step + 4; i <= height - 1 - step; i += step) {
    let line = [];
    for (let j = step; j <= width; j += step) {
      var distanceToCenter = Math.abs(j - width / 2);
      var variance = Math.max(width / 2 - 6 - distanceToCenter, 0);
      let r = ((random() * variance) / 2) * -1;
      let point = [j, i + r];
      line.push(point);
    }
    lines.push(line);
  }

  // Clip all the lines to a margin
  const margin = 1.5;
  const box = [margin, margin, width - margin, height - margin];
  lines = clipPolylinesToBox(lines, box);

  return {
    draw,
    print,
    background: "white",
    animate: false,
    clear: true
  };

  function draw() {
    function* getColor() {
      const colors = [
        "#f80c12",
        "#ee1100",
        "#ff3311",
        "#ff4422",
        "#ff6644",
        "#ff9933",
        "#feae2d",
        "#ccbb33",
        "#d0c310",
        "#aacc22",
        "#69d025",
        "#22ccaa",
        "#12bdb9",
        "#11aabb",
        "#4444dd",
        "#3311bb",
        "#3b0cbd",
        "#442299"
      ];

      let i = 0;
      while (true) {
        yield colors[i];
        i++;
        if (i == colors.length) {
          i = 0;
        }
      }
    }

    context.fillStyle = "#fff";
    context.lineWidth = 0.05;
    const colorGen = getColor();
    lines.forEach(points => {
      context.strokeStyle = colorGen.next().value;
      context.beginPath();
      context.moveTo(points[0][0], points[0][1]);
      for (var j = 0; j < points.length - 2; j++) {
        let xc = (points[j][0] + points[j + 1][0]) / 2;
        let yc = (points[j][1] + points[j + 1][1]) / 2;
        context.quadraticCurveTo(points[j][0], points[j][1], xc, yc);
      }
      context.quadraticCurveTo(
        points[j][0],
        points[j][1],
        points[j + 1][0],
        points[j + 1][1]
      );
      context.fill();
      context.stroke();
    });
  }

  function print() {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
