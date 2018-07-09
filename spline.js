import { PaperSize, Orientation } from "penplot";
import { polylinesToSVG } from "penplot/util/svg";
import { linspace } from "./util";
import nj from 'numjs';
import SandSpline from './sandSpline';

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

function* f() {
  linspace(0, 1.0, grid_x).forEach(x => {
    yield nj.array([[x, 0]]);
  });
}


function* splineIterator(inum, stp){

  const splines = [];
  const pnum = 10;
  const guide = f();

  let y = linespace(0, 1.0, pnum);
  let x = nj.zeros(pnum);
  let path = nj.stack([x,y], -1);

  let scale = nj.arange(pnum).map(n => n * stp);

  let s = SandSpline(
    guide,
    path,
    inum,
    scale
  );
  splines.push(s);

  let itt = 0;
  while(true){
    splines.forEach(s => {
      let xy = next(s)
      itt += 1
      yield [itt, xy]
    })
  }
}


export default function createPlot(context, dimensions) {
  const [width, height] = dimensions;
  const size = width;
  let lines = [];

  const twoPi = 2 * Math.PI;
  const cnum = 50;
  const inum = 4000;
  const stp = 0.000001;
  const grid_x = size * 20;

  //let sand = Sand(size);
  let si = splineIterator();

  while(true){
    let [itt, xy] = si.next();
    //sand.distortDotsWind(xy);
    if (itt < 5000 ){
      //write
    } else {
      break;
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
