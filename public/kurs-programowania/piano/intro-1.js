// funkcja z keyboardJS
// bind(key, keydown, keyup);

// potrzebne żeby nie przyjmować keydown za każdym
// razem kiedy przeglądarka aktywuje ten event
let pressed = false;

keyboardJS.bind(
    's',
    (_) => {
        // obsługu keydown tylko jeśli jeszcze nie
        // zostało to zrobione od ostatniego puszczenia klawisza
        if (!pressed) {
            // postaw flagę
            pressed = true;
        }
    },
    (_) => {
        // ściągnij flagę
        pressed = false;
    }
);
