import kaboom from "kaboom";

const k = kaboom();

const playerSpeed = 800;
const wallHeight = 120;

k.loadSprite("bean", "sprites/bean.png");

const player = k.add([k.pos(center()), k.sprite("bean"), k.area(), k.body()]);

// topWall
const topWall = k.add([
  k.pos(0, 0),
  k.rect(width(), wallHeight),
  k.outline(4),
  k.area(),
  k.body({ isStatic: true }),
  "wall",
]);

//bottomWall
const bottomWall = k.add([
  k.pos(0, height() - wallHeight),
  k.rect(width(), wallHeight),
  k.outline(4),
  k.area(),
  k.body({ isStatic: true }),
]);

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

function spawnEnemy() {
  const spawnSide = k.rand() < 0.5 ? -1 : 1; // Randomly choose left (-1) or right (1) side
  const spawnX = player.pos.x + (spawnSide * k.width()) / 2 + k.rand(20, 50); // Dynamic spawnX based on player's x position and chosen side
  const spawnY = k.rand(bottomWall.pos.y - 120, topWall.pos.y - 120); // Random Y position within the walls
  const enemy = k.add([
    k.pos(spawnX, spawnY),
    k.sprite("bean"),
    k.area(),
    k.body(),
    "enemy",
  ]);

  player.onUpdate(() => {
    const direction = vec2(player.pos).sub(enemy.pos).unit();
    enemy.move(direction.scale(playerSpeed / 4));
  });
}

k.loop(1, () => {
  spawnEnemy();
});

player.onUpdate(() => {
  k.camPos(player.pos.x, height() / 2);

  bottomWall.pos.x = player.pos.x - width() / 2;
  topWall.pos.x = player.pos.x - width() / 2;

  player.onCollide("enemy", () => {
    debug.log("leave grass");
    go("defeat");
    debug.log(player.pos.x);
  });

  scene("defeat", () => {
    add([text("You Lose!"), pos(width() / 2, height() / 2), anchor("center")]);
  });
});
