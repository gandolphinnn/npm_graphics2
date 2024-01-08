import { overflow, clamp, coalesce, Singleton, arrPivot } from '@gandolphinnn/utils';
import { DrawStyle, WriteStyle, Color, getStringIfColor, DRAWSTYLE_DEFAULT, WRITESTYLE_DEFAULT } from './style.js';
import Enumerable from 'linq';

export * from './style.js';

//#region Enums, Types, Interfaces and Constants
export interface Component {} //? This will be useful later, in rigid2 and game2
export enum RenderAction {
	None, Stroke, Fill, Both
}
export enum Rotation {
	Clockwise = 0,
	CounterClockwise = 1
}
/*export enum Ground { //todo not implemented yet, just an idea
	Back = -1, Middle = 0, Fore = 1
}*/
export type Size = {
	width: number;
	height: number;
}
export const IMG_ZINDEX_DEFAULT = 100;
export const DRAWPOINTS_RADIUS = 3;
//#endregion

//#region Classes
export class Coord {
	x: number;
	y: number;
	get copy() { return new Coord(this.x, this.y) }
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
	//? sum every coordinate
	static sum(...coords: Coord[]) {
		return coords.reduce((acc, curr) => new Coord(acc.x + curr.x, acc.y + curr.y), new Coord(0, 0));
	}
	//? sum x/y to a coordinate
	static sumXY(coord1: Coord, x: number, y: number) {
		return new Coord(coord1.x + x, coord1.y + y);
	}
	//? get the center of multiple points
	static center(...coords: Coord[]) {
		return new Coord(this.sum(...coords).x/coords.length, this.sum(...coords).y/coords.length);
	}
	static rotate(rotationCenter: Coord, angle: Angle, ...coords: Coord[]) {

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
export class Mesh implements Component { //todo
	private _items: CnvElement[];
	private readonly _center: Coord;
	zIndex: number;

	set center(coord: Coord) { this._items.forEach(item => {item.center = coord}) }
	get center() { return this._center; }
	moveBy(x: number, y: number) {
		this.center = Coord.sumXY(this.center, x, y);
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
	zIndex = 0;

	protected _center: Coord;
	get center() { return this._center }
	set center(center: Coord) { this._center = center }

	constructor(center: Coord, action: RenderAction) {
		this._center = center;
		this.action = action;
	}
	moveBy(x: number, y: number) {
		this.center = Coord.sumXY(this.center, x, y);
		return this;
	}
	setAction(action: RenderAction) {
		this.action = action;
		return this;
	}
	setZ(zIndex: number) {
		this.zIndex = zIndex;
		return this;
	}

	abstract render(drawPoints: boolean): CnvElement;
	protected drawPoints(points: Coord[] = []) {
		[this.center, ...points].forEach(point => {
			MainCanvas.get.draw({strokeStyle: new Color('Black'), fillStyle: new Color('Black')}, () => {
				new Circle(point, DRAWPOINTS_RADIUS).render();
			});
		});
	}
}
export class Text extends CnvElement {
	content: string;
	private _customStyle: WriteStyle;
	get customStyle() { return this._customStyle }
	set customStyle(customStyle: WriteStyle | null) { this._customStyle = coalesce(customStyle, {} as WriteStyle) }

	constructor(center: Coord, content: string) {
		super(center, RenderAction.Both);
		this.content = content;
		this.customStyle = null;
	}
	setStyle(customStyle: WriteStyle | null) {
		this.customStyle = customStyle;
		return this;
	}
	render(drawPoints = false) {
		MainCanvas.get.write(this.customStyle, () => {
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
		//todo
		//drawPoints? this.drawPoints() : null;
		return this;
	}
}*/
export abstract class CnvDrawing extends CnvElement {
	private _customStyle: DrawStyle;
	get customStyle() { return this._customStyle }
	set customStyle(customStyle: DrawStyle | null) { this._customStyle = coalesce(customStyle, {lineWidth: null, stroke: null, fill: null}) }

	constructor(action: RenderAction, center: Coord) {
		super(center, action);
		this.customStyle = null;
	}
	setStyle(customStyle: DrawStyle | null) {
		this.customStyle = customStyle;
		return this;
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
	get center() { return Coord.center(...this.points)}
	set center(center: Coord) {
		const diff = Coord.size(this.center, center)
		this._center = center;
		this.points[0] = Coord.sumXY(this.points[0], diff.width, diff.height)
		this.points[1] = Coord.sumXY(this.points[1], diff.width, diff.height)
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.customStyle, () => {
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.ctx.lineTo(this.points[1].x, this.points[1].y);
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints(this.points) : null;
		});
		return this;
	}
}
export class Path extends CnvDrawing {
	closed: boolean;
	points: Coord[];

	get nPoints() { return this.points.length}
	get lines() { 
		if(this.nPoints < 2) return [];
		let lines: Line[];
		for (let i = 1; i < this.nPoints; i++) {
			lines.push(new Line(this.points[i-1], this.points[i]));
		}
		if (this.closed) {
			lines.push(new Line(this.points.last(), this.points[0]))
		}
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
			point = Coord.sumXY(point, diff.width, diff.height)
		});
	}
	get conditionedAction() {
		if (this.closed) return this.action;
		if (this.action == RenderAction.Both) return RenderAction.Stroke;
		if (this.action == RenderAction.Fill) return RenderAction.None;
	}
	constructor(closed: boolean, ...points: Coord[]) {
		super(RenderAction.Stroke, Coord.center(...points));
		this.closed = closed;
		this.points = points;
	}
	getPoint(index: number) { return this.points[overflow(index, 0, this.nPoints)] }
	render(drawPoints = false) {
		MainCanvas.get.draw(this.customStyle, () => {
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			for (let i = 1; i < this.nPoints; i++) {
				length += (!this.closed && i == this.nPoints - 1)? 0 : Coord.distance(this.points[i], this.getPoint(i+1))
			}
			if(this.closed) this.ctx.closePath();
			MainCanvas.get.action(this.conditionedAction);
			drawPoints? this.drawPoints(this.points) : null;
		});
		return this;
	}
}
export class Triangle extends CnvDrawing {
	points: [Coord, Coord, Coord];

	get size() { return Coord.size(...this.points) }
	get perimeter() { return Coord.distance(this.points[0], this.points[1]) + Coord.distance(this.points[1], this.points[2]) + Coord.distance(this.points[2], this.points[0]) }
	get area() { return 'Todo, maybe impossible' }

	get center() { return Coord.center(...this.points)}
	set center(center: Coord) {
		const diff = Coord.size(this.center, center)
		this._center = center;
		this.points = [...this.points.map(point => Coord.sumXY(point, diff.width, diff.height))] as [Coord, Coord, Coord];
	}
	constructor(...points: [Coord, Coord, Coord]) {
		super(RenderAction.Both, Coord.center(...points));
		this.points = points;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.customStyle, () => {
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.ctx.lineTo(this.points[1].x, this.points[1].y);
			this.ctx.lineTo(this.points[2].x, this.points[2].y);
			this.ctx.closePath();
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints(this.points) : null;
		});
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
		MainCanvas.get.draw(this.customStyle, () => {
			this.ctx.rect(this.points[0].x, this.points[0].y, this.size.width, this.size.height);
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints(this.points) : null;
		});
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
		MainCanvas.get.draw(this.customStyle, () => {
			this.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints() : null;
		});
		return this;
	}
}
export class Arc extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	rotationDirection: Rotation;
	cutByCenter: boolean;

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle, end: Angle, rotationDirection = Rotation.Clockwise, cutByCenter = true) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.rotationDirection = rotationDirection;
		this.cutByCenter = cutByCenter;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.customStyle, () => {
			this.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, Boolean(this.rotationDirection));
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints() : null;
		});
		return this;
	}
}
//#endregion

export class MainCanvas extends Singleton {
	static get get() { return this.singletonInstance as MainCanvas }

	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	private _defaultDrawStyle: DrawStyle;
	private _defaultWriteStyle: WriteStyle;

	get center() { return new Coord(this.cnv.width / 2, this.cnv.height / 2) }

	get color() { return new Color().setStr(this.cnv.style.backgroundColor)	}
	set color(color: Color) { this.cnv.style.backgroundColor = color.rgbaStr }

	get defaultDrawStyle() { return this._defaultDrawStyle }
	set defaultDrawStyle(defaultDrawStyle: DrawStyle) {
		this._defaultDrawStyle = {
			lineWidth:		coalesce(defaultDrawStyle.lineWidth,	this._defaultDrawStyle.lineWidth),
			strokeStyle:	coalesce(defaultDrawStyle.strokeStyle,	this._defaultDrawStyle.strokeStyle),
			fillStyle:		coalesce(defaultDrawStyle.fillStyle,	this._defaultDrawStyle.fillStyle)
		}
	}
	get defaultWriteStyle() { return this._defaultWriteStyle }
	set defaultWriteStyle(defaultWriteStyle: WriteStyle) {
		this._defaultWriteStyle = {
			font:			coalesce(defaultWriteStyle.font,		this._defaultWriteStyle.font),
			textAlign:		coalesce(defaultWriteStyle.textAlign,	this._defaultWriteStyle.textAlign)
		}
	}

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

		this._defaultDrawStyle = DRAWSTYLE_DEFAULT;
		this._defaultWriteStyle = WRITESTYLE_DEFAULT;
		
		console.log('Main canvas set');
	}

	//#region Screen
	clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	rotate(angle = new Angle(0), rotationCenter = this.center) {
		this.ctx.translate(rotationCenter.x, rotationCenter.y);
		this.ctx.rotate(angle.radians);
		this.ctx.translate(-rotationCenter.x, -rotationCenter.y);
	}
	applyCustomDrawStyle(drawStyle: DrawStyle) {
		this.ctx.lineWidth		= coalesce(drawStyle.lineWidth,		this._defaultDrawStyle.lineWidth),
		this.ctx.strokeStyle	= getStringIfColor(coalesce(drawStyle.strokeStyle,	this._defaultDrawStyle.strokeStyle)),
		this.ctx.fillStyle		= getStringIfColor(coalesce(drawStyle.fillStyle,		this._defaultDrawStyle.fillStyle))
	}
	applyCustomWriteStyle(writeStyle: WriteStyle) {
		this.ctx.font			= coalesce(writeStyle.font,			this._defaultWriteStyle.font),
		this.ctx.textAlign		= coalesce(writeStyle.textAlign,	this._defaultWriteStyle.textAlign)
	}
	draw(drawStyle: DrawStyle, renderCallBack: Function) {
		this.ctx.save();
		this.applyCustomDrawStyle(drawStyle);
		this.ctx.beginPath();
		renderCallBack();
		this.ctx.restore();
	}
	write(writeStyle: WriteStyle, renderCallBack: Function) {
		this.ctx.save();
		this.applyCustomWriteStyle(writeStyle);
		renderCallBack();
		this.ctx.restore();
	}
	action(drawAction: RenderAction) {
		if (drawAction == RenderAction.Both || drawAction == RenderAction.Fill) {
			this.ctx.fill();
		}
		if (drawAction == RenderAction.Both || drawAction == RenderAction.Stroke) {
			this.ctx.stroke();
		}
		if (drawAction == RenderAction.None) {
			this.ctx.closePath();
		}
	}
	//#endregion

	//#region DrawSamples
	drawSampleUnits(clean = false, testunit: number = 0) {
		if(clean) this.clean()
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
			new Text(Coord.sumXY(coord, -30, +3), unit.toString()).setStyle(WRITESTYLE_DEFAULT).setAction(RenderAction.Fill).render()
			new Line(coord, Coord.sumXY(coord, unit, 0)).render(); 
			Coord.sumXY(coord, 0, 20);
		});
	}
	drawSampleMetric(clean = false, scale: number = 50) {
		scale = clamp(scale, 25, Infinity);
		if(clean) this.clean()
		this.ctx.lineWidth = 1;
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical lines
			new Line(new Coord(x, 0), new Coord(x, this.cnv.height)).render();
			new Text(new Coord(x-5, 10), x.toString()).setStyle(WRITESTYLE_DEFAULT).setStyle({textAlign: 'right'}).setAction(RenderAction.Fill).render();
		}
		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal lines
			new Line(new Coord(0, y), new Coord(this.cnv.width, y)).render();
			new Text(new Coord(5, y-5), y.toString()).setStyle(WRITESTYLE_DEFAULT).setStyle({textAlign: 'left'}).setAction(RenderAction.Fill).render();
		}
		new Circle(this.center, 5).render();
	}
	//#endregion
}
//#endregion