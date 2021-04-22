// globalne zmienne
let two;
let synth;

let style = {
    whiteKeyWidth: 40,
    blackKeyWidth: 20,
};

window.onload = () => {
	// uruchom two.js
    let elem = document.getElementById('piano');
    two = new Two({ fullscreen: true });
    two.appendTo(elem);

	// dodaj klawisze
	let baseX = 50;
	let baseY = 120;

	let whiteKeys = [];
	for (let w = 0; w < 8; w++) {
    	let x = baseX + w * style.whiteKeyWidth;
    	let y = baseY;
    	whiteKeys.push(createWhiteKey(x, y));
	}

	let blackKeyPositions = [1, 2, 4, 5, 6];
	let blackKeys = [];
	for (let b of blackKeyPositions) {
    	let x = baseX + (b - 0.5) * style.whiteKeyWidth;
    	let y = baseY - 50;
    	blackKeys.push(createBlackKey(x, y));
	}

    // stwórz synth
    synth = new Tone.PolySynth().toDestination();
    synth.set({detune: +1200 });

	// wyczekuj klawiszy
	let pressFlags = {};
	bindKey('a', whiteKeys[0], 'C2', pressFlags);
	bindKey('w', blackKeys[0], 'C#2', pressFlags);
	bindKey('s', whiteKeys[1], 'D2', pressFlags);
	bindKey('e', blackKeys[1], 'D#2', pressFlags);
	bindKey('d', whiteKeys[2], 'E2', pressFlags);
	bindKey('f', whiteKeys[3], 'F2', pressFlags);
	bindKey('t', blackKeys[2], 'F#2', pressFlags);
	bindKey('g', whiteKeys[4], 'G2', pressFlags);
	bindKey('y', blackKeys[3], 'G#2', pressFlags);
	bindKey('h', whiteKeys[5], 'A2', pressFlags);
	bindKey('u', blackKeys[4], 'A#2', pressFlags);
	bindKey('j', whiteKeys[6], 'B2', pressFlags);
	bindKey('k', whiteKeys[7], 'C3', pressFlags);
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
