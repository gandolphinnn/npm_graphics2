import { MainCanvas, Coord, Color, Text, Line, Poly, parseRGBA, RGBA, Circle, Arc, Angle} from './index.js';
import { test } from '@gandolphinnn/utils';

//test('rgbParse INVALID', parseRGBA(''), null);
//test('rgbParse RGBA', parseRGBA('rgba(4,3,2,0.6)'), {red: 4, green: 3, blue: 2, alpha: 0.6} as RGBA);
//test('rgbParse RGB', parseRGBA('rgb(300,6,5)'), {red: 255, green: 6, blue: 5, alpha: 1} as RGBA);
//test('rgbParse HEX1', parseRGBA('#abc'), {red: 10, green: 11, blue: 12, alpha: 1} as RGBA);
//test('rgbParse HEX2', parseRGBA('#abcdef'), {red: 171, green: 205, blue: 239, alpha: 1} as RGBA);
//test('Color.byName', Color.byName('AliceBlue'), {red: 240, green: 248, blue: 255, alpha: 1} as RGBA);

const c1 = MainCanvas.get;
//c1.drawSampleMetric(50);

c1.defaultWriteStyle.mergeTextAlign('center').mergeFont('40px arial');
c1.defaultDrawStyle.mergeFillStyle(Color.byName('Red', .9));

const sx = 150;
const text		= new Text(new Coord(sx*1-50, 100), 'TEST').render(true);
const line		= new Line(new Coord(sx*2-100, 50), new Coord(sx*2+50, 150)).render(true);
const circle	= new Circle(new Coord(sx*3, 100), 75).render(true);
const arc		= new Arc(new Coord(sx*4,100), 75, new Angle(10), new Angle(135), false, false).render(true);
const centerArc	= new Arc(new Coord(sx*5,100), 75, new Angle(10), new Angle(135), false, true).render(true);
const poly		= new Poly(new Coord(sx*6, 100), new Coord(sx*6-50,150), new Coord(sx*6+25,125)).render(true)

c1.defaultWriteStyle.mergeTextAlign('right').mergeFont('50px Calibri');
c1.defaultDrawStyle.mergeFillStyle(Color.byName('Green', .5));

const moveY = 200;
const moveX = 0;

text.moveBy(moveX, moveY).render(true);
line.moveBy(moveX, moveY).render(true);
arc.moveBy(moveX, moveY).render(true);
centerArc.moveBy(moveX, moveY).render(true);
circle.moveBy(moveX, moveY).render(true);
poly.moveBy(moveX, moveY).render(true);
/* */