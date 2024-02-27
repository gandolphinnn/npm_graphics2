import { Angle, Arc, Circle, Color, Coord, Line, MainCanvas, Poly, Rect, Style, Text } from './index.js';

const c1 = MainCanvas.get;
c1.drawSampleMetric();
c1.drawStyle.mergeWith(new Style(Color.byValues(0, 0, 255, .4), Color.byValues(0, 0, 0, 1), 1));

//demo text1
/* const text1 = new Text(new Coord(90, 50), 'Hello World');
text1.style.mergeFont('24px Arial').mergeTextAlign('center');
text1.render(true); */

//demo text2
/* const text2 = new Text(new Coord(50, 50), 'Hello World');
text2.style.mergeFont('bold italic 30px serif').mergeTextAlign('left');
text2.render(true); */

//demo line
/* new Line(new Coord(25, 25), new Coord(425, 175)).render(true); */

//demo rect
/* new Rect(new Coord(125, 75), {width: 200, height: 100}).render(true); */

//demo poly
/* new Poly(...Coord.regularSpread(new Coord(100, 100), 7, 75)).render(true); */

//demo circle
/* new Circle(new Coord(75, 75), 50).render(true); */

//demo arc1
/* new Arc(new Coord(75, 75), 50, new Angle(), new Angle(45)).render(true); */

//demo arc2
/* new Arc(new Coord(75, 75), 50, new Angle(-80), new Angle(50), false, false).render(true); */