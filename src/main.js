import kaboom from "kaboom";
import { spawnEnemy, createWalls, createPlayer } from "./entities.js";

const k = kaboom();
const playerSpeed = 600;

import { spawnBackgroundObjects } from "./generateBackground.js";

// setBackground(100, 100, 100);

k.loadSound("oof", "sounds/classic_hurt.mp3");
k.loadSprite("bg", "sprites/seamless_swamp.jpg");
k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("master-sword", "sprites/master-sword.png");
k.loadSprite("frog", "sprites/BlueBlue/ToxicFrogBlueBlue_Sheet.png", {
  sliceX: 9,
  sliceY: 5,
  anims: {
    hop: {
      from: 9,
      to: 15,
      loop: true,
    },
    hurt: {
      from: 26,
      to: 30,
    },
  },
});

k.scene("menu", () => {
  setBackground(255, 105, 180);

  let selectedCharacter = "bean";
  const characters = [
    "frog (not implemented)",
    "bean ",
    "master-sword (not implemented)",
  ];

  const welcomeText = add([
    text(
      `Welcome to Frog Survivors!\nSelected Character: ${selectedCharacter}`
    ),
    pos(width() / 2, height() / 2),
    anchor("center"),
  ]);

  add([
    text("Press spacebar to begin"),
    pos(width() / 2, height() / 2 + 100),
    anchor("center"),
  ]);

  onKeyPress("right", () => {
    // Switch characters when right arrow key is pressed
    const currentIndex = characters.indexOf(selectedCharacter);
    selectedCharacter = characters[(currentIndex + 1) % characters.length];
    updateWelcomeText();
  });

  onKeyPress("left", () => {
    // Switch characters back when left arrow key is pressed
    const currentIndex = characters.indexOf(selectedCharacter);
    selectedCharacter =
      characters[(currentIndex - 1 + characters.length) % characters.length];
    updateWelcomeText();
  });

  function updateWelcomeText() {
    welcomeText.text = `Welcome to Frog Survivors!\nSelected Character: ${selectedCharacter}`;
  }

  onKeyPress("space", () => {
    go("game");
  });
});
go("menu");

k.scene("game", () => {
  const { player, sword } = createPlayer(k);
  const { topWall, bottomWall } = createWalls(k);
  const currentHealth = add([
    text("Health:" + player.hp()),
    pos(width() / 2, 40),
    color(0, 0, 255),
    fixed(),
    anchor("center"),
    z(4),
  ]);

  k.loop(1.25, () => {
    spawnBackgroundObjects(k, player);
  });

  const enemies = []; // Array to store spawned enemies
  k.loop(rand(0.5, 1.5), () => {
    const enemy = spawnEnemy(k, player, topWall, bottomWall);
    enemies.push(enemy);
  });

  onKeyDown("left", () => {
    player.move(-playerSpeed, 0);
  });
  onKeyDown("right", () => {
    player.move(playerSpeed, 0);
  });
  onKeyDown("up", () => {
    player.move(0, -playerSpeed);
  });
  onKeyDown("down", () => {
    player.move(0, playerSpeed);
  });

  player.onUpdate(() => {
    k.camPos(player.pos.x, height() / 2);

    //TODO: change this to check on player y pos instead of moving walls
    bottomWall.pos.x = player.pos.x - width() / 2;
    topWall.pos.x = player.pos.x - width() / 2;
  });

  function moveEnemySmoothly(enemy, targetX, duration) {
    let curTween = null;
    // Stop previous tween, if any
    if (curTween) curTween.cancel();

    // Start the tween animation
    curTween = tween(
      // Start value
      enemy.pos.x,
      // Destination value
      enemy.pos.x + targetX,
      // Duration (in seconds)
      duration,
      // Update function
      (val) => (enemy.pos.x = val),
      // Interpolation function (defaults to easings.linear)
      easings["easeOutQuad"]
    );
  }
  sword.onCollide("enemy", (enemy) => {
    debug.log("Sword collided with an enemy!");
    enemy.hurt(1);
    enemy.play("hurt");
    wait(0.6, () => {
      enemy.play("hop");
    });
    if (enemy.pos.x < player.pos.x) {
      debug.log("move left");
      moveEnemySmoothly(enemy, -200, 0.3);
    } else {
      moveEnemySmoothly(enemy, +200, 0.3);
    }

    if (enemy.hp() <= 0) {
      destroy(enemy);
      enemies.splice(enemies.indexOf(enemy), 1);
    }
  });

  player.onCollide("enemy", () => {
    player.hurt(3);
    play("oof");
  });

  player.onHurt(() => {
    currentHealth.text = "Health:" + player.hp();
  });

  player.onDeath(() => {
    go("defeat");
  });

  //set starting background
  for (let i = -500; i <= 2000; i += 260) {
    k.add([k.pos(i, 120), k.sprite("bg"), k.scale(0.2), "bg", z(0)]);
    k.add([k.pos(i, 380), k.sprite("bg"), k.scale(0.2), "bg", z(0)]);
    k.add([k.pos(i, 640), k.sprite("bg"), k.scale(0.2), "bg", z(0)]);
    k.add([k.pos(i, 900), k.sprite("bg"), k.scale(0.2), "bg", z(0)]);
    k.add([k.pos(i, 1160), k.sprite("bg"), k.scale(0.2), "bg", z(0)]);
  }
});

k.scene("defeat", () => {
  add([text("You Lose!"), pos(center()), anchor("center")]);
  add([
    text("Press spacebar to try again, or ESC to return to the menu"),
    pos(width() / 2, height() / 2 + 100),
    anchor("center"),
  ]);
  onKeyPress("escape", () => {
    go("menu");
  });
  onKeyPress("space", () => {
    go("game");
  });
});
