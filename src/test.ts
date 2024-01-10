import { MainCanvas, Coord, Color, Text, Line, Triangle, Path, parseRGBA, RGBA, Circle } from './index.js';
import { test } from '@gandolphinnn/utils';

test('rgbParse INVALID', parseRGBA(''), null);
test('rgbParse RGBA', parseRGBA('rgba(4,3,2,0.6)'), {red: 4, green: 3, blue: 2, alpha: 0.6} as RGBA);
test('rgbParse RGB', parseRGBA('rgb(300,6,5)'), {red: 255, green: 6, blue: 5, alpha: null} as RGBA);
test('rgbParse HEX1', parseRGBA('#abc'), {red: 10, green: 11, blue: 12, alpha: null} as RGBA);
test('rgbParse HEX2', parseRGBA('#abcdef'), {red: 171, green: 205, blue: 239, alpha: null} as RGBA);

const black = new Color('Black');
const red = new Color('Red');
//{"fillStyle":{"red":0,"green":0,"blue":0,"alpha":1},"font":"20px Arial","lineWidth":2,"strokeStyle":{"red":0,"green":0,"blue":0,"alpha":1},"textAlign":"left"}
//{"red":0,"green":0,"blue":0,"alpha":1},"font":"30px Arial","lineWidth":3,"strokeStyle":{"red":255,"green":0,"blue":0,"alpha":1},"textAlign":"left"}

const c1 = MainCanvas.get;
c1.drawSampleMetric(true, 50);
/*
c1.defaultWriteStyle = {textAlign: 'center', font: '40px arial'};
c1.defaultDrawStyle = {fillStyle: new Color('Red', .8)};
const text		= new Text(new Coord(100, 50), 'TEST').render(true);
const line		= new Line(new Coord(200, 50), new Coord(450, 200)).render(true);
const triangle	= new Triangle(new Coord(400, 50), new Coord(700, 100), new Coord(600, 200)).render(true);
const rect		= new Rect(new Coord(900, 100), {width: 250, height: 150}).render(true);
const circle	= new Circle(new Coord(100, 125), 75).render(true);
const path		= new Path(true, new Coord(50, 50)).render(true);

c1.defaultWriteStyle = {textAlign: 'right', font: '50px Arial'};
c1.defaultDrawStyle = {fillStyle: new Color('Green', .3)};

text.moveBy(50, 250).render(true);
line.moveBy(50, 250).render(true);
triangle.moveBy(50, 250).render(true);
rect.moveBy(50, 250).render(true);
circle.moveBy(50, 250).render(true);
path.moveBy(50, 250).render(true);

new Text(c1.center, 'TEST').setStyle({font: '400px Arial', textAlign: 'center', lineWidth: 1}).render()
/* */