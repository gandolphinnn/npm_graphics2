import { MainCanvas, Coord, Color, DrawStyle, Text, Arc, Line, Triangle, Rect, Path, rgbaParse, RGB } from './index.js';
import { test } from '@gandolphinnn/utils';

test('rgbParse1', rgbaParse(''), null)
test('rgbParse2', rgbaParse('rgba(4,3,2,1)'), {rgb: {red: 4, green: 3, blue: 2} as RGB, a: 1})
test('rgbParse3', rgbaParse('rgb(7,6,5)'), {rgb: {red: 7, green: 6, blue: 5} as RGB, a: 1})

const c1 = MainCanvas.get;
c1.color = new Color('Grey');
c1.drawSampleMetric(true, 50);

c1.textStyle = {textAlign: 'center', font: '25px arial', color: new Color('Black')}
c1.drawStyle = {fillStyle: new Color('Red', .3).rgba} as DrawStyle
const text = new Text(new Coord(50, 50), 'TEST').render(true);
const line = new Line(new Coord(200, 50), new Coord(450, 200)).render(true);
const triangle = new Triangle(new Coord(400, 50), new Coord(700, 100), new Coord(600, 200)).render(true);
const rect = new Rect(new Coord(900, 100), {width: 250, height: 150}).render(true);
const arc = new Arc(new Coord(100, 125), 75).render(true);
const path = new Path(true, new Coord(50, 50))

text.moveBy(50, 250);
line.moveBy(50, 250);
triangle.moveBy(50, 250);
rect.moveBy(50, 250);
arc.moveBy(50, 250);
path.moveBy(50, 250);

c1.textStyle = {textAlign: 'right', font: '30px Arial'};
c1.drawStyle = {fillStyle: new Color('Green', .3).rgba} as DrawStyle

text.render(true)
line.render(true)
triangle.render(true)
rect.render(true)
arc.render(true)
path.render(true)