class Player {
  #lives;
  #position;
  constructor(position = []) {
    this.#lives = 3;
    this.#position = position;
  }

  addLive() {
    if (this.#lives <= 4) {
      this.#lives += 1;
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
          game.player.position[0] += 1;
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
          game.player.position[0] -= 1;
        }
      }
    }
  }

  get lives() {
    return this.#lives;
  }

  get position() {
    return this.#position;
  }
}

export { Player };
