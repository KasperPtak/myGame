export function spawnBackgroundObjects(k, player) {
    const spawnXStartLeft = player.pos.x - 2000;
    const spawnXEndLeft = player.pos.x - 1000;
    const spawnXStartRight = player.pos.x + 1000;
    const spawnXEndRight = player.pos.x + 2000;
    const xSpacing = 260;
  
    const backgroundObjects = [];
  
    for (let xPos = spawnXStartLeft; xPos <= spawnXEndLeft; xPos += xSpacing) {
      spawnBackgroundObjectRow(k, xPos, backgroundObjects);
    }
  
    for (let xPos = spawnXStartRight; xPos <= spawnXEndRight; xPos += xSpacing) {
      spawnBackgroundObjectRow(k, xPos, backgroundObjects);
    }
  
    return backgroundObjects;
  }
  
  export function spawnBackgroundObjectRow(k, xPos, backgroundObjects) {
    const yPositions = [120, 380, 640, 900, 1160];
  
    const backgroundRow = yPositions.map((yPos) => {
      return k.add([
        k.pos(xPos, yPos),
        k.sprite("bg"), 
        k.scale(0.2), 
        "bg",
        z(0),
      ]);
    });
  
    backgroundObjects.push(...backgroundRow);
  }
  