class PlayerBullet {
  #position;
  #damage;
  constructor({ damage, position }) {
    this.#damage = damage;
    this.#position = position;
  }

  static deletePlayerBullet(game) {
    game.playerBullet = {};
    game.playerBulletOnBattlefield = false;
  }

  static createPlayerBullet(game) {
    if (game.playerBulletOnBattlefield === false) {
      const playerBullet = new PlayerBullet({
        damage: 1,
        position: [game.player.position[0], game.player.position[1] - 1],
      });
      game.playerBullet = playerBullet;
      game.battlefield[20][game.player.position[0]].playerBullet = playerBullet;
      game.playerBulletOnBattlefield = true;
    }
  }

  static movePlayerBullet(game) {
    if (game.playerBulletOnBattlefield === true) {
      // Получаем текущее положение пули игрока
      const bulletPositionX = game.playerBullet.position[0];

      // Проходимся по каждой строке в поле боя
      for (let y = 0; y < game.battlefield.length; y++) {
        // Получаем текущую строку
        let row = game.battlefield[y][bulletPositionX];

        // Удаляем пулю при достижении границы верхней
        if (y === 1 && row?.playerBullet) {
          // Удаляем ключ 'playerBullet' из объекта
          delete game.battlefield[y][bulletPositionX].playerBullet;
          game.deletePlayerBulletOnBattlefield();
        }

        // Проверяем, есть ли пуля игрока в текущей строке
        if (row?.playerBullet) {
          // Если выше есть враг или барьер
          if (game.battlefield[y - 1][bulletPositionX]?.barrier) {
            // Удаляем ключ 'barrier' из объекта
            delete game.battlefield[y - 1][bulletPositionX].barrier;
            delete game.battlefield[y][bulletPositionX].playerBullet;
            game.deletePlayerBulletOnBattlefield();
            return;
          }

          if (game.battlefield[y - 1][bulletPositionX]?.enemy) {
            const enemy = game.battlefield[y - 1][bulletPositionX]?.enemy;
            // Обновляем счет игрока в зависимости от урона пули
            if (enemy.hp === game.playerBullet.damage) {
              game.updateHiScore(enemy.score);
              // Удаляем ключ 'enemy' из объекта
              delete game.battlefield[y - 1][bulletPositionX].enemy;
              delete game.battlefield[y][bulletPositionX].playerBullet;
              game.deletePlayerBulletOnBattlefield();
              game.createAbilityOnBattlefield(bulletPositionX, y - 1, game);

            } else {
              enemy.hp -= 1;
              // Удаляем ключ 'playerBullet' из объекта
              delete game.battlefield[y][bulletPositionX].playerBullet;
              game.deletePlayerBulletOnBattlefield();
            }

            return;
          }
          // Присваиваем значение playerBullet в верхней строке, затем удаляем его из текущей строки
          game.battlefield[y - 1][bulletPositionX] = game.battlefield[y][bulletPositionX];
          game.battlefield[y][bulletPositionX] = {}
        }
      }
    }
  }


  static deleteBulletInPosition(object, context) {
    if (object?.playerBullet) {
      context.battlefield[object.playerBullet.position[1]][object.playerBullet.position[0] + 1] = {
        position: [
          object.playerBullet.position[0] + 1,
          object.playerBullet.position[1],
        ],
      };
      context.deletePlayerBullet();
    }
  }

  get damage() {
    return this.#damage;
  }

  get position() {
    return this.#position;
  }
}

class EnemyBullet {
  #position;
  #damage;
  constructor({ damage, position }) {
    this.#damage = damage;
    this.#position = position;
  }

  static moveEnemyBullets(game){
    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){
        if(game.battlefield[y-1][x]?.enemyBullet){

          if(game.battlefield[y][x]?.player){

            game.battlefield[y][x]?.player.damageLives()
            delete game.battlefield[y-1][x]?.enemyBullet

          }

          if(game.battlefield[y-1][x]?.barrier){

            delete game.battlefield[y-1][x]?.enemyBullet
            delete game.battlefield[y-1][x]?.barrier

          }

          if(game.battlefield[20][x].enemyBullet){

            delete game.battlefield[20][x].enemyBullet

          }

          game.battlefield[y][x].enemyBullet = game.battlefield[y-1][x].enemyBullet
          delete game.battlefield[y-1][x].enemyBullet

        }
      }
    }
  }

  static createEnemyBullet(positionY, positionX, game){
    if(Math.random()<0.02){
      game.battlefield[positionY][positionX].enemyBullet = new EnemyBullet({damage:1, position:[positionX,positionY]})
    }
  }

  get damage() {
    return this.#damage;
  }

  get position() {
    return this.#position;
  }
}

export { PlayerBullet, EnemyBullet };
