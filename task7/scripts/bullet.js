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
    //Удаляем пулю игрока с поля. Удаляем её объект на поле и указываем что пули игрока больше нет
    game.playerBullet = {};
    game.playerBulletOnBattlefield = false;
  }

  static createPlayerBullet(game) {
    //Создание пули на поле боя если её нет
    if (game.playerBulletOnBattlefield === false) {
      const playerBullet = new PlayerBullet({
        damage: game.player.weapon.damage,
        position: [game.player.startPosition[0], game.player.startPosition[1] - 1],
      });
      //Делаем объект пули на поле боя
      //Указываем, что пуля есть на поле боя
      game.playerBullet = playerBullet;
      //Пуля создается перед игроком по оси Y
      game.battlefield[20][game.player.startPosition[0]].playerBullet = playerBullet;
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
            // Удаляем пулю игрока в блоке
            PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
            // Ставим что пули игрока нет на поле боя
            game.deletePlayerBulletOnBattlefield();
            return;
          }

          // если перед пулей игрока есть враг, то
          if (game.battlefield[y - 1][bulletPositionX]?.enemy) {
            const enemy = game.battlefield[y - 1][bulletPositionX]?.enemy;
            // Проверяем хп врага если они равны или меньше урону пули, то
            if (enemy.hp <= game.playerBullet.damage) {
              // даем игроку очки за убитого врага
              game.updateHiScore(enemy.score);
              // Удаляем ключ 'enemy' из объекта battlefield на позиции
              Enemy.deleteEnemyInPosition(game, y-1, bulletPositionX)
              // Удаляем пулю игрока с поля боя
              PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
              // Указываем что пули нет на поле боя
              game.deletePlayerBulletOnBattlefield();
              // создаем улучшение на мести врага
              game.createAbilityOnBattlefield(bulletPositionX, y - 1, game);

            } else {
              //если урон пули врага меньше чем хп, то мы отнимаем из хп урон пули
              enemy.hp -= game.playerBullet.damage;
              // Удаляем ключ 'playerBullet' из объекта
              PlayerBullet.deletePlayerBulletInPosition(game, y, bulletPositionX)
              // Указываем что пули нет на поле боя
              game.deletePlayerBulletOnBattlefield();
            }

            return;
          }
          // Присваиваем значение playerBullet в верхнюю строку, затем удаляем его из текущей строки
          PlayerBullet.stepForward(game, y, bulletPositionX)
        }
      }
    }
  }

  static stepForward(game, positionY, positionX){
    // Присваиваем объект из строки нижу в строку которая выше
    game.battlefield[positionY - 1][positionX] = game.battlefield[positionY][positionX];
    game.battlefield[positionY][positionX] = {}
  }

  static deletePlayerBulletInPosition(game, positionY, positionX){
    // удаление пули с поля боя
    delete game.battlefield[positionY][positionX].playerBullet;
  }


  static deleteBulletInPosition(object, context) {
    // Удаление пули игрока в указанной позиции
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
    //Удаляем пулю врага в определенной позициии
    delete game.battlefield[positionY][positionX]?.enemyBullet
  }

  static stepForward(game, positionY, positionX){
    // Присваивание пули врага на линию ниже, а с линии выше удаляем
    game.battlefield[positionY][positionX].enemyBullet = game.battlefield[positionY-1][positionX].enemyBullet
    delete game.battlefield[positionY-1][positionX].enemyBullet
  }

  static moveEnemyBullets(game){
    // Проходи по полю сражения
    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){
        // нашли пулю врага
        if(game.battlefield[y-1][x]?.enemyBullet){
          //если на пути врага игрок, то
          if(game.battlefield[y][x]?.player){
            //отнимаем у игрока жизнь
            game.battlefield[y][x]?.player.damageLives()
            // удаляем пулю врага с позиции
            EnemyBullet.deleteBulletInPosition(game, y-1, x)
          }

          // Если на пути барьер
          if(game.battlefield[y-1][x]?.barrier){
            //удаляем барьер на позиции и пулю врага
            EnemyBullet.deleteBulletInPosition(game, y-1, x)
            Barrier.deleteBarrier(game, y-1, x)
          }

          // удаление пули врага на краю карты
          if(game.battlefield[20][x].enemyBullet){
            EnemyBullet.deleteBulletInPosition(game, 20, x)
          }
          // шаг пули ниже
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
