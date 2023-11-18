import { Monad, Step, isnull, overflow } from '@gandolphinnn/utils';

//#region Enums, Types and Interfaces
export enum DrawAction {
	Stroke,
	Fill,
	Both
}
export enum CanvasMode {
	FullScreen,
	Window,
}
export enum AngleType {
	Degree,
	Radian
}
export enum BaseColor {
	Aqua,
	Black,
	Blue,
	Fuchsia,
	Gray,
	Green,
	Lime,
	Maroon,
	Navy,
	Olive,
	Purple,
	Red,
	Silver,
	Teal,
	White,
	Yellow
}
export type Color = BaseColor |	string;
export type Size = {
	width: number,
	height: number
}
export interface Component {} //? This will be useful later, in rigid2 and game2
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
	private _degrees!: number;
	private _radians!: number;

	constructor(alpha: number, type: AngleType = AngleType.Degree) {
		if (type == AngleType.Degree) {
			this.degrees = alpha;
		}
		else if (type == AngleType.Radian) {
			this.radians = alpha;
		}
		else { throw new Error('Invalid angle type'); }
	}
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
	private normalize() {
		this._degrees = overflow(this._degrees, 0, 359) //? Set degr to a 0 -> 359 range
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
export class Mesh implements Component {
	items: CnvElement[];
	zIndex: number;
	private readonly _center: Coord;
	set center(coord: Coord) { this }
	get center() { return this._center; }
	out(cnv: Canvas) {
		this.items.forEach(item => {
			item.out(cnv);
		});
	}
}
export abstract class CnvElement { //todo
	private _center: Coord;
	strokeStyle: Color = null;
	fillStyle: Color = null;
	zIndex: number;
	get action() { return (!isnull(this.strokeStyle) && !isnull(this.fillStyle))}
	
	set center(coord: Coord) { throw new Error('This method must be overridden in the child class') }
	get center() { return this._center; }
	moveBy(x: number, y: number) {
		this.center = new Coord(this.center.x + x, this.center.y + y);
	}
	abstract out(cnv: Canvas): void;
}
export class Text extends CnvElement { //todo
	text: string;
	constructor(text: string, fontSize: number = null, font: string = null) {
		super();
		this.text = text;
	}
	set center(coord: Coord) {

	}
	out(cnv: Canvas) {
		cnv.ctx.fillText(this.text, this.center.x, this.center.y);
	}
}
export class Img extends CnvElement { //todo
	constructor() {
		super();
	}
	set center(coord: Coord) {

	}
	out(cnv: Canvas) {

	}
}
export class Line extends CnvElement { //todo
	public coords: Coord[];

	constructor(coord1: Coord, coord2: Coord) {
		super();
		this.coords = [coord1, coord2];
	}
	set center(coord: Coord) {

	}

	get length() {
		return Math.sqrt(((this.coords[0].x - this.coords[1].x) ** 2) + ((this.coords[0].y - this.coords[1].y) ** 2))
	}
	out(cnv: Canvas) {

	}
};
export class Poly extends CnvElement {
	corners: Coord[];
	constructor() {
		super();
	}
	set center(coord: Coord) {

	}
	get nCorners() { return this.corners.length }
	get size() { return 'Todo' }
	get perimeter() { return 'Todo' }
	get area() { return 'Todo, dont know if its possible to calculate on an irregulare poly' }
	out(cnv: Canvas) {

	}
}
export class Rect extends Poly {
	constructor() {
		super();
	}
	set center(coord: Coord) {

	}
	out(cnv: Canvas) {

	}
}
export class Circle extends Poly {
	radius: number
	constructor(center: Coord, radius: number) {
		super();
		this.center = center;
		this.radius = radius;
	}
	set center(coord: Coord) {

	}
	out(cnv: Canvas) {

	}
}
export class Canvas {
	//#region Definition
	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	canvasMode: CanvasMode;

	preElements: CnvElement[]; //todo avoid images in elements, maybe
	images: Img[];
	postElements: CnvElement[];

	get center() { return new Coord(this.cnv.width / 2, this.cnv.height / 2) }
	get id() { return this.cnv.id }

	constructor(canvasMode: CanvasMode, dimension: Size = { width: 0, height: 0 }) {
		this.canvasMode = canvasMode;
		//* Get the body
		if (document.querySelector('body') == null) {
			throw new Error('Body element not found');
		}
		const body = document.querySelector('body')!;

		//* Get the autogenerated id
		const newId: string = new Monad(document.querySelectorAll('canvas'))
			.apply((nl: NodeListOf<HTMLCanvasElement>) => Array.from(nl))
			.apply((arr: Array<HTMLCanvasElement>) => arr.map((cnv) => cnv.id))
			.apply((arr: Array<string>) => arr.filter(str => /^c\d+$/.test(str)))
			.apply((arr: Array<string>) => arr.map(str => parseInt(str.slice(1), 10)))
			.run(new Step((arr: Array<number>) => Math.max(...arr) + 1, (val: number) => val == -Infinity, 1))
			.apply((n: number) => 'c' + n).log(true).value

		//* Create the canvas
		this.cnv = document.createElement("canvas");
		this.cnv.id = newId;
		switch (this.canvasMode) {
			case CanvasMode.FullScreen:
				this.cnv.width = window.innerWidth;
				this.cnv.height = window.innerHeight;
				body.style.overflow = 'hidden';
				body.style.margin = '0px';
				console.log(`Canvas ${newId} set in FullScreen mode`)
			break;
			case CanvasMode.Window:
				this.cnv.width = dimension.width;
				this.cnv.height = dimension.height;
				console.log(`Canvas ${newId} set in Window mode`)
			break;
		}
		body.appendChild(this.cnv)
		this.ctx = this.cnv.getContext('2d')!;
		//tests
	}
	//#endregion

	//#region Screen
	clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	rotate(angle: Angle = new Angle(0)) {
		this.ctx.rotate(angle.radians)
	}
	action(drawAction: DrawAction) {
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Fill) {
			this.ctx.fill();
		}
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Stroke) {
			this.ctx.stroke();
		}
	}
	writeText(text: string, coord: Coord) { //todo
		this.ctx.fillText(text, coord.x - 10, coord.y)
	}
	setColor(color: string, drawAction: DrawAction) {
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Fill) {
			this.ctx.fillStyle = color;
		}
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Stroke) {
			this.ctx.strokeStyle = color;
		}
	}
	printImage(img: HTMLImageElement, w: number, h: number, coord: Coord = sumCoordValues(this.center, -w / 2, -h / 2), rotation?: Angle, callback: Function = () => { }) {
		img.onload = () => {
			if (rotation !== undefined) {
			this.ctx.save()
			this.rotate(rotation)
			this.ctx.drawImage(img, coord.x, coord.y, w, h)
			this.ctx.restore()
			}
			else {
			this.ctx.drawImage(img, coord.x, coord.y, w, h)
			}
			callback();
		}
	}
	//#endregion

	//#region Draw
	addElement(element: CnvElement) {

	}
	getElement() {

	}
	removeElement(elementIndex: number) {

	}
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
			this.writeText(unit.toString(), sumCoordValues(coord, -30, +3))
			new Line(coord, sumCoordValues(coord, unit, 0)).out(this);
			sumCoordValues(coord, 0, 20);
		});
	}
	drawSampleMetric(scale: number = 50) {
		this.ctx.lineWidth = 1;
		this.ctx.textAlign = "left";
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical
			new Line(new Coord(x, 0), new Coord(x, this.cnv.height))
			this.writeText(x.toString(), new Coord(x, 10))
		}
		this.ctx.textAlign = "left";
		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal
			new Line(new Coord(0, y), new Coord(this.cnv.width, y))
			this.writeText(y.toString(), new Coord(35, y - 5))
		}
		new Circle(this.center, 5)
	}
	//#endregion
}

//#region Functions
export function sumCoords(coord1: Coord, coord2: Coord) {
	return new Coord(coord1.x + coord2.x, coord1.y + coord2.y);
}
export function sumCoordValues(coord1: Coord, x: number, y: number) {
	return new Coord(coord1.x + x, coord1.y + y);
}
export function coordDistance(coord1: Coord, coord2: Coord) {
	return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
}
export function getAction(strokeStyle: Color, fillStyle: Color) {
	if (!isnull(strokeStyle) && isnull(fillStyle)) {
		
	}
}
//#endregion