import { PaperSize, Orientation } from "penplot";
import { polylinesToSVG } from "penplot/util/svg";
import { random, randomFloat, randomInt } from "penplot/util/random";
import tinycolor from "tinycolor2";

export const orientation = Orientation.LANDSCAPE;
export const dimensions = PaperSize.SQUARE_POSTER;

let k = 22;
let num = 0;
let maxnum = k + 1;
let time = 0;
let maxTime = 20;

let ticks = 1;
let frms = 13;

let sweeps = [];
let maxpal = 256;
let numpal = 0;
let height;
let points = [];

export default function createPlot(context, dimensions) {
  const [width, height] = dimensions;

  let g = height / k;
  for (let y = 0; y < k; y++) {
    sweeps[num] = new Sweep(0, randomInt(0, height), g * 10);
    num++;
  }

  function loop() {
    if (time > maxTime) return;
    time++;
    console.log(time);
    for (let n = 0; n < num; n++) {
      sweeps[n].render();
    }
  }

  setInterval(loop, 1000 / 30);

  return {
    draw,
    print,
    background: "white",
    animate: true,
    clear: true
  };

  function draw() {
    points.forEach(point => {
      const { x, y, color } = point;
      context.strokeStyle = color;
      context.fillRect(x, y, 0.1, 0.1);
    });
  }

  function print() {
    // return polylinesToSVG(lines, {
    //   dimensions
    // });
  }
}

class Sweep {
  constructor(x, y, gage) {
    this.ox = this.x = x;
    this.oy = this.y = y;
    this.ogage = this.gage = gage;
    this.selfInit();
  }

  selfInit() {
    this.myc = "red";
    this.sg = randomFloat(0.01, 0.1);
    this.x = this.ox;
    this.y = this.oy;
    this.gage = this.ogage;
    this.vx = 1.0;
  }

  render() {
    this.x += this.vx;
    if (this.x > height) this.selfInit();

    points.push(tpoint(this.x, this.y, this.myc, 0.07));
    this.sg += randomFloat(-0.042, 0.042);

    if (this.sg < -0.3) {
      this.sg = -0.3;
    } else if (this.sg > 0.3) {
      this.sg = 0.3;
    } else if (this.sg > -0.01 && this.sg < 0.01) {
      if (randomInt(0, 10000) > 9900) {
        //change color myc =
      }
    }

    let wd = 200;
    let w = this.sg / wd;
    for (let i = 0; i < wd; i++) {}
  }
}

function tpoint(x, y, myc, a) {
  let c = tinycolor(myc);

  let { r, g, b, oa } = c.toRgb();
  return { x, y, myc };
}
