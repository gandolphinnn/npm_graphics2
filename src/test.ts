import { MainCanvas, Coord, BaseColor, Color, DrawStyle, Text, Arc, RenderAction, Line, Triangle, Rect, coordValuesSum, Angle } from './index.js';
import { } from '@gandolphinnn/utils';

const c1 = MainCanvas.get;
c1.color = new Color(BaseColor.Grey);
c1.drawSampleMetric(true, 50);

const style1 = {fillStyle: new Color(BaseColor.Red, null, .3).rgba} as DrawStyle
const style2 = {fillStyle: new Color(BaseColor.Green, null, .3).rgba} as DrawStyle

const a = new Arc(RenderAction.Both, new Coord(100, 125), 75, style1).render(true);
const te = new Text(new Coord(300, 50), 'TEST', {textAlign: 'center', font: '25px arial'}).render(true);
const l = new Line(new Coord(200, 50), new Coord(450, 200)).render(true);
const tr = new Triangle(RenderAction.Both, [new Coord(400, 50), new Coord(700, 100), new Coord(600, 200)], style1).render(true);
const r = new Rect(RenderAction.Both, new Coord(900, 100), {width: 250, height: 150}, style1).render(true);
a.center = coordValuesSum(a.center, 50, 250);
te.center = coordValuesSum(te.center, 50, 250);
l.center = coordValuesSum(l.center, 50, 250);
tr.center = coordValuesSum(tr.center, 50, 250);
r.center = coordValuesSum(r.center, 50, 250);
a.style = style2;
te.style = {textAlign: 'right', font: '30px Arial'};
l.style = style2;
tr.style = style2;
r.style = style2;
a.render(true)
te.render(true)
l.render(true)
tr.render(true)
r.render(true)