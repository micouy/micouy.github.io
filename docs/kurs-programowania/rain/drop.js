/*
UWAGI:
- metody w js nie biorą this
- nie można assignować do this
- color() z jakiegoś powodu nie można używać poza funkcjami

*/

const MIN_DEPTH = 1;
const MAX_DEPTH = 3;
const BASE_VELOCITY = 20;
const BASE_WIDTH = 5;
const BASE_HEIGHT = 20;
const DROP_COLOR = [25, 25, 112];

class Drop {
    constructor() {
        this.x = random(0, width);
        this.y = random(-10, height + 10);
        this.velocity = BASE_VELOCITY + random(-BASE_VELOCITY * 0.4, BASE_VELOCITY * 0.4);
        this.depth = random(MIN_DEPTH, MAX_DEPTH);
    }

    update() {
		this.y += BASE_VELOCITY / this.depth;

		if (this.y > height + 10) {
            this.x = random(0, width);
            this.y = -10;
            this.depth = random(MIN_DEPTH, MAX_DEPTH);
		}
    }

    draw() {
        let width = BASE_WIDTH / this.depth;
        let height = BASE_HEIGHT / this.depth;

        noStroke();
        fill(...DROP_COLOR, 200);
        rect(this.x - width / 2, this.y - height / 2, width, height);
    }
}
