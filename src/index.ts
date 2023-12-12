import { StaticList, overflow, clamp, coalesce, Singleton, arrPivot, arrLast } from '@gandolphinnn/utils';
import { ColorName, DrawStyle, Font, WriteStyle, BASECOLOR_RGB, RGBA_PATTERN, RGB, Color, rgbaParse, decToHex, hexToDec } from './style.js';
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
	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}
};
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
		this._degrees = overflow(this._degrees, 0, 360) //? Set degr to a 0 -> 360 range
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
export class Mesh implements Component { //todo
	private _items: StaticList<CnvElement>;
	private readonly _center: Coord;
	zIndex: number;

	set center(coord: Coord) { this._items.data.forEach(item => {item.center = coord}) }
	get center() { return this._center; }
	moveBy(x: number, y: number) {
		this.center = COORDS.ValuesSum(this.center, x, y);
	}
	render() {
		this._items.data.forEach(item => {
			item.render(false);
		});
	}
}
export abstract class CnvElement {
	ctx = MainCanvas.get.ctx;
	zIndex = 0;

	protected _center: Coord;
	get center() { return this._center }
	set center(center: Coord) { this._center = center }

	constructor(center: Coord) {
		this._center = center;
	}
	moveBy(x: number, y: number) {
		this.center = COORDS.ValuesSum(this.center, x, y);
		return this;
	}
	setZ(zIndex: number) {
		this.zIndex = zIndex;
		return this;
	}
	abstract render(drawPoints: boolean): CnvElement;

	protected drawPoints(points: Coord[] = []) {
		[this.center, ...points].forEach(point => {
			MainCanvas.get.draw({strokeStyle: new Color('Black').rgbaStr, fillStyle: new Color('Black').rgbaStr}, () => {
				new Arc(point, DRAWPOINTS_RADIUS).render();
			});
		});
	}
}
export class Text extends CnvElement {
	content: string;
	private _style: WriteStyle;
	get style() { return this._style }
	set style(style: WriteStyle | null) { this._style = coalesce(style, {} as WriteStyle) }

	constructor(center: Coord, content: string, style?: WriteStyle) {
		super(center);
		this.content = content;
		this.style = style;
	}
	setStyle(style: WriteStyle | null) {
		this.style = style;
		return this;
	}
	render(drawPoints = false) {
		this.ctx.save();
		this.ctx.textAlign = coalesce(this.style.textAlign, this.ctx.textAlign);
		this.ctx.font = coalesce(this.style.font, this.ctx.font);
		this.ctx.fillText(this.content, this.center.x, this.center.y);
		drawPoints? this.drawPoints() : null;
		this.ctx.restore();
		return this;
	}
}
/*export class Img extends CnvElement {
	src: string;
	size: Size;
	img: HTMLImageElement;

	constructor(center: Coord, src: string, size: Size) {
		super(center, IMG_ZINDEX_DEFAULT);
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
	action: RenderAction;

	private _style: DrawStyle;
	get style() { return this._style }
	set style(style: DrawStyle | null) { this._style = coalesce(style, {lineWidth: null, stroke: null, fill: null}) }

	constructor(action: RenderAction, center: Coord) {
		super(center);
		this.action = action;
		this.style = null;
	}
	setStyle(style: DrawStyle | null) {
		this.style = style;
		return this;
	}
}
export class Line extends CnvDrawing {
	points: [Coord, Coord];

	constructor(...points: [Coord, Coord]) {
		super(RenderAction.Stroke, COORDS.Middle(...points));
		this.points = points;
	}
	get length() {
		return COORDS.Distance(this.points[0], this.points[1]);
	}
	get center() { return COORDS.Middle(...this.points)}
	set center(center: Coord) {
		const diff = COORDS.Size(this.center, center)
		this._center = center;
		this.points[0] = COORDS.ValuesSum(this.points[0], diff.width, diff.height)
		this.points[1] = COORDS.ValuesSum(this.points[1], diff.width, diff.height)
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
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
			lines.push(new Line(arrLast(this.points), this.points[0]))
		}
		return lines;
	}
	get size() { return COORDS.Size(...this.points) }
	get length() {
		let length = 0;
		this.lines.forEach(line => {
			length += line.length;
		});
		return length;
	}
	get center() { return COORDS.Middle(...this.points)}
	set center(center: Coord) {
		const diff = COORDS.Size(this.center, center)
		this._center = center;
		this.points.forEach(point => {
			point = COORDS.ValuesSum(point, diff.width, diff.height)
		});
	}
	get conditionedAction() {
		if (this.closed) return this.action;
		if (this.action == RenderAction.Both) return RenderAction.Stroke;
		if (this.action == RenderAction.Fill) return RenderAction.None;
	}
	constructor(closed: boolean, ...points: Coord[]) {
		super(RenderAction.Stroke, COORDS.Middle(...points));
		this.closed = closed;
		this.points = points;
	}
	getPoint(index: number) { return this.points[overflow(index, 0, this.nPoints)] }
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			for (let i = 1; i < this.nPoints; i++) {
				length += (!this.closed && i == this.nPoints - 1)? 0 : COORDS.Distance(this.points[i], this.getPoint(i+1))
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

	get size() { return COORDS.Size(...this.points) }
	get perimeter() { return COORDS.Distance(this.points[0], this.points[1]) + COORDS.Distance(this.points[1], this.points[2]) + COORDS.Distance(this.points[2], this.points[0]) }
	get area() { return 'Todo, maybe impossible' }

	get center() { return COORDS.Middle(...this.points)}
	set center(center: Coord) {
		const diff = COORDS.Size(this.center, center)
		this._center = center;
		this.points = [...this.points.map(point => COORDS.ValuesSum(point, diff.width, diff.height))] as [Coord, Coord, Coord];
	}
	constructor(...points: [Coord, Coord, Coord]) {
		super(RenderAction.Both, COORDS.Middle(...points));
		this.points = points;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
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
			COORDS.ValuesSum(this.center, -deltaX, -deltaY),
			COORDS.ValuesSum(this.center, deltaX, -deltaY),
			COORDS.ValuesSum(this.center, deltaX, deltaY),
			COORDS.ValuesSum(this.center, -deltaX, deltaY),
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
			this.ctx.rect(this.points[0].x, this.points[0].y, this.size.width, this.size.height);
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints(this.points) : null;
		});
		return this;
	}
}
export class Arc extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	rotationDirection: Rotation;

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle = new Angle(0), end: Angle = new Angle(360), rotationDirection = Rotation.Clockwise) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.rotationDirection = rotationDirection;
	}
	render(drawPoints = false) {
		MainCanvas.get.draw(this.style, () => {
			this.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, Boolean(this.rotationDirection));
			MainCanvas.get.action(this.action);
			drawPoints? this.drawPoints() : null;
		});
		return this;
	}
}
export class MainCanvas extends Singleton {
	//#region Definition
	static get get() { return this.singletonInstance as MainCanvas }
	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;

	//todo private _items: Record<number, Mesh>[];

	get center() { return new Coord(this.cnv.width / 2, this.cnv.height / 2) }

	get color() {
		return new Color().setRGBA(rgbaParse(this.cnv.style.backgroundColor));
	}
	set color(color: Color) { this.cnv.style.backgroundColor = color.rgbaStr }

	get drawStyle() { return {lineWidth: this.ctx.lineWidth, strokeStyle: this.ctx.strokeStyle, fillStyle: this.ctx.fillStyle} as DrawStyle }
	set drawStyle(drawStyle: DrawStyle) {
		this.ctx.lineWidth = coalesce(drawStyle.lineWidth, this.ctx.lineWidth);
		this.ctx.strokeStyle = coalesce(drawStyle.strokeStyle, this.ctx.strokeStyle);
		this.ctx.fillStyle = coalesce(drawStyle.fillStyle, this.ctx.fillStyle);
	}

	get writeStyle() { return {textAlign: this.ctx.textAlign, font: this.ctx.font} as WriteStyle}
	set writeStyle(writeStyle: WriteStyle) {
		this.ctx.textAlign = coalesce(writeStyle.textAlign, this.ctx.textAlign);
		this.ctx.font = coalesce(writeStyle.font, this.ctx.font);
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
		console.log(this.ctx);
		
		
		console.log('Main canvas set')
	}
	//#endregion

	//#region Screen
	clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	rotate(angle = new Angle(0), rotationCenter = this.center) {
		this.ctx.translate(rotationCenter.x, rotationCenter.y);
		this.ctx.rotate(angle.radians);
		this.ctx.translate(-rotationCenter.x, -rotationCenter.y);
	}
	write(writeStyle: WriteStyle, renderCallBack: Function) {
		this.ctx.save();
		this.writeStyle = writeStyle;
		renderCallBack();
		this.ctx.restore();
	}
	draw(drawStyle: DrawStyle, renderCallBack: Function) {
		this.ctx.save();
		this.drawStyle = drawStyle;
		this.ctx.beginPath();
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

	/*addElement(element: CnvElement, zIndex = 0) {
		//todo add to both lists of record, the kv
	}
	getElement() {

	}
	removeElement(elementIndex: number) {

	}*/
	//#region Draw
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
			new Text(COORDS.ValuesSum(coord, -30, +3), unit.toString(), {textAlign: 'center'}).render()
			new Line(coord, COORDS.ValuesSum(coord, unit, 0)).render(); 
			COORDS.ValuesSum(coord, 0, 20);
		});
	}
	drawSampleMetric(clean = false, scale: number = 50) {
		scale = clamp(scale, 25, Infinity);
		if(clean) this.clean()
		this.ctx.lineWidth = 1;
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical lines
			new Line(new Coord(x, 0), new Coord(x, this.cnv.height)).render()
			new Text(new Coord(x-5, 10), x.toString(), {textAlign: 'right'}).render()
		}
		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal lines
			new Line(new Coord(0, y), new Coord(this.cnv.width, y)).render()
			new Text(new Coord(5, y-5), y.toString(), {textAlign: 'left'}).render()
		}
		new Arc(this.center, 5).render();
	}
	//#endregion
}
export class COORDS {
	//? sum every coordinate
	static Sum(...coords: Coord[]) {
		return coords.reduce((acc, curr) => new Coord(acc.x + curr.x, acc.y + curr.y), new Coord(0, 0));
	}
	//? sum x/y to a coordinate
	static ValuesSum(coord1: Coord, x: number, y: number) {
		return new Coord(coord1.x + x, coord1.y + y);
	}
	//? get the center of multiple points
	static Middle(...coords: Coord[]) {
		return new Coord(this.Sum(...coords).x/coords.length, this.Sum(...coords).y/coords.length);
	}
	//? x/y difference between multiple points
	static Size(...coords: Coord[]) {
		const pivoted = arrPivot(coords);	
		const cMax = new Coord(Math.max(...pivoted.x), Math.max(...pivoted.y));
		const cMin = new Coord(Math.min(...pivoted.x), Math.min(...pivoted.y));
		return {width: Math.abs(cMax.x - cMin.x), height: Math.abs(cMax.y - cMin.y)} as Size;
	}
	//? diagonal distance between 2 points
	static Distance(coord1: Coord, coord2: Coord) {
		return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
	}
}
//#endregion