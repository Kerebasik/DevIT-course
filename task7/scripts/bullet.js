import {Barrier} from "./barrier";
import {Enemy} from "./enemy";

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
          PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
          game.deletePlayerBulletOnBattlefield();
        }

        // Проверяем, есть ли пуля игрока в текущей строке
        if (row?.playerBullet) {
          // Если выше есть враг или барьер
          if (game.battlefield[y - 1][bulletPositionX]?.barrier) {
            // Удаляем ключ 'barrier' из объекта
            Barrier.deleteBarrier(game, y-1, bulletPositionX)
            PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
            game.deletePlayerBulletOnBattlefield();
            return;
          }

          if (game.battlefield[y - 1][bulletPositionX]?.enemy) {
            const enemy = game.battlefield[y - 1][bulletPositionX]?.enemy;
            // Обновляем счет игрока в зависимости от урона пули
            if (enemy.hp === game.playerBullet.damage) {
              game.updateHiScore(enemy.score);
              // Удаляем ключ 'enemy' из объекта
              Enemy.deleteEnemyInPosition(game, y-1, bulletPositionX)
              PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
              game.deletePlayerBulletOnBattlefield();
              game.createAbilityOnBattlefield(bulletPositionX, y - 1, game);

            } else {
              enemy.hp -= 1;
              // Удаляем ключ 'playerBullet' из объекта
              PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
              game.deletePlayerBulletOnBattlefield();
            }

            return;
          }
          // Присваиваем значение playerBullet в верхней строке, затем удаляем его из текущей строки
          PlayerBullet.stepForward(game, y, bulletPositionX)
        }
      }
    }
  }

  static stepForward(game, positionY, positionX){
    game.battlefield[positionY - 1][positionX] = game.battlefield[positionY][positionX];
    game.battlefield[positionY][positionX] = {}
  }

  static deletePlayerBulletInPosition(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].playerBullet;
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

  static deleteBulletInPosition(game, positionY, positionX){
    delete game.battlefield[positionY][positionX]?.enemyBullet
  }

  static stepForward(game, positionY, positionX){
    game.battlefield[positionY][positionX].enemyBullet = game.battlefield[positionY-1][positionX].enemyBullet
    delete game.battlefield[positionY-1][positionX].enemyBullet
  }

  static moveEnemyBullets(game){
    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){
        if(game.battlefield[y-1][x]?.enemyBullet){

          if(game.battlefield[y][x]?.player){

            game.battlefield[y][x]?.player.damageLives()
            EnemyBullet.deleteBulletInPosition(game, y-1, x)
          }

          if(game.battlefield[y-1][x]?.barrier){

            EnemyBullet.deleteBulletInPosition(game, y-1, x)
            Barrier.deleteBarrier(game, y-1, x)

          }

          if(game.battlefield[20][x].enemyBullet){

            EnemyBullet.deleteBulletInPosition(game, 20, x)

          }

          EnemyBullet.stepForward(game, y, x)

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
