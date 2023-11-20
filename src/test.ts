import * as g from './index.js';


let c1 = new g.Canvas(g.CanvasMode.FullScreen);
c1.cnv.style.zIndex = '0'
let c2 = new g.Canvas(g.CanvasMode.Window, {height: 100, width: 150}, 25, 25);
c2.cnv.style.zIndex = '2'
//c1.rotate(new Angle(45))
c1.drawSampleMetric()
c2.drawSampleMetric()
const l = new g.Line(c1, new g.Coord(0, 0), new g.Coord(200, 200))
l.render();
l.canvas = c2;
l.render();


console.log(g);


c1.cnv.style.backgroundColor = new g.Color(g.BaseColor.Grey).hex;
c2.cnv.style.backgroundColor = new g.Color(g.BaseColor.DarkGreen).hex;