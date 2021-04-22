/*
LEVEL 1:

- utilsy i wrappery
- utilsy muszą modyfikować dane wejściowe, a nie zwracać

DOSTĘPNE FUNKCJE:

- snake
	- getLenght(snake)
    - getHead(snake)
    - extendSnake(snake, direction)
    - cutSnakesTail(snake)
    - drawSnake(snake)
    - ranIntoItself(snake)

- berry
    - pickNewBerryPosition(berry, snake)
    - drawBerry(berry)

- touch(pointA, pointB)
- printPoints(game, points)
- gameOver(game, points)
*/

let pause = false;

function create(game) {
    // add a snake with length of 3
    snake = [
        { x: 12, y: 12 },
        { x: 11, y: 12 },
        { x: 10, y: 12 },
    ];

	// add a berry
	berry = { x: 5, y: 5 };

	// other globals
    direction = Direction.Right;
    readyToReceiveKeys = true;
}

function update(game) {
    if (pause) {
        game.end();
    }

    extendSnake(snake, direction);
    let head = getHead(snake);

    if (touch(head, berry)) {
        pickNewBerryPosition(berry, snake);
    } else {
        cutSnakesTail(snake);
    }

	if (ranIntoItself(snake)) {
    	let points = getLength(snake);
    	gameOver(game, points);
	} else {
        drawSnake(snake);
        drawBerry(berry);

        let points = getLength(snake);
        printPoints(game, points);
	}
}

function onKeyPress(arrow) {
    direction = arrow;
}

let config = {
    create: create,
    update: update,
    onKeyPress: onKeyPress,
    defaultDotColor: Color.Green,
    clearGrid: true,
    frameRate: 10,
};

let game = new Game(config);
game.run();
