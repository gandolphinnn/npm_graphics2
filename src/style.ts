import { Color, COLOR_DEFAULT } from './color';

export type SubStyle = Color | CanvasGradient | CanvasPattern;

/**
 * Defines the style of a CnvElement.
 * 
 * ### Text Alignment
 * @warning the textAlign property is counter-intuitive in plain JavaScript:
 * "left" means the center is just to the left of the text
 * 
 * ### SubStyle
 * A SubStyle is a Color, CanvasGradient or CanvasPattern.
 * Is used to define the fillStyle and strokeStyle properties.
 * 
 * For conversion to and from CanvasRenderingContext2D valid values, use the fillStyleVal and strokeStyleVal properties.
 * 
 * ### Merge Methods
 * "set" methods just set the property, while "merge" methods will perform merging logic:
 * - UNDEFINED is for not specified values, so nothing will be changed
 * - NULL is used to set the value to undefined, so the value will be removed
 * - A valid value will be set normally
 */
export class Style {
	fillStyle?: SubStyle
	strokeStyle?: SubStyle
	lineWidth?: number
	/**
	 * @warning "left" means the center is just to the left of the text
	*/
	textAlign?: CanvasTextAlign
	font?: string

	get fillStyleVal() { return Style.subStyleToValue(this.fillStyle) }
	set fillStyleVal(subStyleValue: string | CanvasGradient | CanvasPattern) { this.fillStyle = Style.valueToSubStyle(subStyleValue) }
	get strokeStyleVal() { return Style.subStyleToValue(this.strokeStyle) }
	set strokeStyleVal(subStyleValue: string | CanvasGradient | CanvasPattern) { this.strokeStyle = Style.valueToSubStyle(subStyleValue) }

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
	 */
	private mergeProperty(currVal: any, newVal: any) {
		switch (newVal) {
			case undefined:
				return currVal;
			case null:
				return undefined;
			default: newVal;
				return newVal;
		}
	}
	mergeFillStyle(newFillStyle: SubStyle) {
		this.fillStyle = this.mergeProperty(this.fillStyleVal, newFillStyle);
		return this;
	}
	setFillStyle(newFillStyle: SubStyle) {
		this.fillStyle = newFillStyle;
		return this;
	}
	mergeStrokeStyle(newStrokeStyle: SubStyle) {
		this.strokeStyle = this.mergeProperty(this.strokeStyleVal, newStrokeStyle);
		return this;
	}
	setStrokeStyle(newStrokeStyle: SubStyle) {
		this.strokeStyle = newStrokeStyle;
		return this;
	}
	mergeLineWidth(newLineWidth: number) {
		this.lineWidth = this.mergeProperty(this.lineWidth, newLineWidth);
		return this;
	}
	setLineWidth(newLineWidth: number) {
		this.lineWidth = newLineWidth;
		return this;
	}
	mergeTextAlign(newTextAlign: CanvasTextAlign) {
		this.textAlign = this.mergeProperty(this.textAlign, newTextAlign);
		return this;
	}
	setTextAlign(newTextAlign: CanvasTextAlign) {
		this.textAlign = newTextAlign;
		return this;
	}
	mergeFont(newFont: string) {
		this.font = this.mergeProperty(this.font, newFont);
		return this;
	}
	setFont(newFont: string) {
		this.font = newFont;
		return this;
	}
	mergeWith(newStyle: Style) {
		this.mergeFillStyle(newStyle.fillStyle);
		this.mergeStrokeStyle(newStyle.strokeStyle);
		this.mergeLineWidth(newStyle.lineWidth);
		this.mergeTextAlign(newStyle.textAlign);
		this.mergeFont(newStyle.font);
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
	
	/**
	 * If the style object is a Color, return its rgbaStr, otherwise return the object
	 */
	static subStyleToValue(style: SubStyle): string | CanvasGradient | CanvasPattern {
		return style instanceof Color? style.rgbaStr : style;
	}
	/**
	 * If the style object is a Color, return its rgbaStr, otherwise return the object
	 */
	static valueToSubStyle(value: string | CanvasGradient | CanvasPattern): SubStyle {
		return typeof value == 'string'? Color.byStr(value) : value;
	}
}

/**
 * @WARNING don't assing anything to this, instead use "Style.default()"
 * @WARNING changing this constant's properties will impact every future call to Style.default()
*/
export const STYLE_DEFAULT	= new Style(COLOR_DEFAULT, COLOR_DEFAULT, 1, 'center', '10px Arial');