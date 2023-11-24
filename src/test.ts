import * as g from './index.js';
import { } from '@gandolphinnn/utils';

const c1 = g.MainCanvas.get;
c1.color = new g.Color(g.BaseColor.Grey);
c1.drawSampleMetric(true, 50)

const style = {fillStyle: new g.Color(g.BaseColor.Red, null, .3)} as g.DrawStyle

new g.Text(new g.Coord(100, 100), 'TEST', {textAlign: 'right', font: '25px arial'}).render(true);
new g.Arc(g.RenderAction.Both, new g.Coord(100, 200), 75, style).render(true);
new g.Line(new g.Coord(200, 50), new g.Coord(450, 200)).render(true);
new g.Triangle(g.RenderAction.Both, [new g.Coord(150, 600), new g.Coord(300, 350), new g.Coord(600, 500)], style).render(true)
new g.Rect(g.RenderAction.Both, new g.Coord(900,300), {width: 250, height: 150}, style).render(true)
/*const i = new g.Img(c1.center, 'red.png', {width: 300, height: 300});
i.render()*/

//setInterval(() => {i.render()}, 1000)
/*
let c2 = new g.Canvas(g.CanvasMode.Window, {height: 100, width: 150}, 25, 25);
c2.cnv.style.zIndex = '2';
c2.cnv.style.backgroundColor = new g.Color(g.BaseColor.Aqua).hex;
c2.drawSampleMetric()


const l = new g.Line(new g.Coord(0, 0), new g.Coord(200, 200))
l.render();
l.point[0] = new g.Coord(500, 158);
l.render();
// l.canvas = c2;
// l.render();*/
