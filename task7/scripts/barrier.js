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
}

export { Barrier };
