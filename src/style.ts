import { Color, COLOR_DEFAULT } from './color';

export type SubStyle = Color | CanvasGradient | CanvasPattern;

export class Style {
	fillStyle?: SubStyle
	strokeStyle?: SubStyle
	lineWidth?: number
	/**
	 * @example "left" means the center is just to the left of the text
	*/
	textAlign?: CanvasTextAlign
	font?: string

	get fillStyleVal() { return getSubStyleValue(this.fillStyle) }
	set fillStyleVal(subStyleValue: string | CanvasGradient | CanvasPattern) { this.fillStyle = setSubStyleValue(subStyleValue) }
	get strokeStyleVal() { return getSubStyleValue(this.strokeStyle) }
	set strokeStyleVal(subStyleValue: string | CanvasGradient | CanvasPattern) { this.strokeStyle = setSubStyleValue(subStyleValue) }

	constructor(fillStyle?: SubStyle, strokeStyle?: SubStyle, lineWidth?: number, textAlign?: CanvasTextAlign, font?: string) {
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
	private mergeProperty(currVal: any, newVal: any, keepNulls: boolean) {
		switch (newVal) {
			case undefined:
				return currVal;
			case null:
				return keepNulls? null : undefined;
			default: newVal;
				return newVal;
		}
	}
	mergeFillStyle(newFillStyle: SubStyle, keepNulls = false) {
		this.fillStyle = this.mergeProperty(this.fillStyleVal, newFillStyle, keepNulls);
		return this;
	}
	mergeStrokeStyle(newStrokeStyle: SubStyle, keepNulls = false) {
		this.strokeStyle = this.mergeProperty(this.strokeStyleVal, newStrokeStyle, keepNulls);
		return this;
	}
	mergeLineWidth(newLineWidth: number, keepNulls = false) {
		this.lineWidth = this.mergeProperty(this.lineWidth, newLineWidth, keepNulls);
		return this;
	}
	mergeTextAlign(newTextAlign: CanvasTextAlign, keepNulls = false) {
		this.textAlign = this.mergeProperty(this.textAlign, newTextAlign, keepNulls);
		return this;
	}
	mergeFont(newFont: string, keepNulls = false) {
		this.font = this.mergeProperty(this.font, newFont, keepNulls);
		return this;
	}
	mergeWith(newStyle: Style, keepNulls = false) {
		this.mergeFillStyle(newStyle.fillStyle, keepNulls);
		this.mergeStrokeStyle(newStyle.strokeStyle, keepNulls);
		this.mergeLineWidth(newStyle.lineWidth, keepNulls);
		this.mergeTextAlign(newStyle.textAlign, keepNulls);
		this.mergeFont(newStyle.font, keepNulls);
		return this;
	}
	static from(...style: Style[]) {
		return style.reduce(
			(acc, curr) => acc.mergeWith(curr),
			new Style()
		)
	}
	static empty() {
		return new Style();
	}
	static default() {
		return Style.from(STYLE_DEFAULT);
	}
}

/**
 * If the style object is a Color, return its rgbaStr, otherwise return the object
 */
export function getSubStyleValue(style: SubStyle): string | CanvasGradient | CanvasPattern {
	return style instanceof Color? style.rgbaStr : style;
}
/**
 * If the style object is a Color, return its rgbaStr, otherwise return the object
 */
export function setSubStyleValue(value: string | CanvasGradient | CanvasPattern): SubStyle {
	return typeof value == 'string'? Color.byStr(value) : value;
}

/**
 * @WARNING don't assing anything to this, instead use "Style.default()"
 * @WARNING changing this constant's properties will impact every future call to Style.default()
*/
export const STYLE_DEFAULT	= new Style(COLOR_DEFAULT, COLOR_DEFAULT, 1, 'center', '10px Arial');