var player;
var clavier;
var gameOver = false;
var surVerglas = false;
var calqueVerglas1;
var calqueVerglas2;

export default class niveau3 extends Phaser.Scene {
  constructor() {
    super({
      key: "niveau3"
    });
  }

  preload() {
    this.load.spritesheet("img_perso", "src/assets/dude.png", {
      frameWidth: 32,
      frameHeight: 48
    });

    this.load.image("img_glace", "src/assets/glace.png");
    this.load.image("img_porte_sortie", "src/assets/door_exit.png");

    this.load.image("fondneige", "src/assets/fondneige.png");
    this.load.image("blocneige", "src/assets/blocneige.png");
    this.load.image("objetneige", "src/assets/objetneige.png");

    this.load.tilemapTiledJSON("map_montagne", "src/assets/montagne.tiled-project.tmj");
  }

  create() {
    const carteDuNiveau = this.add.tilemap("map_montagne");

    const tilesetFond = carteDuNiveau.addTilesetImage(
      "ChatGPT Image 17 mars 2026, 11_15_41",
      "fondneige"
    );

    const tilesetBloc = carteDuNiveau.addTilesetImage(
      "ChatGPT Image 17 mars 2026, 11_47_33",
      "blocneige"
    );

    const tilesetObjet = carteDuNiveau.addTilesetImage(
      "ChatGPT Image 17 mars 2026 à 12_01_52",
      "objetneige"
    );

    calqueVerglas1 = carteDuNiveau.createLayer(
      "Calque de Tuiles 1",
      [tilesetFond, tilesetBloc, tilesetObjet],
      0,
      0
    );

    calqueVerglas2 = carteDuNiveau.createLayer(
      "Calque de Tuiles 2",
      [tilesetFond, tilesetBloc, tilesetObjet],
      0,
      0
    );

    calqueVerglas1.setCollisionByProperty({ estSolide: true });
    calqueVerglas2.setCollisionByProperty({ estSolide: true });

    player = this.physics.add.sprite(100, 100, "img_perso");
    player.setCollideWorldBounds(true);
    player.setBounce(0.2);

    // Réglages de base du déplacement
    player.setMaxVelocity(200, 500);
    player.setDragX(1200);

    this.physics.add.collider(player, calqueVerglas1);
    this.physics.add.collider(player, calqueVerglas2);

    clavier = this.input.keyboard.createCursorKeys();

    this.anims.create({
      key: "anim_tourne_gauche",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_tourne_droite",
      frames: this.anims.generateFrameNumbers("img_perso", { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: "anim_face",
      frames: [{ key: "img_perso", frame: 4 }],
      frameRate: 20
    });

    this.physics.world.setBounds(0, 0, 3200, 960);
    this.cameras.main.setBounds(0, 0, 3200, 960);
    this.cameras.main.startFollow(player);

    // ===== GLACES : pareil que niveau 1 et 2 =====
    this.glaces = this.physics.add.group();
    this.maxGlacesEcran = 4;

    this.physics.add.collider(this.glaces, calqueVerglas1);
    this.physics.add.collider(this.glaces, calqueVerglas2);
    this.physics.add.overlap(player, this.glaces, toucheGlace, null, this);

    this.timerGlace = this.time.addEvent({
      delay: 2000,
      callback: spawnGlace,
      callbackScope: this,
      loop: true
    });

    this.porte_sortie = this.physics.add.staticSprite(3000, 700, "img_porte_sortie");

    this.add.text(2850, 620, "Appuie sur ESPACE", {
      fontSize: "18px",
      fill: "#ffffff",
      backgroundColor: "#000000"
    });
  }

  update() {
    if (gameOver) return;
    if (!clavier || !player) return;

    const xPieds = player.x;
    const yPieds = player.body.bottom + 2;

    const tuile1 = calqueVerglas1.getTileAtWorldXY(xPieds, yPieds, true);
    const tuile2 = calqueVerglas2.getTileAtWorldXY(xPieds, yPieds, true);

    surVerglas = false;

    if (tuile1 && tuile1.properties && tuile1.properties.estVerglas) {
      surVerglas = true;
    }

    if (tuile2 && tuile2.properties && tuile2.properties.estVerglas) {
      surVerglas = true;
    }

    // ==================================================
    // ICI TU CHANGES LE NIVEAU DE GLISSE
    //
    // Plus la valeur est PETITE, plus ça glisse
    // Plus la valeur est GRANDE, moins ça glisse
    //
    // Exemples :
    // 100 = un peu glissant
    // 50 = bien glissant
    // 20 = très glissant
    // 5 = ça glisse énormément
    // ==================================================
    if (surVerglas) {
      player.setDragX(20);
    } else {
      player.setDragX(1200);
    }

    if (clavier.right.isDown) {
      player.setAccelerationX(600);
      player.anims.play("anim_tourne_droite", true);
    } else if (clavier.left.isDown) {
      player.setAccelerationX(-600);
      player.anims.play("anim_tourne_gauche", true);
    } else {
      player.setAccelerationX(0);

      if (Math.abs(player.body.velocity.x) < 5) {
        player.setVelocityX(0);
        player.anims.play("anim_face", true);
      }
    }

    if (clavier.up.isDown && player.body.blocked.down) {
      player.setVelocityY(-250);
    }

    if (Phaser.Input.Keyboard.JustDown(clavier.space)) {
      if (this.physics.overlap(player, this.porte_sortie)) {
        this.scene.start("fin");
      }
    }

    this.glaces.children.each(function (glace) {
      if (glace.y > 1200) {
        glace.destroy();
      }
    });
  }
}

function spawnGlace() {
  if (gameOver) return;

  var cameraX = this.cameras.main.scrollX;
  var cameraY = this.cameras.main.scrollY;
  var largeurCamera = this.cameras.main.width;
  var hauteurCamera = this.cameras.main.height;

  var nbGlacesVisibles = 0;

  this.glaces.children.each(function (glace) {
    if (
      glace.active &&
      glace.x >= cameraX &&
      glace.x <= cameraX + largeurCamera &&
      glace.y >= cameraY - 100 &&
      glace.y <= cameraY + hauteurCamera + 100
    ) {
      nbGlacesVisibles++;
    }
  });

  if (nbGlacesVisibles >= this.maxGlacesEcran) {
    return;
  }

  var x = Phaser.Math.Between(cameraX, cameraX + largeurCamera);
  var y = cameraY - 50;

  var glace = this.glaces.create(x, y, "img_glace");

  glace.setScale(0.7);
  glace.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  glace.setBounceX(0.2);
  glace.setVelocity(
    Phaser.Math.Between(-50, 50),
    Phaser.Math.Between(120, 180)
  );
}

function toucheGlace(player, glace) {
  if (gameOver) return;

  gameOver = true;

  this.physics.pause();
  this.timerGlace.remove();

  player.setTint(0xff0000);

  this.tweens.add({
    targets: player,
    alpha: 0,
    duration: 500
  });

  this.add.text(player.x - 100, player.y - 50, "GAME OVER", {
    fontSize: "48px",
    fill: "#ff0000"
  }).setDepth(100);
}