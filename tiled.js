import { PaperSize, Orientation } from "penplot";
import { polylinesToSVG } from "penplot/util/svg";
import { clipPolylinesToBox } from "penplot/util/geom";
import { random } from "penplot/util/random";

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

function drawLines(x, y, width, height, lines) {
  var leftToRight = random() >= 0.5;
  if (leftToRight) {
    lines.push([[x, y], [x + width, y + height]]);
  } else {
    lines.push([[x + width, y], [x, y + height]]);
  }
}

export default function createPlot(context, dimensions) {
  const [width, height] = dimensions;
  const step = 2;
  let lines = [];

  for (let x = 0; x < width; x += step) {
    for (let y = 0; y < width; y += step) {
      drawLines(x, y, step, step, lines);
    }
  }

  return {
    draw,
    print,
    background: "white",
    animate: false,
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
}
