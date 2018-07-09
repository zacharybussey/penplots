import nj from "numjs";
import { rndInterpolate } from "./util";
import {random} from 'penplot/util/random';

export default function*(guide, path, inum, scale) {
    const twoPi = Math.PI * 2;
    const hPi = Math.PI * 0.5;

    let pnum = path.length;
    let interpolatedPath = rndInterpolate(path, inum, true);
    let noise = nj.zeros(pnum);
    let i = 0;

    while(true){
        let g = guide.next();
        let p = pnum;
        let r = 1-2*random(pnum);
        noise.slice([null]) += r * scale;

        let a = random(pnum) * twoPi;
        let rnd = nj.stack([nj.cos(a), nj.sin(a)], 1);

        path += rnd * nj.reshape(noise, pnum);
        interpolatedPath = rndInterpolate(path, inum, true);
        i += 1;
        yield g + interpolatedPath;
    }
}
