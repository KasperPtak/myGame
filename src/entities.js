export function createPlayer(k) {
  const player = k.add([
    k.pos(k.center()),
    k.sprite("bean"),
    k.area(),
    k.body(),
    k.health(10),
    k.anchor("center"),
    z(3),

  ]);

  const sword = player.add([
    k.sprite("master-sword"),
    k.rotate(0),
    k.anchor("bot"),
    k.scale(3),
    k.area(),
    "sword",
    z(3),

  ]);

  player.onUpdate(() => {
    sword.angle += 200 * k.dt();
  });

  return { player, sword };
}

export function createWalls(k) {
  const wallHeight = 120;

  const topWall = k.add([
    k.pos(0, 0),
    k.rect(k.width(), wallHeight),
    k.outline(4),
    k.area(),
    k.body({ isStatic: true }),
    "wall",
    z(3),
    
  ]);

  const bottomWall = k.add([
    k.pos(0, k.height() - wallHeight),
    k.rect(k.width(), wallHeight),
    k.outline(4),
    k.area(),
    k.body({ isStatic: true }),
    z(3),

  ]);

  return { topWall, bottomWall };
}

export function spawnEnemy(k, player, topWall, bottomWall) {
  const playerSpeed = 800;
  const spawnSide = k.rand() < 0.5 ? -1 : 1;
  const spawnX = player.pos.x + (spawnSide * k.width()) / 2 + k.rand(20, 50);
  const spawnY = k.rand(bottomWall.pos.y - 120, topWall.pos.y - 120);

  const enemy = k.add([
    k.pos(spawnX, spawnY),
    k.sprite("frog"),
    k.anchor("center"),
    k.scale(2.5),
    k.body(),
    k.area(scale(0.5)),
    k.rotate(0),
    k.health(10),
    "enemy",
    z(3),

    // k.area({
    //     scale: 0.5,
    //     collisionIgnore: 'enemy',
    // }),
  ]);

  // TODO: somehow change enemy movement to not run on every frame
  //   loop(.5, () => {
  //     const direction = vec2(player.pos).sub(enemy.pos).unit();
  //     enemy.move(direction.scale(playerSpeed / 4));
  //   });

  let isHopping = false;

  player.onUpdate(() => {
    const direction = vec2(player.pos).sub(enemy.pos).unit();
    enemy.move(direction.scale(playerSpeed / 4));

    if (enemy.pos.x > player.pos.x) {
      enemy.scale.x = -Math.abs(enemy.scale.x); // Flip the enemy
    } else {
      enemy.scale.x = Math.abs(enemy.scale.x); // Reset scale
    }
    enemy.angle = Math.atan2(direction.y, direction.x);

    if (!isHopping) {
      enemy.play("hop");
      isHopping = true;
    }
  });
  return enemy;
}
