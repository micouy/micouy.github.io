/*
UWAGI:
- skomplikowane
- problemy z załadowaniem odpowiedniego rozmiaru
  i kolejności klatek animacji
- problemy z wykrywaniem kierunku kolizji
- nie da się łatwo wykryć dobicia do ściany
- niejasny podział na ciało i obiekt/sprite
- beznadziejna dokumentacja Phasera
- niejasne kiedy używać this.add vs this.physics.add,
  thing.destroy() vs this.removeThing vs this.things.remove,
  this.anims vs thing.anims, this.body.enabled = false
  vs this.disableBody(true, true)
- mnóstwo tajemniczych argumentów
*/

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1200 },
            debug: false,
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);
let cursors;
let points = 0;
let banner;

let player;
let platforms;
let coins
let slime;
let slimeVelocity = -80;

let playerPlatformCollider;
let slimePlatformCollider;
let playerSlimeOverlap;

function preload() {
    // załaduj obrazy
    this.load.image('p1_walk01', 'assets/p1_walk01.png');
    this.load.image('p1_walk02', 'assets/p1_walk02.png');
    this.load.image('p1_walk03', 'assets/p1_walk03.png');
    this.load.image('p1_walk04', 'assets/p1_walk04.png');
    this.load.image('p1_walk05', 'assets/p1_walk05.png');
    this.load.image('p1_walk06', 'assets/p1_walk06.png');
    this.load.image('p1_walk07', 'assets/p1_walk07.png');
    this.load.image('p1_walk08', 'assets/p1_walk08.png');
    this.load.image('p1_walk09', 'assets/p1_walk09.png');
    this.load.image('p1_walk10', 'assets/p1_walk10.png');
    this.load.image('p1_walk11', 'assets/p1_walk11.png');

    this.load.image('slime_walk01', 'assets/slime_walk01.png');
    this.load.image('slime_walk02', 'assets/slime_walk02.png');

    this.load.image('grass', 'assets/grass.png');
    this.load.image('background', 'assets/background.png');
    this.load.image('coin', 'assets/coin.png');
}

function create() {
    // dodaj wykrywanie strzałek
    cursors = this.input.keyboard.createCursorKeys();

	// dodaj animacje
    this.anims.create({
        key: 'player_walk',
        frames: [
            { key: 'p1_walk01' },
            { key: 'p1_walk02' },
            { key: 'p1_walk03' },
            { key: 'p1_walk04' },
            { key: 'p1_walk05' },
            { key: 'p1_walk06' },
            { key: 'p1_walk07' },
            { key: 'p1_walk08' },
            { key: 'p1_walk09' },
            { key: 'p1_walk10' },
            { key: 'p1_walk11' },
        ],
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'player_stand',
        frames: [{ key: 'p1_walk10' }],
        frameRate: 10,
        repeat: -1,
    });

    this.anims.create({
        key: 'slime_walk',
        frames: [
            { key: 'slime_walk01' },
            { key: 'slime_walk02' },
        ],
        frameRate: 10,
        repeat: -1,
    });

	// dodaj powtarzalny obraz tła (tile sprite)
    this.add.tileSprite(400, 300, 70 * 12, 70 * 9, 'background');

    // dodaj gracza
    player = this.physics.add.sprite(100, 450, 'p1_walk10');
    player.play('player_stand');
    player.setCollideWorldBounds(true);
    player.setDepth(1);

	// dodaj platformy
    platforms = this.physics.add.group({
        allowGravity: false,
        immovable: true,
    });
    platforms.add(this.add.tileSprite(400, 565, 70 * 12, 70, 'grass'));
    platforms.add(this.add.tileSprite(600, 370, 70 * 4, 70, 'grass'));
    platforms.add(this.add.tileSprite(200, 250, 70 * 4, 70, 'grass'));

	// dodaj kolizje między graczem a platformami
    playerPlatformCollider = this.physics.add.collider(player, platforms);

	// dodaj slime'a
    slime = this.physics.add.sprite(300, 500, 'slime_walk01');
    slime.anims.play('slime_walk');

	// dodaj kolizje między slime'em i platformami
    slimePlatformCollider = this.physics.add.collider(slime, platforms);

    // dodaj zetknięcia między graczem i slime'em
    playerSlimeOverlap = this.physics.add.overlap(player, slime, touchSlime, null, this);

	// dodaj grupę monet
    coins = this.physics.add.group({
        allowGravity: false,
        immovable: true,
    });
    coins.add(this.physics.add.sprite(600, 280, 'coin'));
    coins.add(this.physics.add.sprite(200, 160, 'coin'));

    // dodaj zetknięcia z graczem
    this.physics.add.overlap(player, coins, touchCoin, null, this);

	// dodaj banner z punktami
    banner = this.add.text(16, 16, `points: ${points}`, {
        fontSize: '32px',
        fill: '#000'
    });
}

function touchSlime(player, slime) {
    if (player.body.touching.down && slime.body.touching.up) {
        // jeśli gracz naskoczył na slime'a...

        // usuń kolizje i zetknięcia slime'a
        this.physics.world.removeCollider(slimePlatformCollider);
        playerSlimeOverlap.destroy();
        slime.setCollideWorldBounds(false);

		// skocz graczem
        player.setVelocityY(-700);

		// odegraj śmierć slime'a
        slime.setVelocityY(-300);
        slime.flipY = true;
    } else if ((player.body.touching.left && slime.body.touching.right) ||
        (player.body.touching.right && slime.body.touching.left)) {
        // jeśli gracz dotknął slime'a od boku...

        // usuń zetknięcia i kolizje z graczem
        this.physics.world.removeCollider(playerPlatformCollider);
        playerSlimeOverlap.destroy();
        player.setCollideWorldBounds(false);

        // odegraj śmierć gracza
        player.anims.play('player_stand');
        player.setVelocityY(-300);
        player.flipY = true;

        // ustaw banner
        banner.setText('game over');
    }
}

function touchCoin(player, coin) {
    // zwiększ punkty, usuń monetę i zaktualizuj banner
    points += 1;
    coin.disableBody(true, true);
    banner.setText(`points: ${points}`);
}

function update() {
    // ustaw animacje i prędkość po naciśnięciu
    // lub puszczeniu strzałek
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('player_walk', true);
        player.flipX = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('player_walk', true);
        player.flipX = false;
    } else {
        player.setVelocityX(0);
        player.anims.play('player_stand');
    }

	// jeśli gracz dotyka podłogi i naciśnięta strzałka w górę,
	// to skocz graczem
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-600);
    }

	// zawróć slime'a gdy dojdzie do ściany
    if (slime.body.right > 790) {
        slimeVelocity = -Math.abs(slimeVelocity);
        slime.flipX = false;
    } else if (slime.body.left < 10) {
        slimeVelocity = Math.abs(slimeVelocity);
        slime.flipX = true;
    }

    slime.setVelocityX(slimeVelocity);

	// usuń ciała gdy wypadną poza świat
    if (player.body.y > 1000) {
        player.disableBody(true, true);
    }

    if (slime.body.y > 1000) {
        slime.disableBody(true, true);
    }
}
