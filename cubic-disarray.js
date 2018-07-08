import { PaperSize, Orientation } from "penplot";
import { polylinesToSVG } from "penplot/util/svg";
import { clipPolylinesToBox } from "penplot/util/geom";
import R from "ramda";
import { random } from "penplot/util/random";

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

export default function createPlot(context, dimensions) {
  const [width, height] = dimensions;
  const size = width;

  const squareSize = 4;
  const randomDisplacement = 0.4;
  const rotateMultiplier = 0.4;

  function* genS() {
    let x = 0;
    let y = 0;
    while (true) {
      yield [x, y];
      x = x + squareSize;
      if (x > width * 2) {
        x = 0;
        y = y + squareSize;
      }
    }
  }
  const g = genS();

  const grid = R.times(() => g.next().value, width * height);
  const squares = R.map(s => {
    var plusOrMinus = random() < 0.5 ? -1 : 1;
    var rotateAmt =
      (((s[1] / size) * Math.PI) / 180) *
      plusOrMinus *
      random() *
      rotateMultiplier;
    plusOrMinus = random() < 0.5 ? -1 : 1;
    var translateAmt =
      (s[1] / size) * plusOrMinus * random() * randomDisplacement;

    return [s[0] + translateAmt, s[1], rotateAmt];
  }, grid);

  // Clip all the lines to a margin
  // const margin = 1.5;
  // const box = [margin, margin, width - margin, height - margin];
  // lines = clipPolylinesToBox(lines, box);

  return {
    draw,
    print,
    background: "white",
    animate: false,
    clear: true
  };

  function draw() {
    R.forEach(s => {
      context.beginPath();
      context.rotate(s[2]);
      context.rect(s[0] / 2, s[1] / 2, squareSize, squareSize);
      context.stroke();
    }, squares);
  }

  function print() {
    return polylinesToSVG(lines, {
      dimensions
    });
  }
}
