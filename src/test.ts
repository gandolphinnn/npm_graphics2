import { MainCanvas, Coord, Color, Text, Line, Poly, parseRGBA, RGBA, Circle, Arc, Angle, Mesh, RenderAction} from './index.js';
import { test } from '@gandolphinnn/utils';

//test('rgbParse INVALID', parseRGBA(''), null);
//test('rgbParse RGBA', parseRGBA('rgba(4,3,2,0.6)'), {red: 4, green: 3, blue: 2, alpha: 0.6} as RGBA);
//test('rgbParse RGB', parseRGBA('rgb(300,6,5)'), {red: 255, green: 6, blue: 5, alpha: 1} as RGBA);
//test('rgbParse HEX1', parseRGBA('#abc'), {red: 10, green: 11, blue: 12, alpha: 1} as RGBA);
//test('rgbParse HEX2', parseRGBA('#abcdef'), {red: 171, green: 205, blue: 239, alpha: 1} as RGBA);
//test('Color.byName', Color.byName('AliceBlue'), {red: 240, green: 248, blue: 255, alpha: 1} as RGBA);
const c1 = MainCanvas.get;
c1.drawSampleMetric(50);
c1.drawStyle.mergeFillStyle(Color.byName('Grey'));
c1.writeStyle.mergeTextAlign('center').mergeFont('40px arial');

const centerArc	= new Arc(new Coord(274, 200), 75, new Angle(200), new Angle(0), false, true).setZ(0);
const circle	= new Circle(new Coord(227, 200), 75).setZ(1);
const poly		= new Poly(new Coord(200, 400),new Coord(150, 200),new Coord(350, 200),new Coord(300, 400),new Coord(250, 475)).setZ(2);
const line		= new Line(new Coord(150, 200), new Coord(300, 400)).setZ(3);
const arc		= new Arc(new Coord(250, 100), 141.8, new Angle(45), new Angle(135), false, false).setZ(3);
const text		= new Text(new Coord(250, 300), 'TEST').setZ(9);
const mesh = new Mesh(text, line, circle, arc, centerArc, poly);
console.table(mesh.items.toArray());

mesh.render();
mesh.moveBy(200, 500).render()

const moveY = 200;
const moveX = 0;

/* */