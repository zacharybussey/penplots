import { random } from 'penplot/util/random';
import nj from 'numjs';

export function linspace(a, b, n) {
  if (typeof n === "undefined") n = Math.max(Math.round(b - a) + 1, 1);
  if (n < 2) {
    return n === 1 ? [a] : [];
  }
  var i,
    ret = Array(n);
  n--;
  for (i = n; i >= 0; i--) {
    ret[i] = (i * b + (n - i) * a) / n;
  }
  return ret;
}

export function rndInterpolate(xy, numPoints, ordered = false) {
    let [tck,u] = splprep([
        xy.slice([null,null,0]),
        xy.slice([null,null,1]),
        0
    ]);
    let unew = random(numPoints);
    let out = splev(unew, tck);
    return nj.stack(out, 1); 
}

function splprep()
