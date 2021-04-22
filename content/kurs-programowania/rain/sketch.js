const N_DROPS = 500;

let drops = [];

function setup() {
  let cnv = createCanvas(1000, 300);
  cnv.parent('rain');
  generateDrops(drops);
}

function draw() {
  background(98, 144, 200, 180);

  for (let drop of drops) {
      drop.update();
      drop.draw();
  }
}

function generateDrops(drops) {
    drops.splice(0, drops.length);

    for (let i = 0; i < N_DROPS; i++) {
        drops.push(new Drop());
    }
}
