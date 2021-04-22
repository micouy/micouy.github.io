const osc = new Tone.Oscillator(440, "sine").toDestination();
osc.volume.value = -10;
osc.start();
osc.stop("+0.5");


// równoważny zapis
/*
const osc = new Tone.Oscillator(440, "sine")
    .toDestination()
    .start()
    .stop("+0.5");

osc.volume.value = -10;
*/
