import { arrPivot, overflow } from "@gandolphinnn/utils";
import Enumerable from 'linq';
import { Circle, MainCanvas } from "./index";

export type Size = {
	width: number;
	height: number;
}

export class Coord {
	x: number;
	y: number;

	/**
	 * Check if the coordinate is visible on the canvas
	 */
	get isVisible() {
		return this.x >= 0
			&& this.y >= 0
			&& this.x <= MainCanvas.cnv.width
			&& this.y <= MainCanvas.cnv.height
	}

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Return a new Coord with the same x and y
	 */
	copy() { return new Coord(this.x, this.y) }
	/**
	 * Sum x/y to THIS coordinate
	 */
	sumXY(x: number, y: number) {
		this.x += x;
		this.y += y;
		return this;
	}
	/**
	 * Get a default coordinate (0, 0)
	 */
	static get origin() {
		return new Coord(0, 0);
	}
	/**
	 * Get a new coordinate with the sum of x/y
	 */
	static sumXY(coord: Coord, x: number, y: number) {
		return new Coord(coord.x + x, coord.y + y)
	}
	/**
	 * Sum every coordinate
	 */
	static sum(...coords: Coord[]) {
		return coords.reduce((acc, curr) => new Coord(acc.x + curr.x, acc.y + curr.y), Coord.origin);
	}
	/**
	 * Get the center of multiple coordinates
	 */
	static center(...coords: Coord[]) {
		return new Coord(this.sum(...coords).x/coords.length, this.sum(...coords).y/coords.length);
	}
	/**
	 * The x/y difference between 2 points. Order matters
	 */
	static difference(coord1: Coord, coord2: Coord) {
		return {x: coord1.x - coord2.x, y: coord1.y - coord2.y};
	}
	/**
	 * The width/height size of an area defined by multiple points
	 */
	static size(...coords: Coord[]) {
		const pivoted: { x: number[], y: number[] } = arrPivot(coords);	
		const cMax = new Coord(Math.max(...pivoted.x), Math.max(...pivoted.y));
		const cMin = new Coord(Math.min(...pivoted.x), Math.min(...pivoted.y));
		return {width: Math.abs(cMax.x - cMin.x), height: Math.abs(cMax.y - cMin.y)} as Size;
	}
	/**
	 * Diagonal distance between 2 points
	 */
	static distance(coord1: Coord, coord2: Coord) {
		return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
	}
	/**
	 * Rotate some coordinates around a center by an angle
	 */
	static rotate(center: Coord, angle: Angle, ...coords: Coord[]): Coord[] {
		return coords.map(coord => {
			const x = center.x + (coord.x - center.x) * angle.cos - (coord.y - center.y) * angle.sin;
			const y = center.y + (coord.x - center.x) * angle.sin + (coord.y - center.y) * angle.cos;
			return new Coord(x, y);
		});
	}
	/**
	 * Generate the coordinates of all the points of a regular polygon
	 */
	static regularPoly(center: Coord, numberOfCoord: number, distance: number) {
		const angle = 2 * Math.PI / numberOfCoord;
		return Enumerable.range(0, numberOfCoord).select(i => new Coord(Math.cos(i * angle) * distance + center.x, Math.sin(i * angle) * distance + center.y)).toArray();
	}
	/**
	 * Get the circle that encircles all the points
	 */
	static encircle(...points: Coord[]) {
		let maxDist = -1;
		let center: Coord;
		for (let i = 0; i < points.length; i++) {
			const p1 = points[i];
			const p2 = points[overflow(i + 1, 0, points.length)];
			const distance = this.distance(p1, p2);
			if (distance > maxDist) {
				maxDist = distance;
				center = this.center(p1, p2);
			}
		}
		return new Circle(center, maxDist / 2);
	}
	/**
	 * Generate the coordinates of all the points of a star
	 */
	static starPoints(center: Coord, radius: number, points: number, innerRadius: number) {
		const angle = Math.PI / points;
		const coords = [];
		for (let i = 0; i < 2 * points; i++) {
			const r = i % 2 == 0 ? radius : innerRadius;
			coords.push(new Coord(center.x + r * Math.cos(i * angle), center.y + r * Math.sin(i * angle)));
		}
		return coords;
	}
};

/**
 * Angle starts from a line going horizontally right from the center, and proceeds clockwise.
 */
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
		this._degrees = overflow(this._degrees, 0, 359) //? Set degr to a 0 -> 360 range
		this._radians = this._degrees * Math.PI / 180; //? Convert to radians
	}
	get sin()	{ return Math.sin(this._radians) }
	get cos()	{ return Math.cos(this._radians) }
	get tan()	{ return Math.tan(this._radians) }
	get asin()	{ return Math.asin(this._radians) }
	get acos()	{ return Math.acos(this._radians) }
	get atan()	{ return Math.atan(this._radians) }
	get sinh()	{ return Math.sinh(this._radians) }
	get cosh()	{ return Math.cosh(this._radians) }
	get tanh()	{ return Math.tanh(this._radians) }
	get asinh()	{ return Math.asinh(this._radians) }
	get acosh()	{ return Math.acosh(this._radians) }
	get atanh()	{ return Math.atanh(this._radians) }

	static right()	{ return new Angle(0) }
	static down()	{ return new Angle(90) }
	static left()	{ return new Angle(180) }
	static up()		{ return new Angle(270) }
}