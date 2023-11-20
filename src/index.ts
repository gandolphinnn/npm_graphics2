import { Monad, Step, isNull, areNull, overflow } from '@gandolphinnn/utils';

//#region Enums, Types and Interfaces
export enum CanvasMode {
	FullScreen,
	Window,
}
export enum RenderMode {
	Stroke,
	Fill,
	Both,
	None
}
export enum AngleType {
	Degree,
	Radian
}
export enum Rotation {
	Clockwise,
	CounterClockwise
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
	render() {
		this.items.forEach(item => {
			item.render();
		});
	}
}
export abstract class CnvElement { //todo
	canvas: Canvas
	strokeStyle: Color = null;
	fillStyle: Color = null;
	zIndex: number;
	get action() {
		if (areNull(this.strokeStyle, this.fillStyle)) {
			return RenderMode.None;
		}
		if (isNull(this.fillStyle)) {
			return RenderMode.Stroke;
		}
		if (isNull(this.strokeStyle)) {
			return RenderMode.Fill;
		}
		return RenderMode.Both;
	}
	constructor(canvas: Canvas) {
		this.canvas = canvas
	}
	/*private _center: Coord;
	private _size: Size;
	
	set center(coord: Coord) { throw new Error('This method must be overridden in the child class') }
	get center() { return this._center; }
	set size(size: Size) { throw new Error('This method must be overridden in the child class') }
	get size() { return this._size; }

	moveBy(x: number, y: number) {
		this.center = new Coord(this.center.x + x, this.center.y + y);
	}*/
	abstract render(): void;
}
export class Text extends CnvElement { //todo
	center: Coord;
	text: string;
	align: string; //todo
	constructor(canvas:Canvas, center: Coord, text: string) {
		super(canvas);
		this.center = center;
		this.text = text;
	}
	render() {
		this.canvas.ctx.fillText(this.text, this.center.x, this.center.y);
	}
}
export class Img extends CnvElement { //todo
	center: Coord;
	src: string;
	size: Size;
	constructor(canvas:Canvas, center: Coord, src: string, size: Size) {
		super(canvas);
		this.center = center;
		this.src = src;
		this.size = size;
	}
	render() {
		
	}
}
export class Line extends CnvElement { //todo
	center: Coord;
	point: Coord[];

	constructor(canvas:Canvas, point1: Coord, point2: Coord) {
		super(canvas);
		this.point = [point1, point2];
		this.center
	}

	get length() {
		return Math.sqrt(((this.point[0].x - this.point[1].x) ** 2) + ((this.point[0].y - this.point[1].y) ** 2))
	}
	render() {
		this.canvas.ctx.beginPath();
		this.canvas.ctx.moveTo(this.point[0].x, this.point[0].y);
		this.canvas.ctx.lineTo(this.point[1].x, this.point[1].y);
		this.canvas.ctx.stroke();
	}
};
export class Path extends CnvElement {
	corners: Coord[];
	constructor(canvas:Canvas, ) {
		super(canvas);
	}
	set center(coord: Coord) {
		
	}
	get nCorners() { return this.corners.length }
	get size() { return 'Todo' }
	get perimeter() { return 'Todo' }
	get area() { return 'Todo' }
	render() {
		this.canvas.ctx.beginPath();
		for(const corner in this.corners) {

		}
		this.canvas.ctx.stroke();
	}
}
export class Rect extends CnvElement {
	center: Coord;
	size: Size;
	
	constructor(canvas:Canvas, center: Coord, size: Size) {
		super(canvas);
		this.center = center; 
		this.size = size; 
	}
	get perimeter() { return (this.size.height + this.size.width) * 2 }
	get area() { return this.size.height * this.size.width }
	render() {
		this.canvas.ctx.rect(this.center.x, this.center.y, this.size.width, this.size.height);
		this.canvas.action(this.action);
	}
}
export class Arc extends CnvElement {
	center: Coord;
	radius: number;
	start: Angle;
	end: Angle;
	rotation: Rotation;
	constructor(canvas:Canvas, center: Coord, radius: number, start: Angle = new Angle(0), end: Angle = new Angle(0), rotation: Rotation = Rotation.Clockwise) {
		super(canvas);
		this.center = center;
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.rotation = rotation; 
	}
	get diameter() { return this.radius*2 };
	set diameter(diameter: number) { this.radius = diameter / 2 };
	render() {
		this.canvas.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.rotation == Rotation.CounterClockwise)
	}
}
export class Canvas {
	//#region Definition
	readonly canvas: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	canvasMode: CanvasMode;

	preElements: CnvElement[]; //todo avoid images in elements, maybe
	images: Img[];
	postElements: CnvElement[];

	get center() { return new Coord(this.canvas.width / 2, this.canvas.height / 2) }
	get id() { return this.canvas.id }

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
			.apply((n: number) => 'c' + n).value

		//* Create the canvas
		this.canvas = document.createElement("canvas");
		this.canvas.id = newId;
		switch (this.canvasMode) {
			case CanvasMode.FullScreen:
				this.canvas.width = window.innerWidth;
				this.canvas.height = window.innerHeight;
				body.style.overflow = 'hidden';
				body.style.margin = '0px';
				console.log(`Canvas ${newId} set in FullScreen mode`)
			break;
			case CanvasMode.Window:
				this.canvas.width = dimension.width;
				this.canvas.height = dimension.height;
				console.log(`Canvas ${newId} set in Window mode`)
			break;
		}
		body.appendChild(this.canvas)
		this.ctx = this.canvas.getContext('2d')!;
		//tests
	}
	//#endregion

	//#region Screen
	clean() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	rotate(angle: Angle = new Angle(0)) {
		this.ctx.rotate(angle.radians)
	}
	action(drawAction: RenderMode) {
		if (drawAction == RenderMode.Both || drawAction == RenderMode.Fill) {
			this.ctx.fill();
		}
		if (drawAction == RenderMode.Both || drawAction == RenderMode.Stroke) {
			this.ctx.stroke();
		}
	}
	writeText(text: string, coord: Coord) { //todo
		this.ctx.fillText(text, coord.x - 10, coord.y)
	}
	setColor(color: string, drawAction: RenderMode) {
		if (drawAction == RenderMode.Both || drawAction == RenderMode.Fill) {
			this.ctx.fillStyle = color;
		}
		if (drawAction == RenderMode.Both || drawAction == RenderMode.Stroke) {
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
		if (testunit > 0 && testunit < this.canvas.width && sampleUnits.indexOf(testunit) == -1) {
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
			new Line(this, coord, sumCoordValues(coord, unit, 0)).render();
			sumCoordValues(coord, 0, 20);
		});
	}
	drawSampleMetric(scale: number = 50) {
		this.ctx.lineWidth = 1;
		this.ctx.textAlign = "left";
		for (let x = scale; x < this.canvas.width; x += scale) { //? Vertical
			new Line(this, new Coord(x, 0), new Coord(x, this.canvas.height)).render()
			this.writeText(x.toString(), new Coord(x, 10))
		}
		this.ctx.textAlign = "left";
		for (let y = scale; y < this.canvas.height; y += scale) { //? Horizontal
			new Line(this, new Coord(0, y), new Coord(this.canvas.width, y)).render()
			this.writeText(y.toString(), new Coord(35, y - 5))
		}
		new Arc(this, this.center, 5)
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
//#endregion