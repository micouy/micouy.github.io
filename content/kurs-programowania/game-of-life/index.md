+++
title = "Gra w Życie"
template = "page.html"

[extra]
background = "lightsalmon"
+++

{% raw_html() %}
<script src="https://cdn.jsdelivr.net/gh/jamesroutley/24a2/build/engine.js"></script>
<script src="game.js"></script>
<div id="game-of-life"></div>
{% end %}
