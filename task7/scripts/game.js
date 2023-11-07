import { Player } from './player';
import { Enemy } from './enemy';
import { Barrier } from './barrier';
import {EnemyBullet, PlayerBullet} from './bullet';
import {Ability} from "./ability";

class Game {
  #level;
  #hiScore;
  #player;
  #moveDirection;
  #sizeX;
  #sizeY;
  #gameOver;
  #win;
  constructor() {
    this.#player = new Player([17, 21]);
    this.#level = 1;
    this.#hiScore = 0;
    this.#sizeX = 35;
    this.#sizeY = 22;
    this.#gameOver = false;
    this.#moveDirection = 'left';
    this.battlefield = [];
    this.#win = false;
    this.playerBullet = {};
    this.playerBulletOnBattlefield = false;
  }

  createBulletPlayerOnBattlefield() {
    PlayerBullet.createPlayerBullet(this);
  }

  createBarrierOnBattlefield(positionX, positionY) {
    if (
      (positionX > 2 && positionX < 6) ||
      (positionX > 10 && positionX < 14) ||
      (positionX > 20 && positionX < 24) ||
      (positionX > 28 && positionX < 32)
    ) {
      return Barrier.createBarrier(positionX, positionY);
    } else {
      return {}
    }
  }

  createEnemyOnBattlefield(positionX, positionY) {
    if (
      positionX > 1 &&
      positionX < this.#sizeX - 2
    ) {
      return Enemy.createEnemy(positionX, positionY, this.#level);
    } else {
      return {}
    }
  }

  createBattlefield() {
    for (let y = 0; y < this.sizeY; y++) {
      let massEnemy = [];
      for (let x = 0; x < this.sizeX; x++) {
        if (y > 1 && y < 7) {
          massEnemy[x] = this.createEnemyOnBattlefield(x, y);
        } else if (y > 18 && y < 20) {
          massEnemy[x] = this.createBarrierOnBattlefield(x, y);
        } else if (
          y === this.#player.position[1] &&
          x === this.#player.position[0]
        ) {
          massEnemy[x] = { player: this.#player };
        } else {
          massEnemy[x] = {};
        }
      }
      this.battlefield[y] = massEnemy;
    }
  }

  moveEnemyBulletsOnBattlefield(){
    EnemyBullet.moveEnemyBullets(this)
  }

  createEnemyBulletsObBattlefield(){
    for(let y = 0; y < this.sizeY - 1; y++){
      for(let x = 0; x < this.sizeX - 1; x++){
        if(this.battlefield[y][x]?.enemy?.canShoot === true) {
          EnemyBullet.createEnemyBullet(y,x, this)
        }
      }
    }
  }

  createAbilityOnBattlefield(positionX, positionY, game) {
    if (Math.random()<0.05) {
      Ability.createAbilityLive(positionX, positionY, game)
    }
  }

  winGame() {
    if (this.#level === 5 && Enemy.areAllEnemiesDefeated(this)) {
      this.#win = true;
    }
  }

  move() {
    let renderInterval = setInterval(() => {
      this.moveEnemyOnBattlefield()
      this.movePlayerBulletOnBattlefield();
      this.moveAbilityOnBattlefield()
      this.createEnemyBulletsObBattlefield()
      this.moveEnemyBulletsOnBattlefield()
      if (Enemy.areAllEnemiesDefeated(this)) {
        this.levelUp();
      }
      this.endGame(renderInterval)
    }, 500);
  }

  moveEnemyOnBattlefield() {
    Enemy.moveEnemy(this);
  }

  get win() {
    return this.#win;
  }

  deletePlayerBulletOnBattlefield() {
    PlayerBullet.deletePlayerBullet(this);
  }

  movePlayerRightOnBattlefield() {
    Player.movePlayerRight(this);
  }

  movePlayerLeftOnBattlefield() {
    Player.movePlayerLeft(this);
  }

  levelUp() {
    this.#level += 1;
    if (this.#level < 5) {
      this.createBattlefield();
    } else {
      this.winGame();
    }
  }

  movePlayerBulletOnBattlefield() {
    PlayerBullet.movePlayerBullet(this)
  }

  moveAbilityOnBattlefield(){
    Ability.moveAbility(this)
  }


  gameStart() {
    this.createBattlefield();
    this.move();
  }

  endGame(renderInterval) {
    if(this.#player.lives === 0){
      this.#gameOver = true;
      clearInterval(renderInterval)
    }
  }

  updateHiScore(score) {
    this.#hiScore += score;
  }

  get moveDirection() {
    return this.#moveDirection;
  }

  set moveDirection(moveDirection) {
    this.#moveDirection = moveDirection;
  }

  get gameOver() {
    return this.#gameOver;
  }

  get level() {
    return this.#level;
  }

  get hiScore() {
    return this.#hiScore;
  }

  get player() {
    return this.#player;
  }

  get sizeX() {
    return this.#sizeX;
  }

  get sizeY() {
    return this.#sizeY;
  }

  getPlayerLives() {
    return this.#player.lives;
  }
}

export { Game };
