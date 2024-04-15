import { overflow } from "@gandolphinnn/utils";
import Enumerable from 'linq';
import { Style } from "./style";
import { Angle, Coord, Size } from "./basics";
import { Component, MainCanvas } from "./index";

export enum RenderAction {
	None, Stroke, Fill, Both
}

export abstract class CnvElement {
	action: RenderAction;
	style: Style = Style.empty();
	zIndex = 0;

	protected _center: Coord;
	get center() { return this._center }
	set center(center: Coord) { this._center = center }

	constructor(action: RenderAction, center: Coord) {
		this.action = action;
		this._center = center;
	}
	moveBy(x: number, y: number) {
		//? keep it like this to trigger the setter
		this.center = this.center.sumXY(x, y)
		return this;
	}
	setZ(zIndex: number) {
		this.zIndex = zIndex;
		return this;
	}
	setAction(action: RenderAction) {
		this.action = action;
		return this;
	}
	
	abstract render(drawPoints: boolean): CnvElement;
	protected execAction() {
		if (this.action == RenderAction.Both || this.action == RenderAction.Fill) {
			MainCanvas.ctx.fill();
		}
		if (this.action == RenderAction.Both || this.action == RenderAction.Stroke) {
			MainCanvas.ctx.stroke();
		}
		MainCanvas.ctx.closePath();
	}
	protected drawPoints(points: Coord[] = []) {
		[this.center, ...points].forEach(point => {
			MainCanvas.drawPoint(point);
		});
	}
}
/**
 * A collection of CnvElements
 */
export class Mesh extends CnvElement implements Component {
	items: Enumerable.IEnumerable<CnvElement>;
	zIndex: number;
	visible: boolean = true;
	
	get center() { return this._center }
	set center(center: Coord) {
		const diff = Coord.difference(center, this.center);
		this.moveBy(diff.x, diff.y);
	}
	constructor(center: Coord, ...items: CnvElement[]) {
		super(RenderAction.Both, center);
		this.items = Enumerable.from(items);
	}
	moveBy(x: number, y: number) {
		//? keep it like this to trigger the setter
		this.center.sumXY(x, y);
		this.items.forEach(item => {
			item.moveBy(x, y);
		});
		return this;
	}
	update(drawPoints = false) {
		if (this.visible) {
			this.items.orderBy(elem => elem.zIndex).forEach(item => {
				item.render(drawPoints);
			});
		}
		if(drawPoints) MainCanvas.drawPoint(this.center);
	}
	render(drawPoints = false) {
		this.update(drawPoints);
		return this;
	}
}
export class Text extends CnvElement {
	content: string;

	constructor(center: Coord, content: string) {
		super(RenderAction.Fill, center);
		this.content = content;
	}
	render(drawPoints = false) {
		MainCanvas.write(this.style, () => {
			if (this.action == RenderAction.Both || this.action == RenderAction.Fill) {
				MainCanvas.ctx.fillText(this.content, this.center.x, this.center.y);
			}
			if (this.action == RenderAction.Both || this.action == RenderAction.Stroke) {
				MainCanvas.ctx.strokeText(this.content, this.center.x, this.center.y);
			}
		})
		if(drawPoints) this.drawPoints();
		return this;
	}
}
export abstract class CnvDrawing extends CnvElement {
	constructor(action: RenderAction, center: Coord) {
		super(action, center);
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
	/**
	 * return a NEW COORD based on the 2 points
	 */
	get center() { return Coord.center(...this.points)}
	set center(center: Coord) {
		const diff = Coord.difference(center, this.center)
		this._center = center;
		this.points[0].sumXY(diff.x, diff.y)
		this.points[1].sumXY(diff.x, diff.y)
	}
	render(drawPoints = false) {
		MainCanvas.draw(this.style, () => {
			MainCanvas.ctx.beginPath();
			MainCanvas.ctx.moveTo(this.points[0].x, this.points[0].y);
			MainCanvas.ctx.lineTo(this.points[1].x, this.points[1].y);
			this.execAction();
		});
		if(drawPoints) this.drawPoints(this.points);
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
		MainCanvas.draw(this.style, () => {
			MainCanvas.ctx.beginPath();
			MainCanvas.ctx.rect(this.points[0].x, this.points[0].y, this.size.width, this.size.height);
			this.execAction();
		});
		drawPoints? this.drawPoints(this.points) : null;
		return this;
	}
}
export class Poly extends CnvDrawing {
	points: Coord[];

	get lines() {
		let lines: Line[] = [];
		if(this.points.length < 2) return lines;
		for (let i = 1; i < this.points.length; i++) {
			lines.push(new Line(this.points[i-1], this.points[i]));
		}
		lines.push(new Line(this.points.last(), this.points[0]))
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
		const diff = Coord.difference(center, this.center)
		this._center = center;
		this.points.forEach(point => {
			point.sumXY(diff.x, diff.y)
		});
	}
	constructor(...points: Coord[]) {
		super(RenderAction.Both, Coord.center(...points));
		this.points = points;
	}
	/**
	 * Return the point with the selected index performing and overflow
	 */
	getPoint(index: number) { return this.points[overflow(index, 0, this.points.length-1)] }

	render(drawPoints = false) {
		MainCanvas.draw(this.style, () => {
			MainCanvas.ctx.beginPath();
			MainCanvas.ctx.moveTo(this.points[0].x, this.points[0].y);
			this.points.forEach(point => {
				MainCanvas.ctx.lineTo(point.x, point.y)
			});
			MainCanvas.ctx.closePath();
			this.execAction();
		});
		if(drawPoints) this.drawPoints(this.points);
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
		MainCanvas.draw(this.style, () => {
			MainCanvas.ctx.beginPath();
			MainCanvas.ctx.arc(this.center.x, this.center.y, this.radius, 0, 2 * Math.PI);
			this.execAction();
		});
		if(drawPoints) this.drawPoints();
		return this;
	}
}
//? Goes through the center
export class CircleSector extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	counterClockwise: boolean;

	get theta() { return new Angle(this.counterClockwise? this.end.degrees - this.start.degrees: this.start.degrees - this.end.degrees) }

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle, end: Angle, counterClockwise = true) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.counterClockwise = counterClockwise;
	}
	render(drawPoints = false) {
		MainCanvas.draw(this.style, () => {
			MainCanvas.ctx.beginPath();
			MainCanvas.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.counterClockwise);
			MainCanvas.ctx.lineTo(this.center.x, this.center.y);
			MainCanvas.ctx.closePath()
			this.execAction();
		});
		if(drawPoints) this.drawPoints();
		return this;
	}
}
export class CircleSlice extends CnvDrawing {
	radius: number;
	start: Angle;
	end: Angle;
	counterClockwise: boolean;

	get theta() { return new Angle(this.counterClockwise? this.end.degrees - this.start.degrees: this.start.degrees - this.end.degrees) }

	get diameter() { return this.radius * 2 }
	set diameter(diameter: number) { this.radius = diameter / 2 }

	constructor(center: Coord, radius: number, start: Angle, end: Angle, counterClockwise = true) {
		super(RenderAction.Both, center);
		this.radius = radius;
		this.start = start; 
		this.end = end; 
		this.counterClockwise = counterClockwise;
	}
	render(drawPoints = false) {
		MainCanvas.draw(this.style, () => {
			MainCanvas.ctx.beginPath();
			MainCanvas.ctx.arc(this.center.x, this.center.y, this.radius, this.start.radians, this.end.radians, this.counterClockwise);
			MainCanvas.ctx.closePath()
			this.execAction();
		});
		if(drawPoints) this.drawPoints();
		return this;
	}
}