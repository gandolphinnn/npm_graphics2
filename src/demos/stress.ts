import { rand, rand0 } from '@gandolphinnn/utils';
import { Angle, COLOR_DEFAULT, Circle, Color, Coord, MainCanvas, Time } from '../index.js';


const animate: FrameRequestCallback = async (timestamp: DOMHighResTimeStamp) => {
	Time.update(timestamp);
	MainCanvas.clean();
	Time.showData();

	//#region Stress code
	for (let i = 0; i < totShapes; i++) {
		let randRadius = rand0(15);
		let randX = rand(randRadius/2, MainCanvas.cnv.width-randRadius/2);
		let randY = rand(randRadius/2, MainCanvas.cnv.height-randRadius/2);
		new Circle(new Coord(randX, randY), randRadius).render();
	}
	//#endregion Stress code

	requestAnimationFrame(animate);
}
COLOR_DEFAULT.alpha = 0.1;
const totShapes = 20000;
animate(0);