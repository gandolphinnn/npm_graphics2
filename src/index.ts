import { overflow, clamp, coalesce, Singleton, arrPivot } from '@gandolphinnn/utils';
import { Style, Color } from './style.js';
import Enumerable from 'linq';

export * from './style.js';

//#region Constants, Enums, Types, Interfaces
const IMG_ZINDEX_DEFAULT = 100;
export abstract class Component { //todo WIP
	start() {}
	update() {}
} //? This will be useful later, in rigid2 and game2
export enum RenderAction {
	None, Stroke, Fill, Both
}
/*export enum Ground { //todo not implemented yet, just an idea
	Back = -1, Middle = 0, Fore = 1
}*/
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
	copy() { return new Coord(this.x, this.y) }
	/**
	 * sum x/y to THIS coordinate
	 */
	sumXY(x: number, y: number) {
		this.x += x;
		this.y += y;
		return this;
	}

	//? sum every coordinate
	static sum(...coords: Coord[]) {
		return coords.reduce((acc, curr) => new Coord(acc.x + curr.x, acc.y + curr.y), new Coord(0, 0));
	}
	//? get the center of multiple points
	static center(...coords: Coord[]) {
		return new Coord(this.sum(...coords).x/coords.length, this.sum(...coords).y/coords.length);
	}
	//? x/y difference between multiple points
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
export class Mesh extends Component { //todo WIP
	private _items: CnvElement[];
	private readonly _center: Coord;
	zIndex: number;

	set center(coord: Coord) { this._items.forEach(item => {item.center = coord}) }
	get center() { return this._center; }
	moveBy(x: number, y: number) {
		this.center.sumXY(x, y);
	}
	addItem(element: CnvElement) {
		this._items.push(element);
		this._items = Enumerable.from(this._items).orderBy(elem => elem.zIndex).toArray()
	}
	render() {
		this._items.forEach(item => {
			item.render(false);
		});
	}
}
//#region CanvasElements
export abstract class CnvElement {
	readonly ctx = MainCanvas.get.ctx;
	action: RenderAction;
	customStyle: Style = Style.empty();
	zIndex = 0;

	protected _center: Coord;
	get center() { return this._center }
	set center(center: Coord) { this._center = center }

	constructor(action: RenderAction, center: Coord) {
		this.action = action;
		this._center = center;
	}
	moveBy(x: number, y: number) {
		//? keep it like this to triggere the setter
		this.center = this.center.sumXY(x, y)
		return this;
	}
	setZ(zIndex: number) {
		this.zIndex = zIndex;
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
			POINT_DEFAULT.center = point.copy();
			POINT_DEFAULT.render();
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
		MainCanvas.get.saveApplyExec(this.customStyle, false, () => {
			if (this.action == RenderAction.Both || this.action == RenderAction.Fill) {
				this.ctx.fillText(this.content, this.center.x, this.center.y);
			}
			if (this.action == RenderAction.Both || this.action == RenderAction.Stroke) {
				this.ctx.strokeText(this.content, this.center.x, this.center.y);
			}
			drawPoints? this.drawPoints() : null;
		})
		return this;
	}
}
//#region ISSUE #3
/*export class Img extends CnvElement {
	src: string;
	size: Size;
	img: HTMLImageElement;

	constructor(center: Coord, src: string, size: Size) {
		super(center, RenderAction.Both);
		this.src = src;
		this.size = size;
	}
	render(drawPoints = false) {
		//drawPoints? this.drawPoints() : null;
		return this;
	}
}*/
//#endregion
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
		const diff = Coord.size(this.center, center)
		this._center = center;
		this.points[0].sumXY(diff.width, diff.height)
		this.points[1].sumXY(diff.width, diff.height)
	}
	render(drawPoints = false) {
		MainCanvas.get.saveApplyExec(this.customStyle, true, () => {
			this.ctx.beginPath();
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.ctx.lineTo(this.points[1].x, this.points[1].y);
			this.execAction();
		});
		drawPoints? this.drawPoints(this.points) : null;
		return this;
	}
}
export class Poly extends CnvDrawing {
	points: Coord[];

	get lines() {  //todo keep or remove?
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
		const diff = Coord.size(this.center, center)
		this._center = center;
		this.points.forEach(point => {
			point.sumXY(diff.width, diff.height)
		});
	}
	constructor(...points: Coord[]) {
		super(RenderAction.Both, Coord.center(...points));
		this.points = points;
		console.log(this);
	}
	/**
	 * Return the point with the selected index performing and overflow
	 */
	getPoint(index: number) { return this.points[overflow(index, 0, this.points.length-1)] }

	render(drawPoints = false) {
		MainCanvas.get.saveApplyExec(this.customStyle, true, () => {
			this.ctx.beginPath();
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.points.forEach(point => {
				this.ctx.lineTo(point.x, point.y)
			});
			this.ctx.closePath();
			this.execAction();
		});
		drawPoints? this.drawPoints(this.points) : null;
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
		MainCanvas.get.saveApplyExec(this.customStyle, true, () => {
			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
			this.execAction();
		});
		drawPoints? this.drawPoints() : null;
		return this;
	}
}
//#region ISSUE #6
/**
 * Custom path with user defined execution
 * The center is used just to define a point to move
 */
/*export class Path extends CnvDrawing { 
	execution: Function;

	constructor(center: Coord, execution: Function) {
		super(RenderAction.Both, center);
		this.execution = execution;
	}
	render() {
		this.execution()
		return this;
	}
}
//? Esempio di chiamata a Path
new Path(new Coord(100, 100), (ctx: CanvasRenderingContext2D, center: Coord) => {
	ctx.beginPath();
	ctx.arc(center.x, center.y, 10, 0, 2 * Math.PI);
	ctx.lineTo(center.x + 10, center.y - 25)
	ctx.stroke();
})*/
//#endregion
export class Arc extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	counterClockwise: boolean;
	cutByCenter: boolean;

	get theta() { return new Angle(this.counterClockwise? this.end.degrees - this.start.degrees: this.start.degrees - this.end.degrees) }

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle, end: Angle, counterClockwise = true, cutByCenter = true) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.counterClockwise = counterClockwise;
		this.cutByCenter = cutByCenter;
	}
	render(drawPoints = false) {
		MainCanvas.get.saveApplyExec(this.customStyle, true, () => {
			this.ctx.beginPath();
			this.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.counterClockwise);
			if (this.cutByCenter) {
				this.ctx.lineTo(this.center.x, this.center.y);
			}
			this.ctx.closePath()
			this.execAction();
		});
		drawPoints? this.drawPoints() : null;
		return this;
	}
}
//#endregion

export class MainCanvas extends Singleton {
	static get get() { return this.singletonInstance as MainCanvas }

	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	
	defaultDrawStyle = Style.default();
	defaultWriteStyle = Style.default();

	get center() { return new Coord(this.cnv.width / 2, this.cnv.height / 2) }

	get bgColor() { return Color.byStr(this.cnv.style.backgroundColor) }
	set bgColor(color: Color) { this.cnv.style.backgroundColor = color.rgbaStr }

	private constructor() {
		super();
		const body = document.querySelector('body')!;
		body.innerHTML = '';

		this.cnv = document.createElement('canvas');
		this.cnv.width = window.innerWidth;
		this.cnv.height = window.innerHeight;
		body.style.overflow = 'hidden';
		body.style.margin = '0px';
		body.appendChild(this.cnv);
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
	/*rotate(angle = new Angle(0), rotationCenter = this.center) { //todo ISSUE #4
		this.ctx.translate(rotationCenter.x, rotationCenter.y);
		this.ctx.rotate(angle.radians);
		this.ctx.translate(-rotationCenter.x, -rotationCenter.y);
	}*/
	/**
	 * Apply to the context the default style coalesced with the provided style. Does not change the defautl style
	 */
	applyCustomStyle(writeStyle: Style, drawOnly: boolean) {
		Style.from(this.defaultWriteStyle, writeStyle).ctxApply(drawOnly);
	}
	/**
	 * Save the context, apply the style, execute the callback and restore the context
	 */
	saveApplyExec(style: Style, drawOnly: boolean, renderCallBack: Function) {
		this.ctx.save();
		this.applyCustomStyle(style, drawOnly);
		renderCallBack();
		this.ctx.restore();
	}
	//#endregion

	//#region DrawSamples
	drawSampleUnits(testunit: number = 0) {
		let sampleUnits = [1, 5, 10, 50, 100, 250, 500, 1000];
		if (testunit > 0 && testunit < this.cnv.width && sampleUnits.indexOf(testunit) == -1) {
			sampleUnits.push(testunit);
			sampleUnits.sort(function (a, b) {
				return a - b;
			});
		}
		let coord = new Coord(this.center.x - 500, this.center.y - (20 * sampleUnits.length / 2));
		this.ctx.lineWidth = 4;
		sampleUnits.forEach(unit => {
			this.ctx.strokeStyle = unit == testunit ? 'red' : 'black';
			new Text(coord.sumXY(-30, +3), unit.toString())
			new Line(coord, coord.sumXY(unit, 0)).render(); 
			coord.sumXY(0, 20);
		});
	}
	drawSampleMetric(scale: number = 50) {
		scale = clamp(scale, 25, Infinity);

		const line = new Line(new Coord(0, 0), new Coord(0, this.cnv.height));
		line.customStyle.mergeLineWidth(1);
		const text = new Text(new Coord(0, 10), '');
		text.customStyle.mergeTextAlign('right');
		
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical lines
			line.center = new Coord(x, this.center.y);
			line.render();
			text.center = new Coord(x-3, 10);
			text.content = x.toString();
			text.render();
		}

		line.points = [new Coord(0, 0), new Coord(this.cnv.width, 0)];
		text.customStyle.mergeTextAlign('left');

		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal lines
			line.center = new Coord(this.center.x, y);
			line.center.x =this.center.x
			line.render();
			text.center = new Coord(5, y-5);
			text.content = y.toString();
			text.render();
		}
		new Circle(this.center, 5).render();
	}
	//#endregion
}
const POINT_DEFAULT = new Circle(new Coord(0,0), 3)
POINT_DEFAULT.action = RenderAction.Fill;
console.log(POINT_DEFAULT.customStyle);
console.log(new Style(Color.byName('Black')));
POINT_DEFAULT.customStyle.mergeFillStyle(Color.byName('Black'));
console.log(POINT_DEFAULT.customStyle);
//#endregion