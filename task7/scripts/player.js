class Player {
    #lives
    constructor(lives= 3) {
        this.#lives = lives
    }

    get lives(){
        return this.#lives
    }

}

export {Player}