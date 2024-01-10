import { clamp, coalesce, hexToDec, decToHex } from '@gandolphinnn/utils';
import { MainCanvas } from './index.js';


//#region Types and Interfaces
/**
 * @example "10px Arial"
*/
export type Font = `${number}px ${string}`;
export type SubStyle = Color | CanvasGradient | CanvasPattern;
export type ColorName = 'AliceBlue' | 'AntiqueWhite' | 'Aqua' | 'Aquamarine' | 'Azure' | 'Beige' | 'Bisque' | 'Black' | 'BlanchedAlmond' | 'Blue' | 'BlueViolet' | 'Brown' | 'BurlyWood' | 'CadetBlue' | 'Chartreuse' | 'Chocolate' | 'Coral' | 'CornflowerBlue' | 'Cornsilk' | 'Crimson' | 'Cyan' | 'DarkBlue' | 'DarkCyan' | 'DarkGoldenRod' | 'DarkGrey' | 'DarkGreen' | 'DarkKhaki' | 'DarkMagenta' | 'DarkOliveGreen' | 'DarkOrange' | 'DarkOrchid' | 'DarkRed' | 'DarkSalmon' | 'DarkSeaGreen' | 'DarkSlateBlue' | 'DarkSlateGrey' | 'DarkTurquoise' | 'DarkViolet' | 'DeepPink' | 'DeepSkyBlue' | 'DimGrey' | 'DodgerBlue' | 'FireBrick' | 'FloralWhite' | 'ForestGreen' | 'Fuchsia' | 'Gainsboro' | 'GhostWhite' | 'Gold' | 'GoldenRod' | 'Grey' | 'Green' | 'GreenYellow' | 'HoneyDew' | 'HotPink' | 'IndianRed' | 'Indigo' | 'Ivory' | 'Khaki' | 'Lavender' | 'LavenderBlush' | 'LawnGreen' | 'LemonChiffon' | 'LightBlue' | 'LightCoral' | 'LightCyan' | 'LightGoldenRodYellow' | 'LightGrey' | 'LightGreen' | 'LightPink' | 'LightSalmon' | 'LightSeaGreen' | 'LightSkyBlue' | 'LightSlateGrey' | 'LightSteelBlue' | 'LightYellow' | 'Lime' | 'LimeGreen' | 'Linen' | 'Magenta' | 'Maroon' | 'MediumAquaMarine' | 'MediumBlue' | 'MediumOrchid' | 'MediumPurple' | 'MediumSeaGreen' | 'MediumSlateBlue' | 'MediumSpringGreen' | 'MediumTurquoise' | 'MediumVioletRed' | 'MidnightBlue' | 'MintCream' | 'MistyRose' | 'Moccasin' | 'NavajoWhite' | 'Navy' | 'OldLace' | 'Olive' | 'OliveDrab' | 'Orange' | 'OrangeRed' | 'Orchid' | 'PaleGoldenRod' | 'PaleGreen' | 'PaleTurquoise' | 'PaleVioletRed' | 'PapayaWhip' | 'PeachPuff' | 'Peru' | 'Pink' | 'Plum' | 'PowderBlue' | 'Purple' | 'RebeccaPurple' | 'Red' | 'RosyBrown' | 'RoyalBlue' | 'SaddleBrown' | 'Salmon' | 'SandyBrown' | 'SeaGreen' | 'SeaShell' | 'Sienna' | 'Silver' | 'SkyBlue' | 'SlateBlue' | 'SlateGrey' | 'Snow' | 'SpringGreen' | 'SteelBlue' | 'Tan' | 'Teal' | 'Thistle' | 'Tomato' | 'Turquoise' | 'Violet' | 'Wheat' | 'White' | 'WhiteSmoke' | 'Yellow' | 'YellowGreen'
export type RGBA = {
	red: number,
	green: number,
	blue: number
	alpha: number | null
}
//#endregion

//#region Color
export class Color {
	red: number;
	green: number;
	blue: number;
	alpha: number;

	get hexStr() { return `#${decToHex(this.red)}${decToHex(this.green)}${decToHex(this.blue)}` }
	get rgbaStr() { return `rgba(${this.red},${this.green},${this.blue},${this.alpha})` }
	get rgbaObj() { return {red: this.red, green: this.green, blue: this.blue, alpha: this.alpha} as RGBA }

	private constructor(rgba: RGBA, alpha?: number) {
		rgba.alpha = coalesce(alpha, rgba.alpha);
		rgba = clampRGBA(rgba);		
		this.red = rgba.red;
		this.green = rgba.green;
		this.blue = rgba.blue;
		this.alpha = rgba.alpha;
	}
	static byName(colorName: ColorName, alpha?: number) {
		return this.byObj(COLORNAME_RGB[colorName], alpha);
	}
	static byStr(string: string, alpha?: number) {
		return this.byObj(parseRGBA(string), alpha);
	}
	static byValues(red: number, green: number, blue: number, alpha?: number) {
		return this.byObj({red: red, green: green, blue: blue, alpha: alpha})
	}
	static byObj(rgba: RGBA, alpha?: number) {
		return new Color(rgba, alpha)
	}
}
//#endregion

//#region Style
export class Style {
	fillStyle?: SubStyle
	strokeStyle?: SubStyle
	lineWidth?: number
	/**
	 * @example "left" means the center is just to the left of the text
	*/
	textAlign?: CanvasTextAlign
	font?: Font
	constructor(fillStyle?: SubStyle, strokeStyle?: SubStyle, lineWidth?: number, textAlign?: CanvasTextAlign, font?: Font) {
		this.fillStyle = fillStyle;
		this.strokeStyle = strokeStyle;
		this.lineWidth = lineWidth;
		this.textAlign = textAlign;
		this.font = font;
	}
	/**
	 * undefined is for not specified values
	 * null is used to set to undefined
	 * keepNulls = true will set null to null
	 */
	private coalesceProperty(currVal: any, newVal: any, keepNulls: boolean) {
		switch (newVal) {
			case undefined:
				return currVal;
			case null:
				return keepNulls? null : undefined;
			default: newVal;
				break;
		}
	}
	//todo: are these 5 methods actually useful????
	//? YES -> keep them, make every property private and with a getter
	//? NO -> remove them, user will deal with its value on its own
	//? MAYBE -> keep them as a tool and keep every property public
	setFillStyle(newFillStyle: SubStyle, keepNulls = false) {
		this.fillStyle = this.coalesceProperty(this.fillStyle, newFillStyle, keepNulls);
		return this;
	}
	setStrokeStyle(newStrokeStyle: SubStyle, keepNulls = false) {
		this.strokeStyle = this.coalesceProperty(this.strokeStyle, newStrokeStyle, keepNulls);
		return this;
	}
	setLineWidth(newLineWidth: number, keepNulls = false) {
		this.lineWidth = this.coalesceProperty(this.lineWidth, newLineWidth, keepNulls);
		return this;
	}
	setTextAlign(newTextAlign: CanvasTextAlign, keepNulls = false) {
		this.textAlign = this.coalesceProperty(this.textAlign, newTextAlign, keepNulls);
		return this;
	}
	setFont(newFont: Font, keepNulls = false) {
		this.font = this.coalesceProperty(this.font, newFont, keepNulls);
		return this;
	}
	setWith(newStyle: Style, keepNulls = false) {
		this.setFillStyle(newStyle.fillStyle, keepNulls);
		this.setStrokeStyle(newStyle.strokeStyle, keepNulls);
		this.setLineWidth(newStyle.lineWidth, keepNulls);
		this.setTextAlign(newStyle.textAlign, keepNulls);
		this.setFont(newStyle.font, keepNulls);
		return this;
	}
	/**
	 * Apply this style to the MainCanvas ctx
	 */
	ctxApply() {
		const ctx = MainCanvas.get.ctx;
		ctx.fillStyle = getSubStyleValue(this.fillStyle);
		ctx.strokeStyle = getSubStyleValue(this.strokeStyle);
		ctx.lineWidth = this.lineWidth;
		ctx.textAlign = this.textAlign;
		ctx.font = this.font;
		return this;
	}
}
//#endregion

//#region Functions
/**
 * Clamp every RGBA color to [0,255] and aplha to [0, 1]
 */
export function clampRGBA(rgba: RGBA) {
	return {red: clamp(rgba.red, 0, 255), green: clamp(rgba.green, 0, 255), blue: clamp(rgba.blue, 0, 255), alpha: clamp(rgba.alpha, 0, 1)} as RGBA;
}
/**
 * Get the RGBA object from a string using multiple regex patterns. If invalid, return null
 */
export function parseRGBA(str: string) {
	let match = coalesce(str.match(RGBA_PATTERN), str.match(RGB_PATTERN), str.match(HEX_LONG_PATTERN), str.match(HEX_SHORT_PATTERN)) as RegExpMatchArray;
	
	if (!match) {
		return null;
	}
	const [_, red, green, blue, alpha] = match.map(match[0][0] == '#'? hexToDec : parseFloat);
	return clampRGBA({red: red, green: green, blue: blue, alpha: coalesce(alpha, 1)})
}
/**
 * If the style object is a Color, return its rgbaStr, otherwise return the object
 */
export function getSubStyleValue(style: SubStyle) {
	return style instanceof Color? style.rgbaStr : style
}
//#endregion

//#region Constants
export const COLORNAME_RGB: Record<ColorName, RGBA> = {
	'AliceBlue':			{red: 240,	green: 248,	blue: 255,	alpha: 1},
	'AntiqueWhite':			{red: 250,	green: 235,	blue: 215,	alpha: 1},
	'Aqua':					{red: 0,	green: 255,	blue: 255,	alpha: 1},
	'Aquamarine':			{red: 127,	green: 255,	blue: 212,	alpha: 1},
	'Azure':				{red: 240,	green: 255,	blue: 255,	alpha: 1},
	'Beige':				{red: 245,	green: 245,	blue: 220,	alpha: 1},
	'Bisque':				{red: 255,	green: 228,	blue: 196,	alpha: 1},
	'Black':				{red: 0,	green: 0,	blue: 0,	alpha: 1},
	'BlanchedAlmond':		{red: 255,	green: 235,	blue: 205,	alpha: 1},
	'Blue':					{red: 0,	green: 0,	blue: 255,	alpha: 1},
	'BlueViolet':			{red: 138,	green: 43,	blue: 226,	alpha: 1},
	'Brown':				{red: 165,	green: 42,	blue: 42,	alpha: 1},
	'BurlyWood':			{red: 222,	green: 184,	blue: 135,	alpha: 1},
	'CadetBlue':			{red: 95,	green: 158,	blue: 160,	alpha: 1},
	'Chartreuse':			{red: 127,	green: 255,	blue: 0,	alpha: 1},
	'Chocolate':			{red: 210,	green: 105,	blue: 30,	alpha: 1},
	'Coral':				{red: 255,	green: 127,	blue: 80,	alpha: 1},
	'CornflowerBlue':		{red: 100,	green: 149,	blue: 237,	alpha: 1},
	'Cornsilk':				{red: 255,	green: 248,	blue: 220,	alpha: 1},
	'Crimson':				{red: 220,	green: 20,	blue: 60,	alpha: 1},
	'Cyan':					{red: 0,	green: 255,	blue: 255,	alpha: 1},
	'DarkBlue':				{red: 0,	green: 0,	blue: 139,	alpha: 1},
	'DarkCyan':				{red: 0,	green: 139,	blue: 139,	alpha: 1},
	'DarkGoldenRod':		{red: 184,	green: 134,	blue: 11,	alpha: 1},
	'DarkGrey':				{red: 169,	green: 169,	blue: 169,	alpha: 1},
	'DarkGreen':			{red: 0,	green: 100,	blue: 0,	alpha: 1},
	'DarkKhaki':			{red: 189,	green: 183,	blue: 107,	alpha: 1},
	'DarkMagenta':			{red: 139,	green: 0,	blue: 139,	alpha: 1},
	'DarkOliveGreen':		{red: 85,	green: 107,	blue: 47,	alpha: 1},
	'DarkOrange':			{red: 255,	green: 140,	blue: 0,	alpha: 1},
	'DarkOrchid':			{red: 153,	green: 50,	blue: 204,	alpha: 1},
	'DarkRed':				{red: 139,	green: 0,	blue: 0,	alpha: 1},
	'DarkSalmon':			{red: 233,	green: 150,	blue: 122,	alpha: 1},
	'DarkSeaGreen':			{red: 143,	green: 188,	blue: 143,	alpha: 1},
	'DarkSlateBlue':		{red: 72,	green: 61,	blue: 139,	alpha: 1},
	'DarkSlateGrey':		{red: 47,	green: 79,	blue: 79,	alpha: 1},
	'DarkTurquoise':		{red: 0,	green: 206,	blue: 209,	alpha: 1},
	'DarkViolet':			{red: 148,	green: 0,	blue: 211,	alpha: 1},
	'DeepPink':				{red: 255,	green: 20,	blue: 147,	alpha: 1},
	'DeepSkyBlue':			{red: 0,	green: 191,	blue: 255,	alpha: 1},
	'DimGrey':				{red: 105,	green: 105,	blue: 105,	alpha: 1},
	'DodgerBlue':			{red: 30,	green: 144,	blue: 255,	alpha: 1},
	'FireBrick':			{red: 178,	green: 34,	blue: 34,	alpha: 1},
	'FloralWhite':			{red: 255,	green: 250,	blue: 240,	alpha: 1},
	'ForestGreen':			{red: 34,	green: 139,	blue: 34,	alpha: 1},
	'Fuchsia':				{red: 255,	green: 0,	blue: 255,	alpha: 1},
	'Gainsboro':			{red: 220,	green: 220,	blue: 220,	alpha: 1},
	'GhostWhite':			{red: 248,	green: 248,	blue: 255,	alpha: 1},
	'Gold':					{red: 255,	green: 215,	blue: 0,	alpha: 1},
	'GoldenRod':			{red: 218,	green: 165,	blue: 32,	alpha: 1},
	'Grey':					{red: 128,	green: 128,	blue: 128,	alpha: 1},
	'Green':				{red: 0,	green: 128,	blue: 0,	alpha: 1},
	'GreenYellow':			{red: 173,	green: 255,	blue: 47,	alpha: 1},
	'HoneyDew':				{red: 240,	green: 255,	blue: 240,	alpha: 1},
	'HotPink':				{red: 255,	green: 105,	blue: 180,	alpha: 1},
	'IndianRed':			{red: 205,	green: 92,	blue: 92,	alpha: 1},
	'Indigo':				{red: 75,	green: 0,	blue: 130,	alpha: 1},
	'Ivory':				{red: 255,	green: 255,	blue: 240,	alpha: 1},
	'Khaki':				{red: 240,	green: 230,	blue: 140,	alpha: 1},
	'Lavender':				{red: 230,	green: 230,	blue: 250,	alpha: 1},
	'LavenderBlush':		{red: 255,	green: 240,	blue: 245,	alpha: 1},
	'LawnGreen':			{red: 124,	green: 252,	blue: 0,	alpha: 1},
	'LemonChiffon':			{red: 255,	green: 250,	blue: 205,	alpha: 1},
	'LightBlue':			{red: 173,	green: 216,	blue: 230,	alpha: 1},
	'LightCoral':			{red: 240,	green: 128,	blue: 128,	alpha: 1},
	'LightCyan':			{red: 224,	green: 255,	blue: 255,	alpha: 1},
	'LightGoldenRodYellow':	{red: 250,	green: 250,	blue: 210,	alpha: 1},
	'LightGrey':			{red: 211,	green: 211,	blue: 211,	alpha: 1},
	'LightGreen':			{red: 144,	green: 238,	blue: 144,	alpha: 1},
	'LightPink':			{red: 255,	green: 182,	blue: 193,	alpha: 1},
	'LightSalmon':			{red: 255,	green: 160,	blue: 122,	alpha: 1},
	'LightSeaGreen':		{red: 32,	green: 178,	blue: 170,	alpha: 1},
	'LightSkyBlue':			{red: 135,	green: 206,	blue: 250,	alpha: 1},
	'LightSlateGrey':		{red: 119,	green: 136,	blue: 153,	alpha: 1},
	'LightSteelBlue':		{red: 176,	green: 196,	blue: 222,	alpha: 1},
	'LightYellow':			{red: 255,	green: 255,	blue: 224,	alpha: 1},
	'Lime':					{red: 0,	green: 255,	blue: 0,	alpha: 1},
	'LimeGreen':			{red: 50,	green: 205,	blue: 50,	alpha: 1},
	'Linen':				{red: 250,	green: 240,	blue: 230,	alpha: 1},
	'Magenta':				{red: 255,	green: 0,	blue: 255,	alpha: 1},
	'Maroon':				{red: 128,	green: 0,	blue: 0,	alpha: 1},
	'MediumAquaMarine':		{red: 102,	green: 205,	blue: 170,	alpha: 1},
	'MediumBlue':			{red: 0,	green: 0,	blue: 205,	alpha: 1},
	'MediumOrchid':			{red: 186,	green: 85,	blue: 211,	alpha: 1},
	'MediumPurple':			{red: 147,	green: 112,	blue: 219,	alpha: 1},
	'MediumSeaGreen':		{red: 60,	green: 179,	blue: 113,	alpha: 1},
	'MediumSlateBlue':		{red: 123,	green: 104,	blue: 238,	alpha: 1},
	'MediumSpringGreen':	{red: 0,	green: 250,	blue: 154,	alpha: 1},
	'MediumTurquoise':		{red: 72,	green: 209,	blue: 204,	alpha: 1},
	'MediumVioletRed':		{red: 199,	green: 21,	blue: 133,	alpha: 1},
	'MidnightBlue':			{red: 25,	green: 25,	blue: 112,	alpha: 1},
	'MintCream':			{red: 245,	green: 255,	blue: 250,	alpha: 1},
	'MistyRose':			{red: 255,	green: 228,	blue: 225,	alpha: 1},
	'Moccasin':				{red: 255,	green: 228,	blue: 181,	alpha: 1},
	'NavajoWhite':			{red: 255,	green: 222,	blue: 173,	alpha: 1},
	'Navy':					{red: 0,	green: 0,	blue: 128,	alpha: 1},
	'OldLace':				{red: 253,	green: 245,	blue: 230,	alpha: 1},
	'Olive':				{red: 128,	green: 128,	blue: 0,	alpha: 1},
	'OliveDrab':			{red: 107,	green: 142,	blue: 35,	alpha: 1},
	'Orange':				{red: 255,	green: 165,	blue: 0,	alpha: 1},
	'OrangeRed':			{red: 255,	green: 69,	blue: 0,	alpha: 1},
	'Orchid':				{red: 218,	green: 112,	blue: 214,	alpha: 1},
	'PaleGoldenRod':		{red: 238,	green: 232,	blue: 170,	alpha: 1},
	'PaleGreen':			{red: 152,	green: 251,	blue: 152,	alpha: 1},
	'PaleTurquoise':		{red: 175,	green: 238,	blue: 238,	alpha: 1},
	'PaleVioletRed':		{red: 219,	green: 112,	blue: 147,	alpha: 1},
	'PapayaWhip':			{red: 255,	green: 239,	blue: 213,	alpha: 1},
	'PeachPuff':			{red: 255,	green: 218,	blue: 185,	alpha: 1},
	'Peru':					{red: 205,	green: 133,	blue: 63,	alpha: 1},
	'Pink':					{red: 255,	green: 192,	blue: 203,	alpha: 1},
	'Plum':					{red: 221,	green: 160,	blue: 221,	alpha: 1},
	'PowderBlue':			{red: 176,	green: 224,	blue: 230,	alpha: 1},
	'Purple':				{red: 128,	green: 0,	blue: 128,	alpha: 1},
	'RebeccaPurple':		{red: 102,	green: 51,	blue: 153,	alpha: 1},
	'Red':					{red: 255,	green: 0,	blue: 0,	alpha: 1},
	'RosyBrown':			{red: 188,	green: 143,	blue: 143,	alpha: 1},
	'RoyalBlue':			{red: 65,	green: 105,	blue: 225,	alpha: 1},
	'SaddleBrown':			{red: 139,	green: 69,	blue: 19,	alpha: 1},
	'Salmon':				{red: 250,	green: 128,	blue: 114,	alpha: 1},
	'SandyBrown':			{red: 244,	green: 164,	blue: 96,	alpha: 1},
	'SeaGreen':				{red: 46,	green: 139,	blue: 87,	alpha: 1},
	'SeaShell':				{red: 255,	green: 245,	blue: 238,	alpha: 1},
	'Sienna':				{red: 160,	green: 82,	blue: 45,	alpha: 1},
	'Silver':				{red: 192,	green: 192,	blue: 192,	alpha: 1},
	'SkyBlue':				{red: 135,	green: 206,	blue: 235,	alpha: 1},
	'SlateBlue':			{red: 106,	green: 90,	blue: 205,	alpha: 1},
	'SlateGrey':			{red: 112,	green: 128,	blue: 144,	alpha: 1},
	'Snow':					{red: 255,	green: 250,	blue: 250,	alpha: 1},
	'SpringGreen':			{red: 0,	green: 255,	blue: 127,	alpha: 1},
	'SteelBlue':			{red: 70,	green: 130,	blue: 180,	alpha: 1},
	'Tan':					{red: 210,	green: 180,	blue: 140,	alpha: 1},
	'Teal':					{red: 0,	green: 128,	blue: 128,	alpha: 1},
	'Thistle':				{red: 216,	green: 191,	blue: 216,	alpha: 1},
	'Tomato':				{red: 255,	green: 99,	blue: 71,	alpha: 1},
	'Turquoise':			{red: 64,	green: 224,	blue: 208,	alpha: 1},
	'Violet':				{red: 238,	green: 130,	blue: 238,	alpha: 1},
	'Wheat':				{red: 245,	green: 222,	blue: 179,	alpha: 1},
	'White':				{red: 255,	green: 255,	blue: 255,	alpha: 1},
	'WhiteSmoke':			{red: 245,	green: 245,	blue: 245,	alpha: 1},
	'Yellow':				{red: 255,	green: 255,	blue: 0,	alpha: 1},
	'YellowGreen':			{red: 154,	green: 205,	blue: 50,	alpha: 1}
}

export const HEX_LONG_PATTERN: RegExp = /^\#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
export const HEX_SHORT_PATTERN: RegExp = /^\#([0-9a-fA-F])([0-9a-fA-F])([0-9a-fA-F])$/
export const RGB_PATTERN: RegExp = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/
export const RGBA_PATTERN: RegExp = /^rgba\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*([01](?:\.\d+)?)\))?$/

export const COLOR_DEFAULT	= Color.byName('Black');
export const STYLE_DEFAULT	= new Style(COLOR_DEFAULT, COLOR_DEFAULT, 1, 'center', '10px Arial');
export const STYLE_EMPTY	= new Style();
//#endregion