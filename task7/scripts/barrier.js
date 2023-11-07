class Barrier {
  constructor(hp) {
    this.hp = hp;
  }

  static createBarrier(positionX, positionY) {
    const barrier = new Barrier(1);

    return {
      barrier,
      position: [positionX, positionY],
    };
  }

  static deleteBarrier(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].barrier;
  }
}

export { Barrier };
