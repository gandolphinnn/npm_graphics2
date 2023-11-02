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
export class Canvas {
	//#region Definition
	public readonly id: string;
	public readonly cnv : HTMLCanvasElement;
	public readonly ctx : CanvasRenderingContext2D;
	public canvasMode : CanvasMode;
	
	public get center() { return new Coord(this.cnv.width/2, this.cnv.height/2) }
	
	constructor(id: string) {
		//* Set the ID
		if (id == '') {
			throw new Error('ID can\'t be empty')
		}
		this.id = id;
		
		//* Set the body
		let body : HTMLBodyElement;
		if (document.querySelector('body') == null) {
			throw new Error('Body element not found');
		}
		body = document.querySelector('body')!;

		//* Set the canvas
		if (body.querySelector(`canvas#${this.id}`) == null) {
			throw new Error(`Canvas element with Id: ${id} not found`);
		}
		this.cnv = body.querySelector(`canvas#${this.id}`)!;

		//* Set the context
		if (this.cnv.getContext('2d') == null) {
			throw new Error('2D Context not found');
		}
		this.ctx = this.cnv.getContext('2d')!;

		//* Set the attributes
		if (this.cnv.hasAttribute('width') && this.cnv.hasAttribute('height')) {
			this.canvasMode = CanvasMode.Window;
			console.log(`Canvas ${this.id} set in Window mode`)
		}
		else {
			this.canvasMode = CanvasMode.FullScreen;
			body.style.overflow = 'hidden';
			body.style.margin = '0px';
			this.cnv.width = window.innerWidth;
			this.cnv.height = window.innerHeight;
			console.log(`Canvas ${this.id} set in FullScreen mode`)
		}
	}
	//#endregion

	//#region Screen
	public Clean() {
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);
	}
	public Rotate(angle:Angle = new Angle(0)) {
		this.ctx.rotate(angle.radians)
	}
	public Action(drawAction : DrawAction) {
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Fill) {
			this.ctx.fill();
		}
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Stroke) {
			this.ctx.stroke();
		}
	}
	public WriteText(text : string, coord: Coord) {
		this.ctx.fillText(text, coord.x - 30, coord.y+3)
	}
	public SetColor(color : string, drawAction : DrawAction) {
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Fill) {
			this.ctx.fillStyle = color;
		}
		if (drawAction == DrawAction.Both || drawAction == DrawAction.Stroke) {
			this.ctx.strokeStyle = color;
		}
	}
	public PrintImage(img: HTMLImageElement, w: number, h: number, coord: Coord = this.SumCoordValues(this.center, -w/2, -h/2), rotation?: Angle) {
		img.onload = () => {
			console.log(rotation);
			if (rotation !== undefined) {
				this.ctx.save()
				this.Rotate(rotation)
				this.ctx.drawImage(img, coord.x, coord.y, w, h)
				this.ctx.restore()
			}
			else {
				this.ctx.drawImage(img, coord.x, coord.y, w, h)
			}
		}
	}
	//#endregion

	//#region Coord
	public SumCoords (coord1 : Coord, coord2 : Coord) : Coord {
		return new Coord(coord1.x + coord2.x, coord1.y + coord2.y);
	}
	public SumCoordValues (coord1 : Coord, x : number, y : number) : Coord {
		return new Coord(coord1.x + x, coord1.y + y);
	}
	public CoordDistance (coord1 : Coord, coord2 : Coord) {
		return Math.sqrt(((coord1.x - coord2.x) ** 2) + ((coord1.y - coord2.y) ** 2));
	}
	//#endregion

	//#region Draw
	public DrawCircle (coord : Coord, radius : number, drawAction : DrawAction = DrawAction.Both) {
		this.ctx.beginPath();
		this.ctx.arc(coord.x, coord.y, radius, 0, Math.PI * 2);
		this.Action(drawAction)
	}
	public DrawRectByVal (coord : Coord, width : number, length : number, drawAction : DrawAction = DrawAction.Both) {
		this.ctx.beginPath();
		this.ctx.rect(coord.x, coord.y, width, length);
		this.Action(drawAction)
	}
	public DrawRectByCoords (coord1 : Coord, coord2 : Coord, drawAction : DrawAction = DrawAction.Both) {
		let x = (coord2.x < coord1.x)? coord2.x : coord1.x;
		let y = (coord2.y < coord1.y)? coord2.y : coord1.y;
		let width = Math.abs(coord1.x-coord2.x);
		let height = Math.abs(coord1.y-coord2.y);	
		this.DrawRectByVal(new Coord(x, y), width, height, drawAction);
	}
	public DrawLine (coord1: Coord, coord2: Coord, drawAction : DrawAction = DrawAction.Both) {
		this.ctx.beginPath();
		this.ctx.moveTo(coord1.x, coord1.y);
		this.ctx.lineTo(coord2.x, coord2.y);
		this.Action(drawAction)
	}
	public DrawSampleUnits (testunit : number = 0) {
		let sampleUnits = [1, 5, 10, 50, 100, 250, 500, 1000];
		if (testunit > 0 && testunit < this.cnv.width && sampleUnits.indexOf(testunit) == -1) {
			sampleUnits.push(testunit);
			sampleUnits.sort(function(a, b) {
				return a - b;
			});
		}
		let coord = new Coord(this.center.x - 500, this.center.y-(20*sampleUnits.length/2));
		this.ctx.lineWidth = 4;
		sampleUnits.forEach(unit => {
			this.ctx.strokeStyle = unit == testunit ? 'red' : 'black';
			this.WriteText(unit.toString(), this.SumCoordValues(coord, -30, +3))
			this.DrawLine(coord, this.SumCoordValues(coord, unit, 0), DrawAction.Stroke);
			coord.Add(0, 20);
		});
	}
	public DrawSampleMetric(scale: number = 50) {
		this.ctx.lineWidth = 1;
		this.ctx.textAlign = "left";
		for (let x = scale; x < this.cnv.width; x += scale) { //? Vertical
			this.DrawLine(new Coord(x, 0), new Coord(x, this.cnv.height), DrawAction.Both)
			this.WriteText(x.toString(), new Coord(x, 10))
		}
		this.ctx.textAlign = "left";
		for (let y = scale; y < this.cnv.height; y += scale) { //? Horizontal
			this.DrawLine(new Coord(0, y), new Coord(this.cnv.width, y), DrawAction.Both)
			this.WriteText(y.toString(), new Coord(35, y-5))
		}
		this.DrawCircle(this.center, 5, DrawAction.Both)
	}
	//#endregion
}
export class Coord {
	public x : number;
	public y : number;

	constructor(x : number, y : number) {
		this.x = x;
		this.y = y;
	}
	Add(addX : number, addY : number) {
		this.x += addX;
		this.y += addY;
	}
};
export class Line {
	public coord1 : Coord;
	public coord2 : Coord;

	constructor(coord1 : Coord, coord2 : Coord) {
		this.coord1 = coord1;
		this.coord2 = coord2;
	}

	public get length() {
		return Math.sqrt(((this.coord1.x - this.coord2.x) ** 2) + ((this.coord1.y - this.coord2.y) ** 2))
	}
};
export class Angle {
	private _degrees!: number;
	private _radians!: number;
	public autoClamp: boolean;
	
	constructor(alpha: number, type: AngleType = AngleType.Degree, autoClamp: boolean = true) {
		this.autoClamp = autoClamp;
		if (type == AngleType.Degree) {
			this.degrees = alpha;
		}
		else if (type == AngleType.Radian) {
			this.radians = alpha;
		}
		else { throw new Error('Invalid angle type'); }
	}
	public get degrees() { return this._degrees; }
	public get radians() { return this._radians; }
	public set degrees(alpha: number) {
		this._degrees = alpha;
		if (this.autoClamp) {
			this.Clamp()
		}
		else {
			this._radians = this._degrees * Math.PI / 180; //? Formula
		}
	}
	public set radians(alpha: number) {
		this._radians = alpha;
		this._degrees = this._radians * 180 / Math.PI; //? Formula
		if (this.autoClamp) {
			this.Clamp()
		}
	}
	public Clamp() { //? Set degr and rad to a 0 -> 359  standard
		//* Negative values
		while (this._degrees < 0) {
			this._degrees += 360;
		}
		//* 359+ values
		this._degrees %= 360;
		this._radians = this._degrees * Math.PI / 180; //? Formula
	}
	//#region Trigonometric functions
		public get sin() { return Math.sin(this._radians); }
		public get cos() { return Math.cos(this._radians); }
		public get tan() { return Math.tan(this._radians); }
		public get asin() { return Math.asin(this._radians); }
		public get acos() { return Math.acos(this._radians); }
		public get atan() { return Math.atan(this._radians); }
		public get sinh() { return Math.sinh(this._radians); }
		public get cosh() { return Math.cosh(this._radians); }
		public get tanh() { return Math.tanh(this._radians); }
		public get asinh() { return Math.asinh(this._radians); }
		public get acosh() { return Math.acosh(this._radians); }
		public get atanh() { return Math.atanh(this._radians); }
	//#endregion
}