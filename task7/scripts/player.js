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

  // добавляем жизнь в случае наличия если у игрока меньше максимума (4)
  addLive(live) {
    if (this.#lives <= 4) {
      this.#lives += live;
    }
  }

  // отнимаем жизнь
  damageLives() {
    if (this.#lives > 0) {
      this.#lives -= 1;
    }
  }

  static movePlayerRight(game) {
    //двигаем игрока вправо по полю
    let row = game.battlefield[21];
    // Проходимся по каждой клетке строки, начиная с правого края и двигаясь влево
    for (let x = row.length; x >= 0; x--) {
      // Если в клетке есть игрок
      if (row[x]?.player) {
        if (x < game.sizeX - 1) {
          // Проверяем, не находится ли игрок уже на краю поля
          // Если не на краю, перемещаем игрока вправо
          row[x + 1] = row[x];
          row[x] = row[x - 1];
          game.player.startPosition[0] += 1;
        }
      }
    }
  }

  static movePlayerLeft(game) {
    // Получаем строку, где находится игрок
    let row = game.battlefield[21];
    // Проходимся по каждой клетке строки, начиная с левого края и двигаясь вправо
    for (let x = 0; x < row.length; x++) {
      // Если в клетке есть игрок
      if (row[x]?.player) {
        if (x > 0) {
          // Проверяем, не находится ли игрок уже на краю поля
          // Если не на краю, перемещаем игрока влево
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
