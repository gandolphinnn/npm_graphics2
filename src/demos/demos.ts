import { Angle, Circle, CircleSector, CircleSlice, CnvElement, Color, Coord, Line, MainCanvas, Mesh, Poly, Rect, Style, Text } from '../index.js';

const p = MainCanvas.ratioToPixel(10).width;
console.log(p);

MainCanvas.drawSampleMetric(p);
MainCanvas.drawStyle
			.setFillStyle(Color.byValues(0, 0, 255, .4))
			.setStrokeStyle(Color.byValues(0, 0, 0, 1))

const text1		= new Text(MainCanvas.center.sumXY(-100, 0), 'Hello World').setFont('24px Arial').setTextAlign('center');
const text2		= new Text(MainCanvas.center.sumXY(+100, 0), 'Hello World').setFont('bold italic 30px serif').setTextAlign('left');
const texts		= new Mesh(MainCanvas.center, text1, text2)
const line		= new Line(new Coord(50, 50), Coord.origin);
const rect		= new Rect(MainCanvas.center, {width: MainCanvas.cnv.width, height: 100});
const poly		= new Poly(...Coord.regularPoly(MainCanvas.center, 7, 75));
const circle	= new Circle(MainCanvas.center, MainCanvas.cnv.height/2-50);
const sector	= new CircleSector(MainCanvas.center, 50, new Angle(), new Angle(45));
const slice		= new CircleSlice(MainCanvas.center, 50, new Angle(-80), new Angle(50), false);

const demos: CnvElement[] = [ texts, line, rect, poly, circle, sector, slice ];
const index = 0;
demos[index].render(true);
