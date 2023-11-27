import { isNull, overflow, clamp, coalesce, Singleton, arrPivot, arrLast } from '@gandolphinnn/utils';

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
export type DrawStyle = {
	lineWidth?: number,
	strokeStyle?: string | CanvasGradient | CanvasPattern,
	fillStyle?: string | CanvasGradient | CanvasPattern
}
export type TextStyle = {
	/**
	 * @example "left" means the center is just to the left of the text
	 */
	textAlign?: CanvasTextAlign;
	/**
	 * @example "10px Arial"
	 */
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
export const RGBA_PATTERN: RegExp = /rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([01](?:\.\d+)?)\))?/
export const IMG_ZINDEX_DEFAULT = 100;
export const DRAWPOINTS_RADIUS = 3;
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
	constructor(baseColor?: BaseColor, rgb?: RGB, alpha?: number) {
		this.set(baseColor, rgb, alpha);
	}
	set(baseColor?: BaseColor, rgb?: RGB, alpha: number = 1) {
		if (isNull(baseColor)) {
			if (typeof rgb.red === 'string') rgb.red = hexToDec(rgb.red);
			this.red = clamp(rgb.red, 0, 255);
			if (typeof rgb.green === 'string') rgb.green = hexToDec(rgb.green);
			this.green = clamp(rgb.green, 0, 255);
			if (typeof rgb.blue === 'string') rgb.blue = hexToDec(rgb.blue);
			this.blue = clamp(rgb.blue, 0, 255);
		}
		else if (isNull(rgb)) {
			let obj = baseColorToDec(baseColor) as {red: number, green: number, blue: number}
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
	constructor(alpha: number = 0, type: AngleType = AngleType.Degree) {
		if (type == AngleType.Degree) {
			this.degrees = alpha;
		}
		else if (type == AngleType.Radian) {
			this.radians = alpha;
		}
		else { throw new Error('Invalid angle type'); }
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
	items: CnvElement[];
	zIndex: number;
	private readonly _center: Coord;
	set center(coord: Coord) { }
	get center() { return this._center; }
	render() {
		this.items.forEach(item => {
			item.render(false);
		});
	}
}
export abstract class CnvElement {
	ctx: CanvasRenderingContext2D;
	zIndex: number;

	protected _center: Coord;
	get center() { return this._center }
	set center(center: Coord) { this._center = center }

	constructor(center: Coord, zIndex = 0) {
		this._center = center;
		this.ctx = MainCanvas.get.ctx;
		this.zIndex = zIndex;
	}
	moveBy(x: number, y: number) {
		this.center = coordValuesSum(this.center, x, y);
	}
	abstract render(drawPoints: boolean): CnvElement;
	protected drawPoints(points: Coord[] = []) {
		[this.center, ...points].forEach(point => {
			MainCanvas.get.safeDraw({strokeStyle: new Color(BaseColor.Black).rgba, fillStyle: new Color(BaseColor.Black).rgba}, () => {
				new Arc(point, DRAWPOINTS_RADIUS, null).render();
			});
		});
	}
}
export class Text extends CnvElement {
	content: string;
	private _style: TextStyle;
	get style() { return this._style }
	set style(style: TextStyle | null) { this._style = coalesce(style, {align: null, font: null}) }

	constructor(center: Coord, content: string, style?: TextStyle) {
		super(center);
		this.content = content;
		this.style = style;
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

	constructor(action: RenderAction, center: Coord, zIndex = 0) {
		super(center, zIndex);
		this.action = action;
		this.style = null;
	}
}
export class Line extends CnvDrawing {
	points: [Coord, Coord];

	constructor(...points: [Coord, Coord]) {
		super(RenderAction.Stroke, coordsMiddle(...points));
		this.points = points;
	}
	get length() {
		return coordDistance(this.points[0], this.points[1]);
	}
	get center() { return coordsMiddle(...this.points)}
	set center(center: Coord) {
		const diff = coordsSize(this.center, center)
		this._center = center;
		this.points[0] = coordValuesSum(this.points[0], diff.width, diff.height)
		this.points[1] = coordValuesSum(this.points[1], diff.width, diff.height)
	}
	render(drawPoints = false) {
		MainCanvas.get.safeDraw(this.style, () => {
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
	get size() { return coordsSize(...this.points) }
	get length() {
		let length = 0;
		this.lines.forEach(line => {
			length += line.length;
		});
		return length;
	}
	get center() { return coordsMiddle(...this.points)}
	set center(center: Coord) {
		const diff = coordsSize(this.center, center)
		this._center = center;
		this.points.forEach(point => {
			point = coordValuesSum(point, diff.width, diff.height)
		});
	}
	get conditionedAction() {
		if (this.closed) return this.action;
		if (this.action == RenderAction.Both) return RenderAction.Stroke;
		if (this.action == RenderAction.Fill) return RenderAction.None;
	}
	constructor(closed: boolean, ...points: Coord[]) {
		super(RenderAction.Stroke, coordsMiddle(...points));
		this.closed = closed;
		this.points = points;
	}
	getPoint(index: number) { return this.points[overflow(index, 0, this.nPoints)] }
	render(drawPoints = false) {
		MainCanvas.get.safeDraw(this.style, () => {
			this.ctx.moveTo(this.points[0].x, this.points[0].y);
			for (let i = 1; i < this.nPoints; i++) {
				length += (!this.closed && i == this.nPoints - 1)? 0 : coordDistance(this.points[i], this.getPoint(i+1))
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

	get size() { return coordsSize(...this.points) }
	get perimeter() { return coordDistance(this.points[0], this.points[1]) + coordDistance(this.points[1], this.points[2]) + coordDistance(this.points[2], this.points[0]) }
	get area() { return 'Todo, maybe impossible' }

	get center() { return coordsMiddle(...this.points)}
	set center(center: Coord) {
		const diff = coordsSize(this.center, center)
		this._center = center;
		this.points.forEach(point => {
			point = coordValuesSum(point, diff.width, diff.height)
		});
	}
	constructor(...points: [Coord, Coord, Coord]) {
		super(RenderAction.Both, coordsMiddle(...points));
		this.points = points;
	}
	render(drawPoints = false) {
		MainCanvas.get.safeDraw(this.style, () => {
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
			coordValuesSum(this.center, -deltaX, -deltaY),
			coordValuesSum(this.center, deltaX, -deltaY),
			coordValuesSum(this.center, deltaX, deltaY),
			coordValuesSum(this.center, -deltaX, deltaY),
		];
	}
	get perimeter() { return (this.size.height + this.size.width) * 2 }
	get area() { return this.size.height * this.size.width }

	constructor(center: Coord, size: Size) {
		super(RenderAction.Both, center);
		this.size = size;
	}
	render(drawPoints = false) {
		MainCanvas.get.safeDraw(this.style, () => {
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
		MainCanvas.get.safeDraw(this.style, () => {
			this.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.rotationDirection == Rotation.CounterClockwise);
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
		const rgba = rgbaParse(this.cnv.style.backgroundColor);
		return new Color(null, rgba.rgb, rgba.a);
	}
	set color(color: Color) { this.cnv.style.backgroundColor = color.rgba }

	get drawStyle() { return {lineWidth: this.ctx.lineWidth, strokeStyle: this.ctx.strokeStyle, fillStyle: this.ctx.fillStyle} as DrawStyle }
	set drawStyle(drawStyle: DrawStyle) {
		this.ctx.lineWidth = coalesce(drawStyle.lineWidth, this.ctx.lineWidth);
		this.ctx.strokeStyle = coalesce(drawStyle.strokeStyle, this.ctx.strokeStyle);
		this.ctx.fillStyle = coalesce(drawStyle.fillStyle, this.ctx.fillStyle);
	}

	get textStyle() { return {textAlign: this.ctx.textAlign, font: this.ctx.font} as TextStyle}
	set textStyle(textStyle: TextStyle) {
		this.ctx.textAlign = coalesce(textStyle.textAlign, this.ctx.textAlign);
		this.ctx.font = coalesce(textStyle.font, this.ctx.font);
	}

	private constructor() {
		super();
		//* Get the body
		if (document.querySelector('body') == null) {
			throw new Error('Body element not found');
		}
		const body = document.querySelector('body')!;

		//* Create the canvas
		this.cnv = document.createElement('canvas');
		this.cnv.width = window.innerWidth;
		this.cnv.height = window.innerHeight;
		body.style.overflow = 'hidden';
		body.style.margin = '0px';
		console.log('Main canvas set')

		body.appendChild(this.cnv)
		this.ctx = this.cnv.getContext('2d')!;
		//tests
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
	safeDraw(drawStyle: DrawStyle, renderCallBack: Function) {
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

	//#region Draw
	/*addElement(element: CnvElement, zIndex = 0) {
		//todo add to both lists of record, the kv
	}
	getElement() {

	}
	removeElement(elementIndex: number) {

	}*/
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
			new Text(coordValuesSum(coord, -30, +3), unit.toString(), {textAlign: 'center'}).render()
			new Line(coord, coordValuesSum(coord, unit, 0)).render();
			coordValuesSum(coord, 0, 20);
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
//#endregion

//#region Coords functions
//? sum every coordinate
export function coordsSum(...coords: Coord[]) {
	return coords.reduce((acc, curr) => new Coord(acc.x + curr.x, acc.y + curr.y), new Coord(0, 0));
}
//? sum x/y to a coordinate
export function coordValuesSum(coord1: Coord, x: number, y: number) {
	return new Coord(coord1.x + x, coord1.y + y);
}
//? get the center of multiple points
export function coordsMiddle(...coords: Coord[]) {
	return new Coord(coordsSum(...coords).x/coords.length, coordsSum(...coords).y/coords.length);
}
//? x/y difference between multiple points
export function coordsSize(...coords: Coord[]) {
	const pivoted = arrPivot(coords);	
	const cMax = new Coord(Math.max(...pivoted.x), Math.max(...pivoted.y));
	const cMin = new Coord(Math.min(...pivoted.x), Math.min(...pivoted.y));
	return {width: Math.abs(cMax.x - cMin.x), height: Math.abs(cMax.y - cMin.y)} as Size;
}
//? diagonal distance between 2 points
export function coordDistance(coord1: Coord, coord2: Coord) {
	return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
}
//#endregion

//#region Others
export function baseColorToDec(colorName: BaseColor) {
	return BASECOLOR_DEC[colorName];
}
export function rgbObj(red: number | string, green: number | string, blue: number | string): RGB {
	return {red: red, green: green, blue: blue};
}
export function rgbaParse(rgbaStr: string): {rgb: RGB, a: number} {
	const [_, red, green, blue, alpha] = rgbaStr.match(RGBA_PATTERN).map(parseFloat);
	return {rgb: {red: red, green: green, blue: blue}, a: coalesce(alpha, 1)};
}
export function decToHex(dec: number) {
	return ('0'+ dec.toString(16).toUpperCase()).slice(-2);
}
export function hexToDec(hex: string) {
	return clamp(parseInt(hex, 16), 0, 255);
}
//#endregion