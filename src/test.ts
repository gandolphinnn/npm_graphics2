import { MainCanvas, Coord, Color, Text, Line, Triangle, Rect, Path, parseRGBA, RGBA, Circle, LinearGradient } from './index.js';
import { test } from '@gandolphinnn/utils';
const c1 = MainCanvas.get;

const gr = new LinearGradient(new Coord(0, 0), new Coord(100, 100));
gr.stops[0] = new Color('Red');
gr.stops[.5] = new Color('Green');
gr.stops[1] = new Color('Blue');
gr.build();
c1.drawStyle.fillStyle = gr;

test('rgbParse INVALID', parseRGBA(''), null);
test('rgbParse RGBA', parseRGBA('rgba(4,3,2,0.6)'), {red: 4, green: 3, blue: 2, alpha: 0.6} as RGBA);
test('rgbParse RGB', parseRGBA('rgb(300,6,5)'), {red: 255, green: 6, blue: 5, alpha: null} as RGBA);
test('rgbParse HEX1', parseRGBA('#abc'), {red: 10, green: 11, blue: 12, alpha: null} as RGBA);
test('rgbParse HEX2', parseRGBA('#abcdef'), {red: 171, green: 205, blue: 239, alpha: null} as RGBA);

c1.color = new Color();
c1.drawSampleMetric(true, 50);

c1.writeStyle = {textAlign: 'center', font: '40px arial'};
c1.drawStyle = {fillStyle: new Color('Red', .3)};
const text = new Text(new Coord(100, 50), 'TEST').render(true);
const line = new Line(new Coord(200, 50), new Coord(450, 200)).render(true);
const triangle = new Triangle(new Coord(400, 50), new Coord(700, 100), new Coord(600, 200)).render(true);
const rect = new Rect(new Coord(900, 100), {width: 250, height: 150}).render(true);
const circle = new Circle(new Coord(100, 125), 75).render(true);
const path = new Path(true, new Coord(50, 50));

text.moveBy(50, 250);
line.moveBy(50, 250);
triangle.moveBy(50, 250);
rect.moveBy(50, 250);
circle.moveBy(50, 250);
path.moveBy(50, 250);

c1.writeStyle = {textAlign: 'right', font: '50px Arial'};
c1.drawStyle = {fillStyle: new Color('Green', .3)};

text.render(true);
line.render(true);
triangle.render(true);
rect.render(true);
circle.render(true);
path.render(true);