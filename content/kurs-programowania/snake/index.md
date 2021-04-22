+++
title = "Snake"
template = "page.html"

[extra]
background = "limegreen"
color = "darkgreen"
+++

{% raw_html() %}
<script src="https://cdn.jsdelivr.net/gh/jamesroutley/24a2/build/engine.js"></script>
<script src="game.js"></script>
<div id="snake"></div>
{% end %}
