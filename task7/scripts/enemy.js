
class Enemy {
  #hp;
  #canShoot;
  #score;
  #level;
  constructor(hp, options) {
    this.#hp = hp;
    this.#canShoot = options.canShoot;
    this.#score = options.score;
    this.#level = options.level;
  }

  static createEnemy(positionX, positionY, level) {
    switch (level) {
      case 1: {
        return this.createEnemyLevel1(positionX, positionY);
      }
      case 2: {
        return this.createEnemyLevel2(positionX, positionY);
      }
      case 3: {
        return this.createEnemyLevel3(positionX, positionY);
      }
      case 4: {
        return this.createEnemyLevelBoss(positionX, positionY);
      }
    }
  }

  static createEnemyLevel1(positionX, positionY) {
    let enemy;
    if (positionY > 1 && positionY < 4) {
      enemy = new Enemy(2, { canShoot: false, score: 15, level: 2 });
    } else {
      enemy = new Enemy(1, { canShoot: false, score: 10, level: 1 });
    }

    return {
      enemy,
    };
  }

  static createEnemyLevel2(positionX, positionY) {
    let enemy;
    if (positionY > 1 && positionY < 3) {
      enemy = new Enemy(2, { canShoot: true, score: 25, level: 4 });
    } else if (positionY >= 3 && positionY < 4) {
      enemy = new Enemy(1, { canShoot: true, score: 20, level: 3 });
    } else if (positionY >= 4 && positionY < 5) {
      enemy = new Enemy(2, { canShoot: false, score: 15, level: 2 });
    } else {
      enemy = new Enemy(1, { canShoot: false, score: 10, level: 1 });
    }

    return {
      enemy
    };
  }

  static createEnemyLevel3(positionX, positionY) {
    let enemy;
    if (positionY > 1 && positionY < 3) {
      enemy = new Enemy(2, { canShoot: true, score: 30, level: 5 });
    } else if (positionY >= 3 && positionY < 4) {
      enemy = new Enemy(2, { canShoot: true, score: 25, level: 4 });
    } else if (positionY >= 4 && positionY < 5) {
      enemy = new Enemy(1, { canShoot: false, score: 20, level: 3 });
    } else if (positionY >= 5 && positionY < 6) {
      enemy = new Enemy(2, { canShoot: false, score: 15, level: 2 });
    } else {
      enemy = new Enemy(1, { canShoot: false, score: 10, level: 1 });
    }

    return {
      enemy
    };
  }

  static createEnemyLevelBoss(positionX, positionY){
    let enemy
    if(positionY > 1 && positionY < 4 && positionX > 14 && positionX < 19){
      enemy = new Enemy(2, { canShoot: true, score: 30, level: 5 });
    } else {
      enemy = {}
    }
    return{
      enemy
    }
  }

  static moveEnemy(game) {
    if (game.moveDirection === 'right') {
      if (game.battlefield[6][34]?.enemy) {
        game.moveDirection = 'left';
        Enemy.moveEnemyLeft(game);
      } else {
        Enemy.moveEnemyRight(game);
      }
    } else if (game.moveDirection === 'left') {
      if (game.battlefield[6][0]?.enemy) {
        game.moveDirection = 'right';
        Enemy.moveEnemyRight(game);
      } else {
        Enemy.moveEnemyLeft(game);
      }
    } else {
      this.moveEnemy();
    }
  }

  static moveEnemyRight(game) {
    for (let y = 0; y < game.battlefield.length; y++) {
      let row = game.battlefield[y];
      for (let x = game.sizeX - 1; x >= 0; x--) {
        if (row[x]?.enemy) {
          if (x < game.sizeX - 1) {

            row[x + 1].enemy = row[x].enemy;
            delete row[x].enemy

          }
        }
      }
    }
  }

  static moveEnemyLeft(game) {
    for (let y = 0; y < game.battlefield.length; y++) {
      let row = game.battlefield[y];
      for (let x = 0; x < game.sizeX; x++) {
        if (row[x]?.enemy) {
          if (x > 0) {
            row[x - 1].enemy = row[x].enemy;
            delete row[x].enemy
          }
        }
      }
    }
  }

  static areAllEnemiesDefeated(game) {
    for (let y = 0; y < game.sizeY; y++) {
      for (let x = 0; x < game.sizeX; x++) {
        if (game.battlefield[y][x]?.enemy) {
          return false; // Если найден хотя бы один враг, вернуть false
        }
      }
    }
    return true; // Если не найдено ни одного врага, вернуть true
  }

  get hp() {
    return this.#hp;
  }

  set hp(newHp) {
    this.#hp = newHp;
  }

  get level() {
    return this.#level;
  }

  get score() {
    return this.#score;
  }

  get canShoot() {
    return this.#canShoot;
  }
}

export { Enemy };
