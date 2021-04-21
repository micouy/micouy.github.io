/*
LEVEL 2:

- Direction.Right, a nie Direction.RIGHT
- Math.random() * 23, a nie 24
- używam globalnych flag więc to trochę trudniej zrozumieć
- trzeba rozumieć modulo
- skomplikowana logika kolizji:
	1. wykalkuluj nową głowę
	2. jeśli nowa głowa nie dotyka owocu to usuń ostatni element
	3. jeśli głowa dotyka owocu to wylosuj nową i sprawdź czy nie koliduje
	   z którąś z części pozostałego ciała LUB z nową głową (która jeszcze
	   nie jest dodana)
	4. sprawdź kolizje nowej głowy ze wszystkimi pozostałymi częściami
	   (został wąż ze starą głową i bez ogona)
	5. jeśli nie koliduje to dodaj nową głowę

- skomplikowana logika przyjmowania strzałek:
	1. dopuszczaj tylko prostopadłe kierunki do obecnego LUB nie dopuszczaj przeciwnych
	2. apdejtuj kierunek tylko raz per apdejt (w przeciwnym razie da się
	   w ciągu jednego apdejta obrócić o 180°) - zdejmuj flagę readyToReceiveKeys
	3. po apdejcie postaw flagę readyToReceiveKeys
- js przekazuje by reference, ale jeśli zrobisz `arg = ...` to nie update'uje
  tej wartości. musisz korzystać z `arg.property = ...` lub `arg[i] = ...`.
*/

let snake;
let berry;
let direction;
let readyToReceiveKeys;

function create(game) {
    // create a snake with length of 3
    snake = [
        { x: 12, y: 12 },
        { x: 11, y: 12 },
        { x: 10, y: 12 },
    ];

	// add a berry
    berry = pickNewBerryPosition();

    while (touch(berry, getHead(snake))) {
        berry = pickNewBerryPosition();
    }

	// other globals
    direction = Direction.Right;
    readyToReceiveKeys = true;
}

function touch(pointA, pointB) {
    return pointA.x == pointB.x && pointA.y == pointB.y;
}

function getHead(snake) {
    return snake[0];
}

function roll(pos) {
    return (pos + 24) % 24;
}

function pickNewBerryPosition() {
    return {
        x: Math.round(Math.random() * 23),
        y: Math.round(Math.random() * 23),
    };
}

function update(game) {
    let head = getHead(snake);
    let ateBerry = false;
    let newX = head.x, newY = head.y;

    // calculate new head position
    if (direction == Direction.Right) {
        newX = roll(head.x + 1);
    } else if (direction == Direction.Left) {
        newX = roll(head.x - 1);
    } else if (direction == Direction.Up) {
        newY = roll(head.y - 1);
    } else if (direction == Direction.Down) {
        newY = roll(head.y + 1);
    }

    let newHead = { x: newX, y: newY };

    if (touch(newHead, berry)) {
        // if ate the berry, prepare a new berry
        let berryReady = false;

        while (!berryReady) {
            berry = pickNewBerryPosition();
            berryReady = true;

            if (touch(newHead, berry)) {
                berryRead = false;
            }

            for (let part of snake) {
                if (touch(part, berry)) {
                    berryReady = false;
                }
            }
        }
    } else {
        // if the snake did not eat the berry, remove the tail
        snake.pop();
    }

    // check for collisions
    for (let part of snake) {
        if (touch(newHead, part)) {
            game.setText(`Game Over. You got ${snake.length} points.`);
            game.end();

            return;
        }
    }

    // if collision dit not occur, set a new head
    snake.splice(0, 0, newHead);

    // draw
    for (let part of snake) {
        game.setDot(part.x, part.y, Color.Yellow);
    }

    head = getHead(snake);
    game.setDot(head.x, head.y, Color.Orange);

    game.setDot(berry.x, berry.y, Color.Red);
    game.setText(`Points: ${snake.length}`);

    // set flag to receive keys
    readyToReceiveKeys = true;
}

function onKeyPress(arrow) {
    // allow only orthogonal directions
    if (readyToReceiveKeys) {
        if ((direction == Direction.Right || direction == Direction.Left) &&
            (arrow == Direction.Up || arrow == Direction.Down)) {
            direction = arrow;
        } else if ((direction == Direction.Up || direction == Direction.Down) &&
            (arrow == Direction.Right || arrow == Direction.Left)) {
            direction = arrow;
        }

        readyToReceiveKeys = false;
    }
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
