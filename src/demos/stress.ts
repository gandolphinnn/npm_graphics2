import { COLOR_DEFAULT, Circle, MainCanvas, Time } from '../index.js';

COLOR_DEFAULT.alpha = 0.1;
const totShapes = 20000;
const radius = 10;

/**
 * This will be the basic structure of the animation loop.
 */
const animate: FrameRequestCallback = async (timestamp: DOMHighResTimeStamp) => {
	Time.update(timestamp);
	MainCanvas.clean();
	
	Update();

	requestAnimationFrame(animate);
}

/**
 * This will be the main update function, where all the logic will be placed.
 */
const Update = () => {
	Time.showData();

	//#region Stress code
	for (let i = 0; i < totShapes; i++) {
		new Circle(MainCanvas.randomCoord(100), radius).render();
	}
	//#endregion Stress code
}

animate(0);