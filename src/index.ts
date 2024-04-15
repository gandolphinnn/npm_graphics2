import { clamp, Singleton, isNull } from '@gandolphinnn/utils';
import { Color, ColorName, COLORNAME_RGBA } from './color';
import { Style } from './style';
import { Angle, Coord } from './basics';
import { Circle, Line, Poly, Rect, RenderAction, Text } from './elements';

export * from './color';
export * from './style';
export * from './basics';
export * from './elements';

export interface Component { //? This will be useful later, in rigid2 and game2
	start?(): void;
	update?(): void;
}

export class MainCanvas extends Singleton {
	static get get() { return this.singletonInstance as MainCanvas }

	readonly cnv: HTMLCanvasElement;
	readonly ctx: CanvasRenderingContext2D;
	
	_center: Coord;
	get center() { return this._center }
	
	drawStyle = Style.default();
	writeStyle = Style.default();

	get bgColor() { return Color.byStr(this.cnv.style.backgroundColor) }
	set bgColor(color: Color) { this.cnv.style.backgroundColor = color.rgbaStr }

	private constructor() {
		super();
		const body = document.querySelector('body')!;
		this.cnv = body.querySelectorAll('canvas')[0];

		if (isNull(this.cnv)) {
			body.innerHTML = '';
			this.cnv = document.createElement('canvas');
			this.cnv.width = window.innerWidth;
			this.cnv.height = window.innerHeight;
			body.style.overflow = 'hidden';
			body.style.margin = '0px';
			body.appendChild(this.cnv);
		}
		
		this.ctx = this.cnv.getContext('2d')!;
		this._center = new Coord(this.cnv.width / 2, this.cnv.height / 2);
		console.log('Main canvas set');
	}

	/**
	 * Clear the entire canvas
	 */
	clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	/**
	 * Save the context, apply the style, execute the callback and restore the context
	 */
	draw(drawStyle: Style, renderCallBack: Function) {
		this.ctx.save();		
		const toApply = Style.from(this.drawStyle, drawStyle);
		this.ctx.fillStyle = toApply.fillStyleVal;
		this.ctx.strokeStyle = toApply.strokeStyleVal;
		this.ctx.lineWidth = toApply.lineWidth;
		renderCallBack();
		this.ctx.restore();
	}
	write(writeStyle: Style, renderCallBack: Function) {
		this.ctx.save();		
		const toApply = Style.from(this.writeStyle, writeStyle);
		this.ctx.fillStyle = toApply.fillStyleVal;
		this.ctx.strokeStyle = toApply.strokeStyleVal;
		this.ctx.lineWidth = toApply.lineWidth;
		this.ctx.textAlign = toApply.textAlign;
		this.ctx.font = toApply.font;
		renderCallBack();
		this.ctx.restore();
	}

	drawPoint(point: Coord) {
		POINT_DEFAULT.center = point.copy();
		POINT_DEFAULT.render();
	}
	drawSampleColors() {
		const scale = 100;
		const whiteTextThreshold = 250;
		const colors = Object.keys(COLORNAME_RGBA);
		const maxY = Math.floor(this.cnv.width / scale);
		let x: number, y: number;
		const rect = new Rect(Coord.default, {height:scale, width: scale});
		const text = new Text(Coord.default, 'asd');
		text.style.mergeFont('10px Arial');
		for (let i = 0; i < colors.length; i++) {
			y = Math.floor(i/maxY);
			x = i % maxY;
			const color = Color.byName(colors[i] as ColorName);
			rect.center = new Coord(x*scale+scale/2, y*scale+scale/2);
			rect.style.mergeFillStyle(color);
			rect.render();
			text.center = new Coord(x*scale+scale/2, y*scale+scale/2);
			text.style.mergeFillStyle(color.red + color.green + color.blue < whiteTextThreshold? Color.byName('White') : Color.byName('Black'))	;
			text.content = colors[i];
			text.render();
		}
	}
	drawSampleUnits(...testUnits: number[]) {		
		let sampleUnits = [...new Set([1, 5, 10, 50, 100, 250, 500, 1000, ...testUnits])]
							.filter(v => v > 0)
							.sort((a, b) => a-b);
		let coord = new Coord(this.center.x - 500, this.center.y - (30 * sampleUnits.length / 2));

		const line = new Line(Coord.default, Coord.default);
		line.style.mergeLineWidth(4);
		const text = new Text(coord, '');
		text.style.mergeFont('20px Arial').mergeTextAlign('right');
		sampleUnits.forEach(unit => {
			testUnits.indexOf(unit) != -1 ? line.style.mergeStrokeStyle(Color.byName('Red')) : line.style.mergeStrokeStyle(Color.byName('Black'));
			line.points[0] = Coord.sumXY(coord, 10, 0);
			line.points[1] = Coord.sumXY(coord, unit + 10, 0);
			text.content = unit.toString();
			line.render()
			text.render(); 
			coord.sumXY(0, 30);
		});
	}
	drawSampleMetric(scale = 50) {
		scale = clamp(scale, 25, Infinity);

		const line = new Line(Coord.default, new Coord(0, this.cnv.height));
		line.style.mergeLineWidth(1).mergeStrokeStyle(Color.byName('Black', .3));
		const text = new Text(new Coord(0, 10), '');
		text.style.mergeTextAlign('right').mergeFillStyle(Color.byName('Black', .5));
		
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical lines
			line.center = new Coord(x, this.center.y);
			line.render();
			text.center = new Coord(x-3, 10);
			text.content = x.toString();
			text.render();
		}

		line.points = [Coord.default, new Coord(this.cnv.width, 0)];
		text.style.mergeTextAlign('left');

		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal lines
			line.center = new Coord(this.center.x, y);
			line.center.x = this.center.x;
			line.render();
			text.center = new Coord(5, y-5);
			text.content = y.toString();
			text.render();
		}
		//new Circle(this.center, 5).render();
	}
	drawTriangle(center: Coord, size: number, angle: Angle) {
		let points = Coord.regularSpread(center, 3, size);
		points = Coord.rotate(center, angle, ...points);
		new Poly(...points).render();
	}
}

const POINT_DEFAULT = new Circle(Coord.default, 3).setAction(RenderAction.Fill);
	POINT_DEFAULT.style.mergeFillStyle(Color.byName('Black'));