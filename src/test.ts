import { MainCanvas, Coord, BaseColor, Color, DrawStyle, Text, Arc, RenderAction, Line, Triangle, Rect, Path, coordValuesSum, Angle } from './index.js';
import { } from '@gandolphinnn/utils';

const c1 = MainCanvas.get;
c1.color = new Color(BaseColor.Grey);
c1.textStyle = {textAlign: 'center', font: '25px arial'}
c1.drawStyle = {fillStyle: new Color(BaseColor.Red, null, .3).rgba} as DrawStyle
c1.drawSampleMetric(true, 50);


const arc = new Arc(new Coord(100, 125), 75).render(true);
const text = new Text(new Coord(300, 50), 'TEST').render(true);
const line = new Line(new Coord(200, 50), new Coord(450, 200)).render(true);
const triangle = new Triangle(new Coord(400, 50), new Coord(700, 100), new Coord(600, 200)).render(true);
const rect = new Rect(new Coord(900, 100), {width: 250, height: 150}).render(true);
const path = new Path(true, new Coord(50, 50))

arc.moveBy(50, 250);
text.moveBy(50, 250);
line.moveBy(50, 250);
triangle.moveBy(50, 250);
rect.moveBy(50, 250);
path.moveBy(50, 250);

c1.textStyle = {textAlign: 'right', font: '30px Arial'};
c1.drawStyle = {fillStyle: new Color(BaseColor.Green, null, .3).rgba} as DrawStyle

arc.render(true)
text.render(true)
line.render(true)
triangle.render(true)
rect.render(true)
path.render(true)