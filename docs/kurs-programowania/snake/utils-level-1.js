let snake;
let berry;
let direction;
let readyToReceiveKeys;

function pickNewBerryPosition(berry, snake) {
	let berryReady = false;

    while (!berryReady) {
        berry.x = Math.round(Math.random() * 23);
        berry.y = Math.round(Math.random() * 23);

        berryReady = true;

        for (let part of snake) {
            if (touch(part, berry)) {
                berryReady = false;
            }
        }
    }
}

function roll(pos) {
    return (pos + 24) % 24;
}

function touch(pointA, pointB) {
    return pointA.x == pointB.x && pointA.y == pointB.y;
}

function getHead(snake) {
    return snake[0];
}

function getLength(snake) {
    return snake.length;
}

function extendSnake(snake, direction) {
    let newHead = getNewHead(snake, direction);
    snake.splice(0, 0, newHead);
}

function cutSnakesTail(snake) {
    snake.pop();
}

function getNewHead(snake, direction) {
    let head = getHead(snake);
    let newX = head.x, newY = head.y;

    if (direction == Direction.Right) {
        newX = roll(head.x + 1);
    } else if (direction == Direction.Left) {
        newX = roll(head.x - 1);
    } else if (direction == Direction.Up) {
        newY = roll(head.y - 1);
    } else if (direction == Direction.Down) {
        newY = roll(head.y + 1);
    }

    return { x: newX, y: newY };
}

function ranIntoItself(snake) {
    for (let i = 0; i < snake.length; i++) {
        for (let j = i + 1; j < snake.length; j++) {
            if (touch(snake[i], snake[j])) {
                return true;
            }
        }
    }

	return false;
}

function drawSnake(snake) {
    for (let part of snake) {
        game.setDot(part.x, part.y, Color.Yellow);
    }

    let head = getHead(snake);
    game.setDot(head.x, head.y, Color.Orange);
}

function drawBerry(berry) {
    game.setDot(berry.x, berry.y, Color.Red);
}

function printPoints(game, points) {
    game.setText(`Points: ${snake.length}`);
}

function gameOver(game, points) {
    game.setText(`Game Over. You got ${points} points.`);
    game.end();
}
