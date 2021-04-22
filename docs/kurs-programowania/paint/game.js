// Kolory.

let colors = [
    Color.Red,		// 0
    Color.Green,	// 1
    Color.Blue,		// 2
    Color.Gray,		// 3
];
let pickedColor = 0;


// Kropka do narysowania.

let pickedDot = { x: 0, y: 0 };
let needsDrawing = false;


// Jak zmienia się gra?

function update(game) {
    // Jeśli wymagane jest narysowanie kropki
    // (kropka została naciśnięta)...

    if (needsDrawing) {
        // ...to narysuj kropkę o wybranym kolorze
        // w wybranym miejscu.

        game.setDot(pickedDot.x, pickedDot.y, colors[pickedColor]);

        // I ściągnij flagę.

        needsDrawing = false;
    }

	// Napisz, jaki kolor jest wybrany obecnie.

    game.setText("▲/▼ Color: " + colors[pickedColor]);
}


// Co robić jeśli naciśnięto strzałkę?

function onKeyPress(arrow) {
	if (arrow == Direction.Up) {
    	// Pomniejszam numer wybranego koloru o 1.

    	pickedColor = pickedColor - 1;

		// Jeśli numer wybranego koloru wynosił 0,
		// to kolor o numerze o 1 mniejszym od niego
		// nie istnieje w naszej liście.
		//
		// Zrobimy, żeby numery się "zawijały"
		// z powrotem od góry.

    	if (pickedColor < 0) {
        	pickedColor = 3;
    	}
	}

	if (arrow == Direction.Down) {
    	// Powiększam numer wybranego koloru o 1.

    	pickedColor = pickedColor + 1;

    	// "Zawijam" numer z powrotem od dołu.

    	if (pickedColor > 3) {
        	pickedColor = 0;
    	}
	}
}


// Co robić jeśli naciśnięto kropkę?

function onDotClicked(x, y) {
    // Ustawiam pozycję wybranej kropki
    // na tę, którą nacisnął użytkownik.

    pickedDot = {
        x: x,
        y: y
    };

    // Ustawiam tę "flagę", żeby w następnej
    // zmianie gry kropka została narysowana.

    needsDrawing = true;
}


// Ustawienia i uruchamianie aplikacji.

let config = {
  update: update,
  onKeyPress: onKeyPress,
  onDotClicked: onDotClicked,
  clearGrid: false,
};

let game = new Game(config);
game.run();
