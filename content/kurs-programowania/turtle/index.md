+++
title = "Żółw"
template = "page.html"
+++

{% raw_html() %}
<script src="p5.min.js"></script>
<script src="zolw.js"></script>
<script src="sketch.js"></script>
<div id="turtle"></div>
{% end %}

```javascript
function polecenia() {
    ustawSzybkosc(100);

    ustawKolor('rozowy');
    powtorz(100);
        idzPrzedSiebie(100);
        idzDoTylu(98);
        obrocSiePrawo(5);
    koniecPowtorz();
}
```
