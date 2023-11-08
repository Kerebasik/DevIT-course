
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

  // в зависимости от уровня создаем определенных врагов
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


  // матрица создания врагов первого уровня
  static createEnemyLevel1(positionX, positionY) {
    let enemy;
    if (positionY > 1 && positionY < 4) { // c 1 < y < 4 создаем врагов 2 уровня
      enemy = new Enemy(2, { canShoot: false, score: 15, level: 2 });
    } else { //остальные обычные враги 1 уровня
      enemy = new Enemy(1, { canShoot: false, score: 10, level: 1 });
    }

    return {
      enemy,
    };
  }

  static createEnemyLevel2(positionX, positionY) {
    let enemy;
    if (positionY > 1 && positionY < 3) {
      // с позиции 1 < y < 3 создаем врагов 4 уровня
      enemy = new Enemy(2, { canShoot: true, score: 25, level: 4 });
    } else if (positionY >= 3 && positionY < 4) {
      // с позиции 3 =< y < 4 создаем врагов 3 уровня
      enemy = new Enemy(1, { canShoot: true, score: 20, level: 3 });
    } else if (positionY >= 4 && positionY < 5) {
      // с позиции 4=<y<5 создаем врагов 2 уровня
      enemy = new Enemy(2, { canShoot: false, score: 15, level: 2 });
    } else { // остальные обычные враги 1 уровня
      enemy = new Enemy(1, { canShoot: false, score: 10, level: 1 });
    }

    return {
      enemy
    };
  }

  static createEnemyLevel3(positionX, positionY) {
    let enemy;
    if (positionY > 1 && positionY < 3) {
      // с позиции 1 < y < 3 создаем врагов 5 уровня
      enemy = new Enemy(2, { canShoot: true, score: 30, level: 5 });
    } else if (positionY >= 3 && positionY < 4) {
      // с позиции 3 =< y< 4 создаем врагов 4 уровня
      enemy = new Enemy(2, { canShoot: true, score: 25, level: 4 });
    } else if (positionY >= 4 && positionY < 5) {
      // с позиции 4 =< y < 5 создаем врагов 3 уровня
      enemy = new Enemy(1, { canShoot: false, score: 20, level: 3 });
    } else if (positionY >= 5 && positionY < 6) {
      // с позиции 5 =< y < 6 создаем врагов 2 уровня
      enemy = new Enemy(2, { canShoot: false, score: 15, level: 2 });
    } else {
      // остальные обычные враги 1 уровня
      enemy = new Enemy(1, { canShoot: false, score: 10, level: 1 });
    }

    return {
      enemy
    };
  }

  static createEnemyLevelBoss(positionX, positionY){
    let enemy
    // создаем босса 5 на 2 в центре поля из врагов 5 уровня
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
    // проверяем направления движения
    if (game.moveDirection === 'right') {
      // если враги в крайнем правом, то меняем направление движения на лево и вызываем шаг влево
      if (game.battlefield[6][34]?.enemy) {
        game.moveDirection = 'left';
        Enemy.moveEnemyLeft(game);
      } else {
        // если врага нет в крайнем правом положение, то делаем шаг вправо
        Enemy.moveEnemyRight(game);
      }
    } else if (game.moveDirection === 'left') {
      if (game.battlefield[6][0]?.enemy) {
        // если враги в крайнем левом, то меняем направление движения на право и вызываем шаг влево
        game.moveDirection = 'right';
        Enemy.moveEnemyRight(game);
      } else {
        // если врага нет в крайнем левом положение, то делаем шаг влево
        Enemy.moveEnemyLeft(game);
      }
    } else {
      this.moveEnemy();
    }
  }

  //делаем шаг вправо
  static moveEnemyRight(game) {
    // проходимся по полю и двигаем врага вправо
    for (let y = 0; y < game.battlefield.length; y++) {
      let row = game.battlefield[y];
      for (let x = game.sizeX - 1; x >= 0; x--) {
        if (row[x]?.enemy) {
          // двигаем только пока нет врага в крайнем положении
          if (x < game.sizeX - 1) {
            row[x + 1].enemy = row[x].enemy;
            delete row[x].enemy

          }
        }
      }
    }
  }

  // удаляем врага на позиции
  static deleteEnemyInPosition(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].enemy;
  }

  // шаг влево
  static moveEnemyLeft(game) {
    // проходимся по полю и двигаем врага влево
    for (let y = 0; y < game.battlefield.length; y++) {
      let row = game.battlefield[y];
      for (let x = 0; x < game.sizeX; x++) {
        if (row[x]?.enemy) {
          // двигаем только пока нет врага в крайнем положении
          if (x > 0) {
            row[x - 1].enemy = row[x].enemy;
            delete row[x].enemy

          }
        }
      }
    }
  }

  //Проверяем уничтожены ли все враги
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
