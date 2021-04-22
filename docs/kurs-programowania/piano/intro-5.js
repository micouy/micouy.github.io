// globalne zmienne
let two;
let synth;

window.onload = () => {
	// uruchom two.js
    let elem = document.getElementById('piano');
    two = new Two({ fullscreen: true });
    two.appendTo(elem);

	// dodaj klawisz
	let whiteKey = createWhiteKey(100, 200);
	let blackKey = createBlackKey(120, 150);

    // stwórz synth
    synth = new Tone.PolySynth().toDestination();

	// wyczekuj klawiszy
	let pressFlags = {};
	bindKey('d', whiteKey, 'C2', pressFlags);
	bindKey('r', blackKey, 'C#2', pressFlags);
};

function bindKey(keyName, shape, note, pressFlags) {
	// dodaj flagę dla tego klawisza
    pressFlags[keyName] = false;

    keyboardJS.bind(
        keyName,
        (_) => {
            if (!pressFlags[keyName]) {
            	pressFlags[keyName] = true;

                synth.triggerAttack(note);

            	shape.linewidth = 3;
                two.update();
            }
        },
        (_) => {
            pressFlags[keyName] = false;

            synth.triggerRelease(note);

        	shape.linewidth = 1;
            two.update();
        }
    );
}

function createWhiteKey(x, y) {
    let key = new Two.RoundedRectangle(x, y, 40, 250, 3);
    two.add(key);
    key.fill = '#eed';
    key.stroke = '#bba';
    key.linewidth = 1;
    two.update();

	return key;
}

function createBlackKey(x, y) {
    let key = new Two.RoundedRectangle(x, y, 20, 150, 3);
    two.add(key);
    key.fill = '#332';
    key.stroke = '#664';
    key.linewidth = 1;
    two.update();

	return key;
}
