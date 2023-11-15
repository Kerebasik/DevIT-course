class GameDtoForClient {

    constructor({_id, players, gameOver, currentPlayerIndex, start}) {
        this.id = _id
        this.players = players
        this.gameOver = gameOver
        this.currentPlayerIndex = currentPlayerIndex
        this.start = start
    }
}

export {GameDtoForClient}