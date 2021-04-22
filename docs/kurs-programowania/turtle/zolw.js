class Program {
    constructor() {
        this.rodzic = null;
        this.i = 0;
        this.instrukcje = [];
    }

    dodajInstrukcje(instrukcja) {
        this.instrukcje.push(instrukcja);
    }

    wezNastepna() {
        if (this.i < this.instrukcje.length) {
            let instrukcja = this.instrukcje[this.i];
            this.i += 1;

            return instrukcja;
        } else {
            return null;
        }
    }
}

class Petla {
    constructor(rodzic, n) {
        this.rodzic = rodzic;
        this.n = n;
        this.wykonanie = {
            n: this.n,
            i: 0
        };
        this.instrukcje = [];
    }

    ponow() {
        this.wykonanie = {
            n: this.n,
            i: 0
        };
    }

    dodajInstrukcje(instrukcja) {
        this.instrukcje.push(instrukcja);
    }

    wezNastepna() {
        if (this.wykonanie.n == 0) {
            return null;
        }

        let instrukcja = this.instrukcje[this.wykonanie.i];
        this.wykonanie.i = (this.wykonanie.i + 1) % this.instrukcje.length;

        if (this.wykonanie.i == 0) {
            this.wykonanie.n -= 1;
        }

        return instrukcja;
    }
}

let program = new Program();
let kursor = program;
let zolw;
let rysunek;
let kolory = {
    'zielony': 'green',
    'czerwony': 'red',
    'czarny': 'black',
    'bialy': 'white',
    'zolty': 'yellow',
    'pomaranczowy': 'orange',
    'niebieski': 'blue',
    'fioletowy': 'purple',
    'rozowy': 'pink',
}

function setup() {
    createCanvas(400, 400);
    rysunek = createGraphics(400, 400);
    frameRate(5);
    zolw = {
        pozycja: createVector(width / 2, height / 2),
        obrot: 0,
        kolor: 'czerwony',
        opuszczony: true,
        grubosc: 2,
    };
    polecenia();
    kursor = program;
}

function draw() {
    let instrukcja = kursor.wezNastepna();

    while (true) {
        if (instrukcja instanceof Petla) {
            kursor = instrukcja;
            kursor.ponow();
            instrukcja = kursor.wezNastepna();
            continue;
        } else if (instrukcja == null) {
            if (kursor.rodzic) {
                kursor = kursor.rodzic;
                instrukcja = kursor.wezNastepna();
                continue;
            } else {
                noLoop();
                break;
            }
        } else {
            instrukcja();
            break
        }
    }
}

function ustawSzybkosc(szybkosc) {
    frameRate(szybkosc);
}

function obrocSiePrawo(kat) {
    kursor.dodajInstrukcje(() => {
        _obrocSiePrawo(kat);
    });
}

function obrocSieLewo(kat) {
    kursor.dodajInstrukcje(() => {
        _obrocSieLewo(kat);
    });
}

function idzPrzedSiebie(kroki) {
    kursor.dodajInstrukcje(() => {
        _idz(kroki);
    });
}

function idzDoTylu(kroki) {
    kursor.dodajInstrukcje(() => {
        _idz(-kroki);
    });
}

function opuscPioro() {
    kursor.dodajInstrukcje(() => {
        _opuscPioro();
    });
}

function podniesPioro() {
    kursor.dodajInstrukcje(() => {
        _podniesPioro();
    });
}

function ustawKolor(kolor) {
    kursor.dodajInstrukcje(() => {
        _ustawKolor(kolor);
    });
}

function ustawGrubosc(grubosc) {
    kursor.dodajInstrukcje(() => {
        _ustawGrubosc(grubosc);
    });
}

function idzDo(x, y) {
    let xNaRysunku = x;
    let yNaRysunku = height - y;
    kursor.dodajInstrukcje(() => {
        _idzDo(xNaRysunku, yNaRysunku);
    });
}

function powtorz(n) {
    let petla = new Petla(kursor, n);
    kursor.dodajInstrukcje(petla);
    kursor = petla;
}

function koniecPowtorz() {
    if (kursor.rodzic) {
        kursor = kursor.rodzic;
    }
}

function _obrocSiePrawo(kat) {
    zolw.obrot += kat * PI / 180;
}

function _obrocSieLewo(kat) {
    zolw.obrot -= kat * PI / 180;
}

function _idz(kroki) {
    let ruch = createVector(0, -1).rotate(zolw.obrot).mult(kroki);
    let nowaPozycja = zolw.pozycja.copy().add(ruch);
    _idzDo(nowaPozycja.x, nowaPozycja.y);
}

function _opuscPioro() {
    zolw.opuszczony = true;
}

function _podniesPioro() {
    zolw.opuszczony = false;
}

function _ustawKolor(kolor) {
    zolw.kolor = kolor;
}

function _ustawGrubosc(grubosc) {
    zolw.grubosc = grubosc;
}

function _idzDo(x, y) {
    let dawnaPozycja = zolw.pozycja.copy();
    zolw.pozycja = createVector(x, y);

    if (zolw.opuszczony) {
        rysunek.strokeWeight(zolw.grubosc);
        rysunek.stroke(kolory[zolw.kolor]);
        rysunek.noFill();
        rysunek.line(dawnaPozycja.x, dawnaPozycja.y, zolw.pozycja.x, zolw.pozycja.y);
    }

    background('white');
    image(rysunek, 0, 0);
    noStroke();
    fill('green');
    circle(zolw.pozycja.x, zolw.pozycja.y, 10);
}
