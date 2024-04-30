import { rand, rand0 } from '@gandolphinnn/utils';
import { Angle, COLOR_DEFAULT, Circle, Color, Coord, MainCanvas, Time } from '../index.js';


const animate: FrameRequestCallback = async (timestamp: DOMHighResTimeStamp) => {
	Time.update(timestamp);
	MainCanvas.clean();
	Time.showData();

	//#region Stress code
	for (let i = 0; i < totShapes; i++) {
		new Circle(MainCanvas.randomCoord(100), radius).render();
	}
	//#endregion Stress code

	requestAnimationFrame(animate);
}
COLOR_DEFAULT.alpha = 0.1;
const totShapes = 20000;
const radius = 10;
animate(0);