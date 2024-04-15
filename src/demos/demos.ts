import { Angle, Circle, CircleSector, CircleSlice, CnvElement, Color, Coord, Line, MainCanvas, Mesh, Poly, Rect, Style, Text } from '../index.js';

MainCanvas.drawSampleMetric();
MainCanvas.drawStyle.mergeWith(new Style(Color.byValues(0, 0, 255, .4), Color.byValues(0, 0, 0, 1), 1));
const lastMetric = new Coord(Math.floor(MainCanvas.cnv.width/50)*50, (Math.floor(MainCanvas.cnv.height/50)-1)*50);

//demo text.1
const text1 = new Text(MainCanvas.center.sumXY(-MainCanvas.cnv.width/6, 0), 'Hello World');
text1.style.mergeFont('24px Arial').mergeTextAlign('center');

//demo text.2
const text2 = new Text(MainCanvas.center.sumXY(MainCanvas.cnv.width/6, 0), 'Hello World');
text2.style.mergeFont('bold italic 30px serif').mergeTextAlign('left');

//demo texts
const texts = new Mesh(
	MainCanvas.center,
	text1,
	text2
)

//demo line
const line = new Line(new Coord(50, 50), lastMetric);

//demo rect
const rect = new Rect(MainCanvas.center, {width: MainCanvas.cnv.width, height: 100});

//demo poly
const poly = new Poly(...Coord.regularSpread(MainCanvas.center, 7, 75));

//demo circle
const circle = new Circle(MainCanvas.center, MainCanvas.cnv.height/2-50);

//demo CircleSector
const circleSector = new CircleSector(MainCanvas.center, 50, new Angle(), new Angle(45));

//demo CircleSlice
const circleSlice = new CircleSlice(MainCanvas.center, 50, new Angle(-80), new Angle(50), false);

const demos: CnvElement[] = [ texts, line, rect, poly, circle, circleSector, circleSlice ];

const index = 4;
demos[index].render(true);
