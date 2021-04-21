/*
UWAGI:
- funkcje
- mnóstwo for (let i = 0; ... )
- chyba dobre jako drugi zestaw
- clear grid false
- czyścić array przez arr.splice(0, arr.length)
- zasady gry:
	- jeśli żywa i ma 2 lub 3 to żyje nadal
	- jeśli martwa i ma 3, to ożywa
	- pozostałe umierają

BŁĘDY:
- row zamiast row1 itd.
- wpisywałem zasady dla alive w if (cell == 0)
- rysowałem komórki tylko w if(running)
- arg = [] - usuwałem reference do argumentu
- nie initowałem cells (cells = []) i miałem
  błąd że są undefined
*/

let cells1 = [];
let cells2 = [];
let running = false;

function create(game) {
    generateEmptyWorld(cells1);
    generateEmptyWorld(cells2);
}

function update(game) {
    if (running) {
        // Obliczam nową wartość komórki na podstawie
        // cells1 i wkładam ją do cells2.

    	for (let y = 0; y < 24; y++) {
        	for (let x = 0; x < 24; x++) {
            	cells2[y][x] = getNextValue(cells1, x, y);
        	}
    	}

		// Kiedy wszystkie komórki są gotowe,
		// przenoszę je z powrotem do cells1.

    	for (let y = 0; y < 24; y++) {
        	for (let x = 0; x < 24; x++) {
            	cells1[y][x] = cells2[y][x];
        	}
    	}

    	game.setText("Running. Controls: ↓ Pause");
    } else {
    	game.setText("Paused. Controls: ↑ Run | ← Clear | → Randomize");
    }

	// Niezależnie czy gra jest zatrzymana rysuję kropki.

	for (let y = 0; y < 24; y++) {
    	for (let x = 0; x < 24; x++) {
        	if (cells1[y][x] == 0) {
            	// Martwe komórki rysuję na żółto.

            	game.setDot(x, y, Color.Yellow);
        	} else {
				// Żywe komórki rysuję na fioletowo.

            	game.setDot(x, y, Color.Indigo);
        	}
    	}
	}
}

function generateEmptyWorld(cells) {
    cells.splice(0, cells.length);

	for (let y = 0; y < 24; y++) {
    	let row = [];

    	for (let x = 0; x < 24; x++) {
        	row[x] = 0;
    	}

    	cells.push(row);
	}
}

function generateRandomWorld(cells) {
    cells.splice(0, cells.length);

	for (let y = 0; y < 24; y++) {
    	let row = [];

    	for (let x = 0; x < 24; x++) {
        	row[x] = Math.round(Math.random());
    	}

    	cells.push(row);
	}
}

function getNextValue(cells, x, y) {
    let aliveNeighbors = 0;

    for (let ny = -1; ny <= 1; ny++) {
    	for (let nx = -1; nx <= 1; nx++) {
        	// Jeśli wyjechałem w x poza tablicę, to pomijam.
        	if (x + nx < 0 || x + nx > 23) { continue; }

        	// Jeśli wyjechałem w y poza tablicę, to pomijam.
        	if (y + ny < 0 || y + ny > 23) { continue; }

        	// Pomijam komórkę, której wartość obliczam.
        	if (nx == 0 && ny == 0) { continue; }

			// Jeśli sąsiad żyje, to zwiększam licznik.
			if (cells[y + ny][x + nx] == 1) {
    			aliveNeighbors += 1;
			}
    	}
    }

	if (cells[y][x] == 1) {
        if (aliveNeighbors == 2 || aliveNeighbors == 3) {
            return 1;
        } else {
            return 0;
        }
	} else {
    	if (aliveNeighbors == 3) {
        	return 1;
    	} else {
        	return 0;
    	}
	}
}

function onKeyPress(arrow) {
    if (running) {
		if (arrow == Direction.Down) {
    		running = false;
		}
    } else {
        if (arrow == Direction.Left) {
            generateEmptyWorld(cells1);
        } else if (arrow == Direction.Right) {
            generateRandomWorld(cells1);
        } else if (arrow == Direction.Up) {
            running = true;
        }
    }
}

function onDotClicked(x, y) {
    if (!running) {
        if (cells1[y][x] == 0) {
            cells1[y][x] = 1;
        } else {
            cells1[y][x] = 0;
        }
    }
}

let config = {
  create: create,
  update: update,
  onKeyPress: onKeyPress,
  onDotClicked: onDotClicked,
  clearGrid: false,
  frameRate: 5,
};

let game = new Game(config);
game.run();
