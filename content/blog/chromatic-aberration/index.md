+++
title = "Chromatic Aberration"
date = 2021-04-21
template = "page.html"

[extra]
background = "black"
color = "white"
+++

{% raw_html() %}
<style>
html {
  min-height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: Courier;
  margin: 0;
  padding: 0;
  padding-bottom: 15em;
  width: 100%;
  display: flex;
  background: black;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

a:visited {
  color: magenta;
}

#text-card p {
  margin: 0;
}

#text-card {
  width: 40em;
  margin-top: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 25em;
  margin-top: 0.2em !important;
  margin-bottom: 0.2em !important;
  border-radius: 2em;
  padding: 2em;
  background: white;
  color: black;
  text-align: center;
}

/*
order:
 - inner red,
 - inner yellow,
 - outer red,
 - inner turquoise,
 - outer turquoise,
 - outer blue,
*/

#text-card.glasses-on {
  box-shadow:
      inset 0.07em 0.07em 0.15em red,
      inset 0.2em 0.2em 0.3em yellow,
      -0.07em -0.07em 0.15em rgba(255, 0, 0, 0.7),
      inset -0.15em -0.15em 0.15em rgba(50, 203, 255),
      0.07em 0.07em 0.07em rgba(50, 203, 255),
      0.4em 0.4em 0.3em rgba(0, 73, 255, 0.5),
      0.4em 0.4em 0.4em rgba(7, 42, 200, 0.2);
}

.black-text {
  font-weight: bold;
}

/*
order:
 - relative red,
 - absolute red,
 - relative blue,
 - absolute blue,
 - relative yellow,
 - absolute yellow,
 - relative turquoise,
 - absolute turquoise,
*/

.glasses-on .black-text {
  text-shadow:
    0.005em 0.005em 0.01em red,
    1px 1px 1px red,
    -0.01em -0.01em 0.01em rgb(16 16 248 / 0.7),
    -1px -1px 1px rgb(16 16 248 / 0.7),
    0.02em 0.02em 0.01em yellow,
    4px 4px 1px yellow,
    -0.02em -0.02em 0.01em rgb(50 246 255),
    -3px -3px 1px rgb(50 246 255);
}

#overlay {
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100%;
    display: none;
}

#overlay.blurred {
    z-index: 1;
    backdrop-filter: blur(10px);
    display: block;
}

#toggle {
    z-index: 2;
    position: fixed;
    left: 50%;
    bottom: 2em;
    transform: translate(-50%, -50%);
    color: black;
    background: white;
    border: black solid 0.1em;
    border-radius: 0.3em;
    font-family: Courier;
    padding: 0.3em;
    outline: none;
    width: auto;
    box-shadow: 0 0.5em 1em rgba(0, 0, 0, 0.8);
}

#toggle:hover {
    text-decoration: underline;
}

#toggle:active {
    color: #777;
}
</style>

<script>
    let on = false;
    let overlay;
    let button;
    let card;

    window.onload = () => {
        overlay = document.getElementById("overlay");
        button = document.getElementById("toggle");
        card = document.getElementById("text-card");
    };

    function toggle() {
        if (on) {
            overlay.classList.add("blurred");
            card.classList.remove("glasses-on");
            button.innerHTML = "Put on glasses";

            on = false;
        } else {
            overlay.classList.remove("blurred");
            card.classList.add("glasses-on");
            button.innerHTML = "Take off glasses";

            on = true;
        }
    }
</script>

<button id="toggle" style="font-size: 30px;" onclick="toggle()">Put on glasses</button>
<div id="overlay" class="blurred"></div>
<div id="text-card">
    <p class="black-text" style="font-size: 170px;">E</p>
    <p class="black-text" style="font-size: 130px;">F P</p>
    <p class="black-text" style="font-size: 110px;">T O Z</p>
    <p class="black-text" style="font-size: 80px;">L P E D</p>
    <p class="black-text" style="font-size: 70px;">P E C F D</p>
    <p class="black-text" style="font-size: 60px;">E D F C Z P</p>
</div>
{% end %}

# What am I looking at?

Recently I got a new pair of glasses. Can you see these red/yellow and blue/turquoise
edges? This is what I see when there's a high contrast between two blobs of colors, but only
when I look at them at an angle. Which side is red and which is blue depends on where
the object is in my field of view. The effect is especially strong in direct sunlight. It is called
[chromatic aberration](https://en.wikipedia.org/wiki/Chromatic_aberration).

While building this site I observed a really cool thing I didn't expect - when I tilt my head
at a certain angle I can almost make the colors on the screen disappear. It's like the colors
and the chromatic aberration cancel out.
