+++
title = "chromatic aberration"
date = 2021-04-21
template = "page.html"

[extra]
background = "black"
color = "white"
comments = true
+++

{% raw_html() %}
<style>

body {
  font-family: Courier;
}

.container {
  padding-bottom: 15vw;
}

a {
 color: dodgerblue;
}

a:visited {
  color: orangered;
}

#text-card p {
  margin: 0;
}

#text-card {
  box-sizing: border-box;
  width: 80%;
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

.desaturate {
    filter: saturate(10%);
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
    bottom: 0.6em;
    transform: translate(-50%, 0);
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
    let desaturate;

    window.onload = () => {
        overlay = document.getElementById("overlay");
        button = document.getElementById("toggle");
        desaturate = document.getElementsByClassName("desaturate");

        takeOff(); // Make sure everything is set up correctly.
    };
   
   
    function takeOff() {
        overlay.classList.add("blurred");
        button.innerHTML = "put on glasses";

        for (let img of desaturate) {
            img.style.filter = "saturate(10%)";
        }
    }
    
    function putOn() {
        overlay.classList.remove("blurred");
        button.innerHTML = "take off glasses";

        for (let img of desaturate) {
            img.style.filter = "none";
        }
    }

    function toggle() {
        if (on) {
            takeOff();

            on = false;
        } else {
            putOn();

            on = true;
        }
    }
</script>

<button id="toggle" style="font-size: 1.5rem;" onclick="toggle()">put on glasses</button>
<div id="overlay" class="blurred"></div>
{% end %}

{{ image(src="text-card.svg", maxh="50em", class="desaturate") }} 

# what am I looking at?

recently I got a new pair of glasses. can you see these red/yellow and blue/turquoise
edges? this is what I see when there's a high contrast between two blobs of colors, but only
when I look at them at an angle. which side is red and which is blue depends on where
the object is in my field of view. the effect is especially strong in direct sunlight. it is called
[chromatic aberration](https://en.wikipedia.org/wiki/Chromatic_aberration).

while building this site I observed a really cool thing I didn't expect - when I tilt my head
at a certain angle I can almost make the colors on the screen disappear. it's like the colors
and the chromatic aberration cancel out.

here's a painting depicting the effect by /[Wojciech Fangor](https://culture.pl/en/artist/wojciech-fangor)/, a Polish artist.

{{ image(src="wojciech-fangor-sm-34-1974.jpg", maxh="30em", desc="SM 34 by Wojciech Fangor", class="desaturate") }}

and here's a beautiful artwork from /[Grif Studio](https://www.grif.studio/)/. they also put up a [gallery](https://www.grif.studio/chromatic) and a [short film](https://www.grif.studio/chromaticfilm) capturing a similar phenomenon.

{{ image(src="https://mir-s3-cdn-cf.behance.net/project_modules/1400_opt_1/15381756555015.59b2ef09aaaf2.jpg", maxh="30em", desc="Chromatic Black from Grif Studio", class="desaturate") }}
