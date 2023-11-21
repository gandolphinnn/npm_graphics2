import * as g from './index.js';
import { } from '@gandolphinnn/utils';

const img = document.createElement("img");
img.src = ''
let c1 = new g.Canvas(g.CanvasMode.FullScreen);
c1.cnv.style.zIndex = '0';
c1.cnv.style.backgroundColor = new g.Color(g.BaseColor.Grey).hex;
c1.rotate(new g.Angle(45), c1.center)
c1.rotate(new g.Angle(-45))
console.log(c1);
c1.ctx.reset();

c1.drawSampleMetric(true)
const i = new g.Img(c1, c1.center, 'red.png', {width: 300, height: 300});
i.render()

//setInterval(() => {i.render()}, 1000)
/*
let c2 = new g.Canvas(g.CanvasMode.Window, {height: 100, width: 150}, 25, 25);
c2.cnv.style.zIndex = '2';
c2.cnv.style.backgroundColor = new g.Color(g.BaseColor.Aqua).hex;
c2.drawSampleMetric()
*/

const l = new g.Line(c1, new g.Coord(0, 0), new g.Coord(200, 200))
l.render();
l.point[0] = new g.Coord(500, 158);
l.render();
// l.canvas = c2;
// l.render();