import { Angle, Canvas, CanvasMode, Coord, DrawAction } from './index.js';

let c1 = new Canvas(CanvasMode.FullScreen);
let img1 = new Image(); img1.src = './media/red.png'
let img2 = new Image(); img2.src = './media/red.png'
let img3 = new Image(); img3.src = './media/red.png'
c1.PrintImage(img1, 300, 300, new Coord(10, 10), new Angle(0))
c1.PrintImage(img2, 300, 300, new Coord(100, 100), new Angle(0), () => {
	c1.DrawCircle(new Coord(100, 100), 50, DrawAction.Both)
})
console.log("asd")

c1.PrintImage(img3, 300, 300, new Coord(250, 250), new Angle(90))
c1.PrintImage(img2, 455, 300)
