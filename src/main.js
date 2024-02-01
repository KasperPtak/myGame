import kaboom from "kaboom";
import { spawnEnemy, createWalls, createPlayer } from "./entities.js";

const k = kaboom();
const playerSpeed = 800;
const { player, sword } = createPlayer(k);
const { topWall, bottomWall } = createWalls(k);

// setBackground(100, 100, 100);

k.loadSprite("bg", "sprites/seamless_swamp.jpg");
k.loadSprite("bean", "sprites/bean.png");
k.loadSprite("master-sword", "sprites/master-sword.png");
k.loadSprite("frog", "sprites/BlueBlue/ToxicFrogBlueBlue_Sheet.png", {
  sliceX: 9,
  sliceY: 5,
  anims: {
    hop: {
      from: 0,
      to: 6,
      loop: true,
    },
    hurt: {
      from: 26,
      to: 30,
    },
  },
});


const currentHealth = add([
  text("Health:" + player.hp()),
  pos(width() / 2, 40),
  color(0, 0, 255),
  fixed(),
  anchor("center"),
  z(2),
]);

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
});

player.onHurt(() => {
  currentHealth.text = "Health:" + player.hp();
});

player.onDeath(() => {
  go("defeat");
});

function populateBackground(playerPos) {
  
  const background = add([
    pos(playerPos, 120),
    sprite('bg'),
  ])

}
populateBackground(player.pos.x)


k.scene("defeat", () => {
  add([text("You Lose!"), pos(width() / 2, height() / 2), anchor("center")]);
});
