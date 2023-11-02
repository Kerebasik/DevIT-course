class Enemy {
    #hp
    constructor(hp, options) {
        this.#hp = hp
        this.canShoot = options.canShoot
        this.score = options.score
        this.level = options.level
    }

    get hp(){
        return this.#hp
    }

}

export { Enemy }