import kaboom from "kaboom";

const k = kaboom();

const playerSpeed = 1000;
const wallHeight = 120;

k.loadSprite("bean", "sprites/bean.png");

const player = k.add([k.pos(center()), k.sprite("bean"), k.area(), k.body()]);

const npc = k.add([k.pos(center()), k.sprite("bean"), k.area(), k.body()]);

// topWall
const topWall = k.add([
  k.pos(0, 0),
  k.rect(width(), wallHeight),
  k.outline(4),
  k.area(),
  k.body({ isStatic: true }),
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

function chasePlayer() {
  const direction = vec2(player.pos).sub(npc.pos).unit();
  npc.move(direction.scale(playerSpeed / 4));
}

player.onUpdate(() => {
  k.camPos(player.pos.x, height() / 2);

  bottomWall.pos.x = player.pos.x - width() / 2;
  topWall.pos.x = player.pos.x - width() / 2;

  chasePlayer();
});
