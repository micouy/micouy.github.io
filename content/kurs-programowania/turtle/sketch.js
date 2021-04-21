// dostepne funkcje:
// idzDo(x, y)
// ustawKolor(kolor), ustawGrubosc(grubosc)
// opuscPioro(), podniesPioro()
// obrocSieLewo(kat), obrocSiePrawo(kat)
// idzPrzedSiebie(kroki), idzDoTylu(kroki)
// powtorz(n), koniecPowtorz()

// dostepne kolory:
// zielony, czerwony, czarny, bialy, zolty,
// pomaranczowy, niebieski, fioletowy, rozowy

function polecenia() {
    ustawSzybkosc(100);

    ustawKolor('rozowy');
    powtorz(100);
        idzPrzedSiebie(100);
        idzDoTylu(98);
        obrocSiePrawo(5);
    koniecPowtorz();

	podniesPioro();
	idzDo(150, 150);
	opuscPioro();

    ustawKolor('niebieski');
    powtorz(100);
        idzPrzedSiebie(100);
        idzDoTylu(98);
        obrocSiePrawo(5);
    koniecPowtorz();

	podniesPioro();
	idzDo(100, 300);
	opuscPioro();

    ustawKolor('fioletowy');
    powtorz(100);
        idzPrzedSiebie(100);
        idzDoTylu(98);
        obrocSiePrawo(5);
    koniecPowtorz();
}
