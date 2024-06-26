import { overflow, clamp, Singleton, arrPivot, isNull } from '@gandolphinnn/utils';
import { Style, Color, ColorName, COLORNAME_RGBA } from './style.js';
import Enumerable from 'linq';

export * from './style.js';

//#region Interfaces, Enums, Types
export interface Component { //? This will be useful later, in rigid2 and game2
	start(): void;
	update(): void;
}
export enum RenderAction {
	None, Stroke, Fill, Both
}
export type Size = {
	width: number;
	height: number;
}
//#endregion

//#region Classes
export class Coord {
	x: number;
	y: number;
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	/**
	 * return a new Coord with the same x and y
	 */
	copy() { return new Coord(this.x, this.y) }
	/**
	 * sum x/y to THIS coordinate
	 */
	sumXY(x: number, y: number) {
		this.x += x;
		this.y += y;
		return this;
	}

	static get default() {
		return new Coord(0, 0);
	}
	//? sum x/y to a coordinate
	static sumXY(coord: Coord, x: number, y: number) {
		return new Coord(coord.x + x, coord.y + y)
	}
	//? sum every coordinate
	static sum(...coords: Coord[]) {
		return coords.reduce((acc, curr) => new Coord(acc.x + curr.x, acc.y + curr.y), Coord.default);
	}
	//? get the center of multiple points
	static center(...coords: Coord[]) {
		return new Coord(this.sum(...coords).x/coords.length, this.sum(...coords).y/coords.length);
	}
	//? x/y difference between 2 points. Order matters
	static difference(coord1: Coord, coord2: Coord) {
		return {x: coord1.x - coord2.x, y: coord1.y - coord2.y};
	}
	//? width/height size of an area defined by multiple points
	static size(...coords: Coord[]) {
		const pivoted = arrPivot(coords);	
		const cMax = new Coord(Math.max(...pivoted.x), Math.max(...pivoted.y));
		const cMin = new Coord(Math.min(...pivoted.x), Math.min(...pivoted.y));
		return {width: Math.abs(cMax.x - cMin.x), height: Math.abs(cMax.y - cMin.y)} as Size;
	}
	//? diagonal distance between 2 points
	static distance(coord1: Coord, coord2: Coord) {
		return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
	}
	//? rotate some coordinates around a center by an angle
	static rotate(center: Coord, angle: Angle, ...coords: Coord[]) {
		return coords.map(coord => {
			const x = center.x + (coord.x - center.x) * angle.cos - (coord.y - center.y) * angle.sin;
			const y = center.y + (coord.x - center.x) * angle.sin + (coord.y - center.y) * angle.cos;
			return new Coord(x, y);
		});
	}
	//? generate the coordinates of the points of a regular polygon
	static regularSpread(center: Coord, numberOfCoord: number, distance: number) {
		const angle = 2 * Math.PI / numberOfCoord;
		return Enumerable.range(0, numberOfCoord).select(i => new Coord(Math.cos(i * angle) * distance + center.x, Math.sin(i * angle) * distance + center.y)).toArray();
	}
	static encircle(...points: Coord[]) {
		let maxDist = -1;
		let center: Coord;
		for (let i = 0; i < points.length; i++) {
			const p1 = points[i];
			const p2 = points[overflow(i + 1, 0, points.length)];
			const distance = this.distance(p1, p2);
			if (distance > maxDist) {
				maxDist = distance;
				center = this.center(p1, p2);
			}
		}
		return new Circle(center, maxDist / 2);
	}
	static starPoints(center: Coord, radius: number, points: number, innerRadius: number) {
		const angle = Math.PI / points;
		const coords = [];
		for (let i = 0; i < 2 * points; i++) {
			const r = i % 2 == 0 ? radius : innerRadius;
			coords.push(new Coord(center.x + r * Math.cos(i * angle), center.y + r * Math.sin(i * angle)));
		}
		return coords;
	}
};
/**
 * Angle starts from a line going horizontally right from the center, and proceeds clockwise.
 */
export class Angle {
	private _degrees: number;
	private _radians: number;
	get degrees() { return this._degrees; }
	get radians() { return this._radians; }
	set degrees(alpha: number) {
		this._degrees = alpha;
		this.normalize()
	}
	set radians(alpha: number) {
		this._radians = alpha;
		this._degrees = this._radians * 180 / Math.PI; //? First i must convert to degrees
		this.normalize()
	}
	constructor(alpha: number = 0, type: 'Degree' | 'Radian' = 'Degree') {
		if (type == 'Degree')
			this.degrees = alpha;
		else
			this.radians = alpha;
	}
	private normalize() {
		this._degrees = overflow(this._degrees, 0, 359) //? Set degr to a 0 -> 360 range
		this._radians = this._degrees * Math.PI / 180; //? Convert to radians
	}
	//#region Trigonometric functions
	get sin() { return Math.sin(this._radians); }
	get cos() { return Math.cos(this._radians); }
	get tan() { return Math.tan(this._radians); }
	get asin() { return Math.asin(this._radians); }
	get acos() { return Math.acos(this._radians); }
	get atan() { return Math.atan(this._radians); }
	get sinh() { return Math.sinh(this._radians); }
	get cosh() { return Math.cosh(this._radians); }
	get tanh() { return Math.tanh(this._radians); }
	get asinh() { return Math.asinh(this._radians); }
	get acosh() { return Math.acosh(this._radians); }
	get atanh() { return Math.atanh(this._radians); }
	//#endregion
}
/**
 * A collection of CnvElements
 */
export class Mesh {
	_center: Coord;
	items: Enumerable.IEnumerable<CnvElement>;
	zIndex: number;
	visible: boolean = true;
	
	get center() {
		return this._center;
	}
	set center(center: Coord) {
		const diff = Coord.difference(center, this.center);
		this.moveBy(diff.x, diff.y);
	}
	constructor(center: Coord, ...items: CnvElement[]) {
		this._center = center;
		this.items = Enumerable.from(items);
	}
	moveBy(x: number, y: number) {
		//? keep it like this to trigger the setter
		this.center.sumXY(x, y);
		this.items.forEach(item => {
			item.moveBy(x, y);
		});
		return this;
	}
	render(drawPoints = false) {
		if (this.visible) {
			this.items.orderBy(elem => elem.zIndex).forEach(item => {
				item.render(drawPoints);
			});
		}
		if(drawPoints) MainCanvas.get.drawPoint(this.center);
	}
}
//#region CanvasElements
export abstract class CnvElement {
	readonly ctx = MainCanvas.get.ctx;
	action: RenderAction;
	style: Style = Style.empty();
	zIndex = 0;

	protected _center: Coord;
	get center() { return this._center }
	set center(center: Coord) { this._center = center }

	constructor(action: RenderAction, center: Coord) {
		this.action = action;
		this._center = center;
	}
	moveBy(x: number, y: number) {
		//? keep it like this to trigger the setter
		this.center = this.center.sumXY(x, y)
		return this;
	}
	setZ(zIndex: number) {
		this.zIndex = zIndex;
		return this;
	}
	setAction(action: RenderAction) {
		this.action = action;
		return this;
	}
	
	abstract render(drawPoints: boolean): CnvElement;
	protected execAction() {
		if (this.action == RenderAction.Both || this.action == RenderAction.Fill) {
			this.ctx.fill();
		}
		if (this.action == RenderAction.Both || this.action == RenderAction.Stroke) {
			this.ctx.stroke();
		}
		this.ctx.closePath();
	}
	protected drawPoints(points: Coord[] = []) {
		[this.center, ...points].forEach(point => {
			MainCanvas.get.drawPoint(point);
		});
	}
}
export class Text extends CnvElement {
	content: string;

	constructor(center: Coord, content: string) {
		super(RenderAction.Fill, center);
		this.content = content;
	}
	render(drawPoints = false) {
		MainCanvas.get.write(this.style, () => {
			if (this.action == RenderAction.Both || this.action == RenderAction.Fill) {
				this.ctx.fillText(this.content, this.center.x, this.center.y);
			}
			if (this.action == RenderAction.Both || this.action == RenderAction.Stroke) {
				this.ctx.strokeText(this.content, this.center.x, this.center.y);
			}
		})
		if(drawPoints) this.drawPoints();
		return this;
	}
}
export abstract class CnvDrawing extends CnvElement {
	constructor(action: RenderAction, center: Coord) {
		super(action, center);
	}
}
export class Line extends CnvDrawing {
	points: [Coord, Coord];

	constructor(...points: [Coord, Coord]) {
		super(RenderAction.Stroke, Coord.center(...points));
		this.points = points;
	}
	get length() {
		return Coord.distance(this.points[0], this.points[1]);
	}
	/**
	 * return a NEW COORD based on the 2 points
	 */
	get center() { return Coord.center(...this.points)}
	set center(center: Coord) {
		const diff = Coord.difference(center, this.center)
		this._center = center;
		this.points[0].sumXY(diff.x, diff.y)
		this.points[1].sumXY(diff.x, diff.y)
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.beginPath();
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.ctx.lineTo(this.points[1].x, this.points[1].y);
			this.execAction();
		});
		if(drawPoints) this.drawPoints(this.points);
		return this;
	}
}
export class Rect extends CnvDrawing {
	size: Size;

	get points() {
		const deltaX = this.size.width/2;
		const deltaY = this.size.height/2;
		return [
			Coord.sumXY(this.center, -deltaX, -deltaY),
			Coord.sumXY(this.center, deltaX, -deltaY),
			Coord.sumXY(this.center, deltaX, deltaY),
			Coord.sumXY(this.center, -deltaX, deltaY),
		];
	}
	get perimeter() { return (this.size.height + this.size.width) * 2 }
	get area() { return this.size.height * this.size.width }

	constructor(center: Coord, size: Size) {
		super(RenderAction.Both, center);
		this.size = size;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.beginPath();
			this.ctx.rect(this.points[0].x, this.points[0].y, this.size.width, this.size.height);
			this.execAction();
		});
		drawPoints? this.drawPoints(this.points) : null;
		return this;
	}
}
export class Poly extends CnvDrawing {
	points: Coord[];

	get lines() {
		let lines: Line[] = [];
		if(this.points.length < 2) return lines;
		for (let i = 1; i < this.points.length; i++) {
			lines.push(new Line(this.points[i-1], this.points[i]));
		}
		lines.push(new Line(this.points.last(), this.points[0]))
		return lines;
	}
	get size() { return Coord.size(...this.points) }
	get length() {
		let length = 0;
		this.lines.forEach(line => {
			length += line.length;
		});
		return length;
	}
	get center() { return Coord.center(...this.points)}
	set center(center: Coord) {
		const diff = Coord.difference(center, this.center)
		this._center = center;
		this.points.forEach(point => {
			point.sumXY(diff.x, diff.y)
		});
	}
	constructor(...points: Coord[]) {
		super(RenderAction.Both, Coord.center(...points));
		this.points = points;
	}
	/**
	 * Return the point with the selected index performing and overflow
	 */
	getPoint(index: number) { return this.points[overflow(index, 0, this.points.length-1)] }

	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.beginPath();
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.points.forEach(point => {
				this.ctx.lineTo(point.x, point.y)
			});
			this.ctx.closePath();
			this.execAction();
		});
		if(drawPoints) this.drawPoints(this.points);
		return this;
	}
}
export class Circle extends CnvDrawing {
	radius: number;

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number) {
		super(RenderAction.Both, center);
		this.radius = radius;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
			this.execAction();
		});
		if(drawPoints) this.drawPoints();
		return this;
	}
}
//TODO extends Circle
export class CircleSector extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	counterClockwise: boolean;

	get theta() { return new Angle(this.counterClockwise? this.end.degrees - this.start.degrees: this.start.degrees - this.end.degrees) }

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle, end: Angle, counterClockwise = true) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.counterClockwise = counterClockwise;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.counterClockwise);
			this.ctx.lineTo(this.center.x, this.center.y);
			this.ctx.closePath()
			this.execAction();
		});
		if(drawPoints) this.drawPoints();
		return this;
	}
}
export class CircleSlice extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	counterClockwise: boolean;

	get theta() { return new Angle(this.counterClockwise? this.end.degrees - this.start.degrees: this.start.degrees - this.end.degrees) }

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle, end: Angle, counterClockwise = true) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.counterClockwise = counterClockwise;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.counterClockwise);
			this.ctx.closePath()
			this.execAction();
		});
		if(drawPoints) this.drawPoints();
		return this;
	}
}
//#endregion

export class MainCanvas extends Singleton {
	static get get() { return this.singletonInstance as MainCanvas }

	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	
	drawStyle = Style.default();
	writeStyle = Style.default();

	get center() { return new Coord(this.cnv.width / 2, this.cnv.height / 2) }

	get bgColor() { return Color.byStr(this.cnv.style.backgroundColor) }
	set bgColor(color: Color) { this.cnv.style.backgroundColor = color.rgbaStr }

	private constructor() {
		super();
		const body = document.querySelector('body')!;
		this.cnv = body.querySelectorAll('canvas')[0];

		if (isNull(this.cnv)) {
			body.innerHTML = '';
			this.cnv = document.createElement('canvas');
			this.cnv.width = window.innerWidth;
			this.cnv.height = window.innerHeight;
			body.style.overflow = 'hidden';
			body.style.margin = '0px';
			body.appendChild(this.cnv);
		}
		
		this.ctx = this.cnv.getContext('2d')!;
		console.log('Main canvas set');
	}

	//#region Screen
	/**
	 * Clear the entire canvas
	 */
	clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	/**
	 * Save the context, apply the style, execute the callback and restore the context
	 */
	draw(drawStyle: Style, renderCallBack: Function) {
		this.ctx.save();		
		const toApply = Style.from(this.drawStyle, drawStyle);
		this.ctx.fillStyle = toApply.fillStyleVal;
		this.ctx.strokeStyle = toApply.strokeStyleVal;
		this.ctx.lineWidth = toApply.lineWidth;
		renderCallBack();
		this.ctx.restore();
	}
	write(writeStyle: Style, renderCallBack: Function) {
		this.ctx.save();		
		const toApply = Style.from(this.writeStyle, writeStyle);
		this.ctx.fillStyle = toApply.fillStyleVal;
		this.ctx.strokeStyle = toApply.strokeStyleVal;
		this.ctx.lineWidth = toApply.lineWidth;
		this.ctx.textAlign = toApply.textAlign;
		this.ctx.font = toApply.font;
		renderCallBack();
		this.ctx.restore();
	}
	//#endregion

	//#region Draw
	drawPoint(point: Coord) {
		POINT_DEFAULT.center = point.copy();
		POINT_DEFAULT.render();
	}
	drawSampleColors() {
		const scale = 100;
		const whiteTextThreshold = 250;
		const colors = Object.keys(COLORNAME_RGBA);
		const maxY = Math.floor(this.cnv.width / scale);
		let x: number, y: number;
		const rect = new Rect(Coord.default, {height:scale, width: scale});
		const text = new Text(Coord.default, 'asd');
		text.style.mergeFont('10px Arial');
		for (let i = 0; i < colors.length; i++) {
			y = Math.floor(i/maxY);
			x = i % maxY;
			const color = Color.byName(colors[i] as ColorName);
			rect.center = new Coord(x*scale+scale/2, y*scale+scale/2);
			rect.style.mergeFillStyle(color);
			rect.render();
			text.center = new Coord(x*scale+scale/2, y*scale+scale/2);
			text.style.mergeFillStyle(color.red + color.green + color.blue < whiteTextThreshold? Color.byName('White') : Color.byName('Black'))	;
			text.content = colors[i];
			text.render();
		}
	}
	drawSampleUnits(...testUnits: number[]) {		
		let sampleUnits = [...new Set([1, 5, 10, 50, 100, 250, 500, 1000, ...testUnits])]
							.filter(v => v > 0)
							.sort((a, b) => a-b);
		let coord = new Coord(this.center.x - 500, this.center.y - (30 * sampleUnits.length / 2));

		const line = new Line(Coord.default, Coord.default);
		line.style.mergeLineWidth(4);
		const text = new Text(coord, '');
		text.style.mergeFont('20px Arial').mergeTextAlign('right');
		sampleUnits.forEach(unit => {
			testUnits.indexOf(unit) != -1 ? line.style.mergeStrokeStyle(Color.byName('Red')) : line.style.mergeStrokeStyle(Color.byName('Black'));
			line.points[0] = Coord.sumXY(coord, 10, 0);
			line.points[1] = Coord.sumXY(coord, unit + 10, 0);
			text.content = unit.toString();
			line.render()
			text.render(); 
			coord.sumXY(0, 30);
		});
	}
	drawSampleMetric(scale = 50) {
		scale = clamp(scale, 25, Infinity);

		const line = new Line(Coord.default, new Coord(0, this.cnv.height));
		line.style.mergeLineWidth(1).mergeStrokeStyle(Color.byName('Black', .3));
		const text = new Text(new Coord(0, 10), '');
		text.style.mergeTextAlign('right').mergeFillStyle(Color.byName('Black', .5));
		
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical lines
			line.center = new Coord(x, this.center.y);
			line.render();
			text.center = new Coord(x-3, 10);
			text.content = x.toString();
			text.render();
		}

		line.points = [Coord.default, new Coord(this.cnv.width, 0)];
		text.style.mergeTextAlign('left');

		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal lines
			line.center = new Coord(this.center.x, y);
			line.center.x = this.center.x;
			line.render();
			text.center = new Coord(5, y-5);
			text.content = y.toString();
			text.render();
		}
		//new Circle(this.center, 5).render();
	}
	drawTriangle(center: Coord, size: number, angle: Angle) {
		let points = Coord.regularSpread(center, 3, size);
		points = Coord.rotate(center, angle, ...points);
		new Poly(...points).render();
	}
	//#endregion
}
//#endregion

//#region Constants
const POINT_DEFAULT = new Circle(Coord.default, 3).setAction(RenderAction.Fill);
	POINT_DEFAULT.style.mergeFillStyle(Color.byName('Black'));
//#endregion