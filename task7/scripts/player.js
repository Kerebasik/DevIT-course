class Player {
  #lives;
  #startPosition;
  #weapon
  constructor(startPosition = []) {
    this.#lives = 3;
    this.#weapon = {
      damage:1
    }
    this.#startPosition = startPosition;
  }

  addLive(live) {
    if (this.#lives <= 4) {
      this.#lives += live;
    }
  }

  damageLives() {
    if (this.#lives >= 0) {
      this.#lives -= 1;
    }
  }

  static movePlayerRight(game) {
    let row = game.battlefield[21];
    for (let x = row.length; x >= 0; x--) {
      if (row[x]?.player) {
        if (x < game.sizeX - 1) {
          row[x + 1] = row[x];
          row[x] = row[x - 1];
          game.player.startPosition[0] += 1;
        }
      }
    }
  }

  static movePlayerLeft(game) {
    let row = game.battlefield[21];
    for (let x = 0; x < row.length; x++) {
      if (row[x]?.player) {
        if (x > 0) {
          row[x - 1] = row[x];
          row[x] = row[x + 1];
          game.player.startPosition[0] -= 1;
        }
      }
    }
  }

  get weapon(){
    return this.#weapon
  }

  set weapon(newWeapon){
    this.#weapon = newWeapon
  }

  get lives() {
    return this.#lives;
  }

  get startPosition() {
    return this.#startPosition;
  }
}

export { Player };
