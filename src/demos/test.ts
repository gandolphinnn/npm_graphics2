import { MainCanvas, Coord, Color, Text, Line, Poly, parseRGBA, RGBA, Circle, Angle, Mesh, RenderAction, CircleSector, CircleSlice } from '../index.js';
import { test } from '@gandolphinnn/utils';

/* test('rgbParse INVALID', parseRGBA(''), null);
test('rgbParse RGBA', parseRGBA('rgba(4,3,2,0.6)'), {red: 4, green: 3, blue: 2, alpha: 0.6} as RGBA);
test('rgbParse RGB', parseRGBA('rgb(300,6,5)'), {red: 255, green: 6, blue: 5, alpha: 1} as RGBA);
test('rgbParse HEX1', parseRGBA('#abc'), {red: 10, green: 11, blue: 12, alpha: 1} as RGBA);
test('rgbParse HEX2', parseRGBA('#abcdef'), {red: 171, green: 205, blue: 239, alpha: 1} as RGBA);
test('Color.byName', Color.byName('AliceBlue'), {red: 240, green: 248, blue: 255, alpha: 1} as RGBA); */
MainCanvas.drawSampleUnits(0, 100, 99, 420);

MainCanvas.drawSampleMetric(50);
MainCanvas.drawStyle.mergeFillStyle(Color.byName('Grey'));
MainCanvas.writeStyle.mergeTextAlign('center').mergeFont('40px arial');


const colors = {
	SpringGreen: Color.byName('SpringGreen'),
	White: Color.byName('White'),
	SaddleBrown: Color.byName('SaddleBrown'),
	Sienna: Color.byName('Sienna')
}

const sector	= new CircleSector(new Coord(274, 200), 75, new Angle(250), new Angle(0), false)
					.setZ(0)
					.setFillStyle(colors.SpringGreen);

const circle	= new Circle(new Coord(227.9, 200), 75)
					.setZ(1)
					.setFillStyle(colors.White);

const poly		= new Poly(new Coord(215, 400),new Coord(150, 200),new Coord(350, 200),new Coord(285, 400),new Coord(250, 450))
					.setZ(2)
					.setFillStyle(colors.Sienna)
					.setStrokeStyle(colors.SaddleBrown)
					.setLineWidth(3);

const line		= new Line(poly.lines[0].center, poly.lines[2].center)
					.setZ(3)
					.setStrokeStyle(colors.SaddleBrown)
					.setLineWidth(3);

const slice		= new CircleSlice(new Coord(250, 100), 141.4, new Angle(45), new Angle(135), false)
					.setZ(3)
					.setStrokeStyle(colors.SaddleBrown)
					.setLineWidth(3)
					.setAction(RenderAction.Stroke);

const text		= new Text(new Coord(250, 300), 'TEST')
					.setZ(4)
					.setAction(RenderAction.None);

const mesh		= new Mesh(new Coord(250, 400), text, line, circle, slice, sector, poly);

console.table(mesh.elements.toArray());

mesh.moveBy(600, -50).render(true)
mesh.moveBy(300, -50).render()
/* */