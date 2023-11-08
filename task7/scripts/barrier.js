class Barrier {
  constructor(hp) {
    this.hp = hp;
  }


  // Создание барьера на позиции
  static createBarrier(positionX, positionY) {
    const barrier = new Barrier(1);

    return {
      barrier,
      position: [positionX, positionY],
    };
  }

  // Удаление барьера по позиции
  static deleteBarrier(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].barrier;
  }
}

export { Barrier };
