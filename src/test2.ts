import { Coord, Line, MainCanvas } from './index.js';

const c1 = MainCanvas.get;
c1.drawSampleMetric();

const line = new Line(new Coord(25, 25), new Coord(425, 175)).render(true);