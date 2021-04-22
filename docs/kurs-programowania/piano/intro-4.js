window.onload = () => {
	// uruchom two.js
    let elem = document.getElementById('piano');
    let two = new Two({ fullscreen: true });
    two.appendTo(elem);

	// dodaj klawisz
    let key = new Two.RoundedRectangle(100, 200, 40, 250, 3);
    two.add(key);
    key.fill = '#eed';
    key.stroke = '#bba';
    key.linewidth = 1;
    two.update();

    let pressed = false;

    // stwórz oscylator
    let osc = new Tone.Oscillator(440, "sine").toDestination();
    osc.volume.value = -10;

	// wyczekuj klawiszy
    keyboardJS.bind(
        'd',
        (_) => {
            if (!pressed) {
            	pressed = true;
            	key.linewidth = 3;
                two.update();
                osc.start();
            }
        },
        (_) => {
            pressed = false;
        	key.linewidth = 1;
            two.update();
            osc.stop();
        }
    );
};
