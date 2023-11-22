import { Monad, Step, isNull, areNull, overflow, clamp, coalesce, Singleton } from '@gandolphinnn/utils';

//#region Enums, Types, Interfaces and Constants
export enum RenderAction {
	None, Stroke, Fill, Both
}
export enum AngleType {
	Degree, Radian
}
export enum Rotation {
	Clockwise, CounterClockwise
}
export enum BaseColor {
	AliceBlue, AntiqueWhite, Aqua, Aquamarine, Azure, Beige, Bisque, Black, BlanchedAlmond, Blue, BlueViolet, Brown, BurlyWood,
	CadetBlue, Chartreuse, Chocolate, Coral, CornflowerBlue, Cornsilk, Crimson, Cyan,
	DarkBlue, DarkCyan, DarkGoldenRod, DarkGrey, DarkGreen, DarkKhaki, DarkMagenta, DarkOliveGreen, DarkOrange, DarkOrchid, DarkRed,
	DarkSalmon, DarkSeaGreen, DarkSlateBlue, DarkSlateGrey, DarkTurquoise, DarkViolet, DeepPink, DeepSkyBlue, DimGrey, DodgerBlue,
	FireBrick, FloralWhite, ForestGreen, Fuchsia, Gainsboro, GhostWhite, Gold, GoldenRod, Grey, Green, GreenYellow,
	HoneyDew, HotPink, IndianRed, Indigo, Ivory, Khaki, Lavender, LavenderBlush, LawnGreen, LemonChiffon, LightBlue, LightCoral, LightCyan, LightGoldenRodYellow,
	LightGrey, LightGreen, LightPink, LightSalmon, LightSeaGreen, LightSkyBlue, LightSlateGrey, LightSteelBlue, LightYellow, Lime, LimeGreen, Linen,
	Magenta, Maroon, MediumAquaMarine, MediumBlue, MediumOrchid, MediumPurple, MediumSeaGreen, MediumSlateBlue, MediumSpringGreen,
	MediumTurquoise, MediumVioletRed, MidnightBlue, MintCream, MistyRose, Moccasin, NavajoWhite, Navy,
	OldLace, Olive, OliveDrab, Orange, OrangeRed, Orchid, PaleGoldenRod, PaleGreen, PaleTurquoise, PaleVioletRed, PapayaWhip, PeachPuff, Peru, Pink, Plum, PowderBlue, Purple,
	RebeccaPurple, Red, RosyBrown, RoyalBlue, SaddleBrown, Salmon, SandyBrown, SeaGreen, SeaShell, Sienna, Silver, SkyBlue, SlateBlue, SlateGrey, Snow, SpringGreen, SteelBlue,
	Tan, Teal, Thistle, Tomato, Turquoise, Violet, Wheat, White, WhiteSmoke, Yellow, YellowGreen
}
export type RenderStyle = {
	lineWidth?: number,
	stroke?: Color,
	fill?: Color
}
export type TextStyle = {
	align?: CanvasTextAlign;
	font?: string;
}
export type Size = {
	width: number,
	height: number
}
export type RGB = {
	red: number | string,
	green: number | string,
	blue: number | string
}
export interface Component {} //? This will be useful later, in rigid2 and game2
export const BASECOLOR_DEC: Record<BaseColor, RGB> = {
	[BaseColor.AliceBlue]: {red: 240, green: 248, blue: 255},
	[BaseColor.AntiqueWhite]: {red: 250, green: 235, blue: 215},
	[BaseColor.Aqua]: {red: 0, green: 255, blue: 255},
	[BaseColor.Aquamarine]: {red: 127, green: 255, blue: 212},
	[BaseColor.Azure]: {red: 240, green: 255, blue: 255},
	[BaseColor.Beige]: {red: 245, green: 245, blue: 220},
	[BaseColor.Bisque]: {red: 255, green: 228, blue: 196},
	[BaseColor.Black]: {red: 0, green: 0, blue: 0},
	[BaseColor.BlanchedAlmond]: {red: 255, green: 235, blue: 205},
	[BaseColor.Blue]: {red: 0, green: 0, blue: 255},
	[BaseColor.BlueViolet]: {red: 138, green: 43, blue: 226},
	[BaseColor.Brown]: {red: 165, green: 42, blue: 42},
	[BaseColor.BurlyWood]: {red: 222, green: 184, blue: 135},
	[BaseColor.CadetBlue]: {red: 95, green: 158, blue: 160},
	[BaseColor.Chartreuse]: {red: 127, green: 255, blue: 0},
	[BaseColor.Chocolate]: {red: 210, green: 105, blue: 30},
	[BaseColor.Coral]: {red: 255, green: 127, blue: 80},
	[BaseColor.CornflowerBlue]: {red: 100, green: 149, blue: 237},
	[BaseColor.Cornsilk]: {red: 255, green: 248, blue: 220},
	[BaseColor.Crimson]: {red: 220, green: 20, blue: 60},
	[BaseColor.Cyan]: {red: 0, green: 255, blue: 255},
	[BaseColor.DarkBlue]: {red: 0, green: 0, blue: 139},
	[BaseColor.DarkCyan]: {red: 0, green: 139, blue: 139},
	[BaseColor.DarkGoldenRod]: {red: 184, green: 134, blue: 11},
	[BaseColor.DarkGrey]: {red: 169, green: 169, blue: 169},
	[BaseColor.DarkGreen]: {red: 0, green: 100, blue: 0},
	[BaseColor.DarkKhaki]: {red: 189, green: 183, blue: 107},
	[BaseColor.DarkMagenta]: {red: 139, green: 0, blue: 139},
	[BaseColor.DarkOliveGreen]: {red: 85, green: 107, blue: 47},
	[BaseColor.DarkOrange]: {red: 255, green: 140, blue: 0},
	[BaseColor.DarkOrchid]: {red: 153, green: 50, blue: 204},
	[BaseColor.DarkRed]: {red: 139, green: 0, blue: 0},
	[BaseColor.DarkSalmon]: {red: 233, green: 150, blue: 122},
	[BaseColor.DarkSeaGreen]: {red: 143, green: 188, blue: 143},
	[BaseColor.DarkSlateBlue]: {red: 72, green: 61, blue: 139},
	[BaseColor.DarkSlateGrey]: {red: 47, green: 79, blue: 79},
	[BaseColor.DarkTurquoise]: {red: 0, green: 206, blue: 209},
	[BaseColor.DarkViolet]: {red: 148, green: 0, blue: 211},
	[BaseColor.DeepPink]: {red: 255, green: 20, blue: 147},
	[BaseColor.DeepSkyBlue]: {red: 0, green: 191, blue: 255},
	[BaseColor.DimGrey]: {red: 105, green: 105, blue: 105},
	[BaseColor.DodgerBlue]: {red: 30, green: 144, blue: 255},
	[BaseColor.FireBrick]: {red: 178, green: 34, blue: 34},
	[BaseColor.FloralWhite]: {red: 255, green: 250, blue: 240},
	[BaseColor.ForestGreen]: {red: 34, green: 139, blue: 34},
	[BaseColor.Fuchsia]: {red: 255, green: 0, blue: 255},
	[BaseColor.Gainsboro]: {red: 220, green: 220, blue: 220},
	[BaseColor.GhostWhite]: {red: 248, green: 248, blue: 255},
	[BaseColor.Gold]: {red: 255, green: 215, blue: 0},
	[BaseColor.GoldenRod]: {red: 218, green: 165, blue: 32},
	[BaseColor.Grey]: {red: 128, green: 128, blue: 128},
	[BaseColor.Green]: {red: 0, green: 128, blue: 0},
	[BaseColor.GreenYellow]: {red: 173, green: 255, blue: 47},
	[BaseColor.HoneyDew]: {red: 240, green: 255, blue: 240},
	[BaseColor.HotPink]: {red: 255, green: 105, blue: 180},
	[BaseColor.IndianRed]: {red: 205, green: 92, blue: 92},
	[BaseColor.Indigo]: {red: 75, green: 0, blue: 130},
	[BaseColor.Ivory]: {red: 255, green: 255, blue: 240},
	[BaseColor.Khaki]: {red: 240, green: 230, blue: 140},
	[BaseColor.Lavender]: {red: 230, green: 230, blue: 250},
	[BaseColor.LavenderBlush]: {red: 255, green: 240, blue: 245},
	[BaseColor.LawnGreen]: {red: 124, green: 252, blue: 0},
	[BaseColor.LemonChiffon]: {red: 255, green: 250, blue: 205},
	[BaseColor.LightBlue]: {red: 173, green: 216, blue: 230},
	[BaseColor.LightCoral]: {red: 240, green: 128, blue: 128},
	[BaseColor.LightCyan]: {red: 224, green: 255, blue: 255},
	[BaseColor.LightGoldenRodYellow]: {red: 250, green: 250, blue: 210},
	[BaseColor.LightGrey]: {red: 211, green: 211, blue: 211},
	[BaseColor.LightGreen]: {red: 144, green: 238, blue: 144},
	[BaseColor.LightPink]: {red: 255, green: 182, blue: 193},
	[BaseColor.LightSalmon]: {red: 255, green: 160, blue: 122},
	[BaseColor.LightSeaGreen]: {red: 32, green: 178, blue: 170},
	[BaseColor.LightSkyBlue]: {red: 135, green: 206, blue: 250},
	[BaseColor.LightSlateGrey]: {red: 119, green: 136, blue: 153},
	[BaseColor.LightSteelBlue]: {red: 176, green: 196, blue: 222},
	[BaseColor.LightYellow]: {red: 255, green: 255, blue: 224},
	[BaseColor.Lime]: {red: 0, green: 255, blue: 0},
	[BaseColor.LimeGreen]: {red: 50, green: 205, blue: 50},
	[BaseColor.Linen]: {red: 250, green: 240, blue: 230},
	[BaseColor.Magenta]: {red: 255, green: 0, blue: 255},
	[BaseColor.Maroon]: {red: 128, green: 0, blue: 0},
	[BaseColor.MediumAquaMarine]: {red: 102, green: 205, blue: 170},
	[BaseColor.MediumBlue]: {red: 0, green: 0, blue: 205},
	[BaseColor.MediumOrchid]: {red: 186, green: 85, blue: 211},
	[BaseColor.MediumPurple]: {red: 147, green: 112, blue: 219},
	[BaseColor.MediumSeaGreen]: {red: 60, green: 179, blue: 113},
	[BaseColor.MediumSlateBlue]: {red: 123, green: 104, blue: 238},
	[BaseColor.MediumSpringGreen]: {red: 0, green: 250, blue: 154},
	[BaseColor.MediumTurquoise]: {red: 72, green: 209, blue: 204},
	[BaseColor.MediumVioletRed]: {red: 199, green: 21, blue: 133},
	[BaseColor.MidnightBlue]: {red: 25, green: 25, blue: 112},
	[BaseColor.MintCream]: {red: 245, green: 255, blue: 250},
	[BaseColor.MistyRose]: {red: 255, green: 228, blue: 225},
	[BaseColor.Moccasin]: {red: 255, green: 228, blue: 181},
	[BaseColor.NavajoWhite]: {red: 255, green: 222, blue: 173},
	[BaseColor.Navy]: {red: 0, green: 0, blue: 128},
	[BaseColor.OldLace]: {red: 253, green: 245, blue: 230},
	[BaseColor.Olive]: {red: 128, green: 128, blue: 0},
	[BaseColor.OliveDrab]: {red: 107, green: 142, blue: 35},
	[BaseColor.Orange]: {red: 255, green: 165, blue: 0},
	[BaseColor.OrangeRed]: {red: 255, green: 69, blue: 0},
	[BaseColor.Orchid]: {red: 218, green: 112, blue: 214},
	[BaseColor.PaleGoldenRod]: {red: 238, green: 232, blue: 170},
	[BaseColor.PaleGreen]: {red: 152, green: 251, blue: 152},
	[BaseColor.PaleTurquoise]: {red: 175, green: 238, blue: 238},
	[BaseColor.PaleVioletRed]: {red: 219, green: 112, blue: 147},
	[BaseColor.PapayaWhip]: {red: 255, green: 239, blue: 213},
	[BaseColor.PeachPuff]: {red: 255, green: 218, blue: 185},
	[BaseColor.Peru]: {red: 205, green: 133, blue: 63},
	[BaseColor.Pink]: {red: 255, green: 192, blue: 203},
	[BaseColor.Plum]: {red: 221, green: 160, blue: 221},
	[BaseColor.PowderBlue]: {red: 176, green: 224, blue: 230},
	[BaseColor.Purple]: {red: 128, green: 0, blue: 128},
	[BaseColor.RebeccaPurple]: {red: 102, green: 51, blue: 153},
	[BaseColor.Red]: {red: 255, green: 0, blue: 0},
	[BaseColor.RosyBrown]: {red: 188, green: 143, blue: 143},
	[BaseColor.RoyalBlue]: {red: 65, green: 105, blue: 225},
	[BaseColor.SaddleBrown]: {red: 139, green: 69, blue: 19},
	[BaseColor.Salmon]: {red: 250, green: 128, blue: 114},
	[BaseColor.SandyBrown]: {red: 244, green: 164, blue: 96},
	[BaseColor.SeaGreen]: {red: 46, green: 139, blue: 87},
	[BaseColor.SeaShell]: {red: 255, green: 245, blue: 238},
	[BaseColor.Sienna]: {red: 160, green: 82, blue: 45},
	[BaseColor.Silver]: {red: 192, green: 192, blue: 192},
	[BaseColor.SkyBlue]: {red: 135, green: 206, blue: 235},
	[BaseColor.SlateBlue]: {red: 106, green: 90, blue: 205},
	[BaseColor.SlateGrey]: {red: 112, green: 128, blue: 144},
	[BaseColor.Snow]: {red: 255, green: 250, blue: 250},
	[BaseColor.SpringGreen]: {red: 0, green: 255, blue: 127},
	[BaseColor.SteelBlue]: {red: 70, green: 130, blue: 180},
	[BaseColor.Tan]: {red: 210, green: 180, blue: 140},
	[BaseColor.Teal]: {red: 0, green: 128, blue: 128},
	[BaseColor.Thistle]: {red: 216, green: 191, blue: 216},
	[BaseColor.Tomato]: {red: 255, green: 99, blue: 71},
	[BaseColor.Turquoise]: {red: 64, green: 224, blue: 208},
	[BaseColor.Violet]: {red: 238, green: 130, blue: 238},
	[BaseColor.Wheat]: {red: 245, green: 222, blue: 179},
	[BaseColor.White]: {red: 255, green: 255, blue: 255},
	[BaseColor.WhiteSmoke]: {red: 245, green: 245, blue: 245},
	[BaseColor.Yellow]: {red: 255, green: 255, blue: 0},
	[BaseColor.YellowGreen]: {red: 154, green: 205, blue: 50}
}
//#endregion

//#region Classes
export class Color {
	red: number;
	green: number;
	blue: number;
	alpha: number;
	get hex() { return `#${decToHex(this.red)}${decToHex(this.green)}${decToHex(this.blue)}` }
	get rgb() { return `rgb(${this.red},${this.green},${this.blue})` }
	get rgba() { return `rgba(${this.red},${this.green},${this.blue},${this.alpha})` }
	constructor(baseColor: BaseColor, rgb?: RGB, alpha?: number) {
		this.set(baseColor, rgb, alpha);
	}
	set(baseColor?: BaseColor, rgb?: RGB, alpha: number = 1) {
		if (isNull(baseColor)) {
			if (typeof rgb.red === 'string') rgb.red = hexToDec(rgb.red);
			this.red = rgb.red;
			if (typeof rgb.green === 'string') rgb.green = hexToDec(rgb.green);
			this.green = rgb.green;
			if (typeof rgb.blue === 'string') rgb.blue = hexToDec(rgb.blue);
			this.blue = rgb.blue;
		}
		else {
			let obj = baseColorHex(baseColor) as {red: number, green: number, blue: number}
			this.red = obj.red;
			this.green = obj.green;
			this.blue = obj.blue;
		}
		this.alpha = alpha;
	}
}
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
	constructor(alpha: number, type: AngleType = AngleType.Degree) {
		if (type == AngleType.Degree) {
			this.degrees = alpha;
		}
		else if (type == AngleType.Radian) {
			this.radians = alpha;
		}
		else { throw new Error('Invalid angle type'); }
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
	set center(coord: Coord) { } //todo
	get center() { return this._center; }
	render() {
		this.items.forEach(item => {
			item.render();
		});
	}
}
export abstract class CnvElement { //todo
	canvas: MainCanvas
	center: Coord;
	zIndex: number;
	constructor() {
		this.canvas = MainCanvas.instance;
	}
	abstract render(): void;
}
export class Text extends CnvElement { //todo
	content: string;
	style: TextStyle;
	constructor(center: Coord, content: string, style: TextStyle) {
		super();
		this.center = center;
		this.content = content;
		this.style = style;
	}
	render() {
		const ctx = this.canvas.ctx;
		ctx.save();
		ctx.textAlign = coalesce(this.style.align, ctx.textAlign);
		ctx.font = coalesce(this.style.font, ctx.font);
		ctx.fillText(this.content, this.center.x, this.center.y);
		ctx.restore();
	}
}
export class Img extends CnvElement { //todo
	center: Coord;
	src: string;
	size: Size;
	img: HTMLImageElement;
	constructor(center: Coord, src: string, size: Size) {
		super();
		this.center = center;
		this.src = src;
		this.size = size;
		this.img = new Image()
		this.img.src = this.src;
		console.log(this);
		
	}
	render() {
		this.img.onload = () => {
			this.canvas.ctx.drawImage(this.img, this.center.x, this.center.y, this.size.width, this.size.height);
			console.log('re');
			
		}
	}
}
export class Line extends CnvElement { //todo
	center: Coord;
	point: Coord[];
	style: RenderStyle = {lineWidth: null, stroke: null, fill: null}
	action: RenderAction;
	constructor(point1: Coord, point2: Coord) {
		super();
		this.point = [point1, point2];
		this.center
	}
	get length() {
		return coordDistance(this.point[0], this.point[1]);
	}
	render() {
		this.canvas.ctx.beginPath();
		this.canvas.ctx.closePath();
		this.canvas.ctx.moveTo(this.point[0].x, this.point[0].y);
		this.canvas.ctx.lineTo(this.point[1].x, this.point[1].y);
		this.canvas.ctx.stroke();
	}
}
export class Triangle extends CnvElement { //todo
	corners: Coord[];
	style: RenderStyle = {lineWidth: null, stroke: null, fill: null}
	action: RenderAction;
	constructor(action: RenderAction, p1: Coord, p2: Coord, p3: Coord) {
		super();
		this.action = action;

	}
	get size() { return 'Todo' }
	get perimeter() { return 'Todo' }
	get area() { return 'Todo' }
	render() {
		this.canvas.ctx.beginPath();
		
		this.canvas.ctx.stroke();
	}
}
export class Rect extends CnvElement{ //todo
	action: RenderAction;
	size: Size;
	style: RenderStyle = {lineWidth: null, stroke: null, fill: null}
	constructor(action: RenderAction, center: Coord, size: Size) {
		super();
		this.action = action;
		this.center = center; 
		this.size = size; 
	}
	get perimeter() { return (this.size.height + this.size.width) * 2 }
	get area() { return this.size.height * this.size.width }
	render() {
		this.canvas.ctx.rect(this.center.x, this.center.y, this.size.width, this.size.height);
	}
}
export class Arc extends CnvElement { //todo
	action: RenderAction;
	radius: number;
	start: Angle;
	end: Angle;
	rotation: Rotation;
	style: RenderStyle = {lineWidth: null, stroke: null, fill: null}
	constructor(action: RenderAction, center: Coord, radius: number, style: RenderStyle, start: Angle = new Angle(0), end: Angle = new Angle(0), rotation: Rotation = Rotation.Clockwise) {
		super();
		this.action = action;
		this.center = center;
		this.style = style;
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.rotation = rotation; 
	}
	get diameter() { return this.radius * 2 };
	set diameter(diameter: number) { this.radius = diameter / 2 };
	render() {
		this.canvas.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.rotation == Rotation.CounterClockwise)
		this.canvas.action(this.action, this.style);
	}
}
export class MainCanvas extends Singleton {
	//#region Definition
	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	
	private _instance: MainCanvas;
	private _identity: number;
	private _item: Record<number, CnvElement>[];
	private _index: Record<number, number>[];

	get center() { return new Coord(this.cnv.width / 2, this.cnv.height / 2) }
	static get instance() {
		if (this._instance == null) {
			this._instance = new Singleton()
		}
		return this._instance;
	}
	private constructor() {
		super();
		//* Get the body
		if (document.querySelector('body') == null) {
			throw new Error('Body element not found');
		}
		const body = document.querySelector('body')!;

		//* Create the canvas
		this.cnv = document.createElement("canvas");
		this.cnv.width = window.innerWidth;
		this.cnv.height = window.innerHeight;
		body.style.overflow = 'hidden';
		body.style.margin = '0px';
		console.log(`Main canvas set`)

		body.appendChild(this.cnv)
		this.ctx = this.cnv.getContext('2d')!;
		//tests
	}
	//#endregion

	//#region Screen
	clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	rotate(angle = new Angle(0), rotationCenter = new Coord(0, 0)) {
		this.ctx.translate(rotationCenter.x, rotationCenter.y);
		this.ctx.rotate(angle.radians);
		this.ctx.translate(-rotationCenter.x, -rotationCenter.y);
	}
	action(drawAction: RenderAction, style: RenderStyle) {
		this.ctx.save();
		this.ctx.lineWidth = coalesce(style.lineWidth, this.ctx.lineWidth);
		this.ctx.strokeStyle = coalesce(style.stroke, this.ctx.strokeStyle);
		this.ctx.fillStyle = coalesce(style.fill, this.ctx.fillStyle);
		if (drawAction == RenderAction.Both || drawAction == RenderAction.Fill) {
			this.ctx.fill();
		}
		if (drawAction == RenderAction.Both || drawAction == RenderAction.Stroke) {
			this.ctx.stroke();
		}
		this.ctx.restore();
	}
	//#endregion

	//#region Draw
	addElement(element: CnvElement, zIndex = 0) {
		let newIdentity = this._identity++;
		//todo add to both lists of record, the kv
	}
	getElement() {

	}
	removeElement(elementIndex: number) {

	}
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
			new Text(this, sumCoordValues(coord, -30, +3), unit.toString(), 'center').render()
			new Line(this, coord, sumCoordValues(coord, unit, 0)).render();
			sumCoordValues(coord, 0, 20);
		});
	}
	drawSampleMetric(clean = false, scale: number = 50) {
		if(clean) this.clean()
		this.ctx.lineWidth = 1;
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical lines
			new Line(this, new Coord(x, 0), new Coord(x, this.cnv.height)).render()
			new Text(this, new Coord(x-5, 10), x.toString(), 'right').render()
		}
		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal lines
			new Line(this, new Coord(0, y), new Coord(this.cnv.width, y)).render()
			new Text(this, new Coord(5, y-5), y.toString(), {align: 'left'}).render()
		}
		new Arc(this, RenderAction.Both, this.center, 5, {}).render();
	}
	//#endregion
}
//#endregion

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
export function baseColorHex(colorName: BaseColor) {
	return BASECOLOR_DEC[colorName];
}
export function rgbObj(red: number | string, green: number | string, blue: number | string): RGB {
	return {red: red, green: green, blue: blue}
}
export function decToHex(dec: number) {
	return ('0'+ dec.toString(16).toUpperCase()).slice(-2);
}
export function hexToDec(hex: string) {
	return clamp(parseInt(hex, 16), 0, 255);
}
//#endregion