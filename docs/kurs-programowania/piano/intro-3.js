// uruchom cały kod dopiero, gdy wszystkie elementy się załadują
window.onload = () => {
    // "znajdź" element o id "piano"
    let elem = document.getElementById('piano');

    // uruchom two.js
    let two = new Two({ width: 500, height: 200 });

    // wyznacz element, w którym rysować
    two.appendTo(elem);


    // dodawanie kształtu - sposób 1.

    // dodaj koło
    let circle1 = two.makeCircle(50, 50, 30);

    // zmień wypełnienie i zaktualizuj rysunek
    circle1.fill = '#f00';
    two.update();


    // dodawanie kształtu - sposób 2.

    let circle2 = new Two.Circle(100, 50, 30);
    two.add(circle2);

    circle2.fill = '#f00';
    two.update();
}
