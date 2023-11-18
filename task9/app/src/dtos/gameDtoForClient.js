class GameDtoForClient {

    constructor({_id, winner, userId, players, gameOver, currentPlayerIndex, log, start}) {
        this.userId = userId
        this.id = _id
        this.players = players
        this.gameOver = gameOver
        this.currentPlayerIndex = currentPlayerIndex
        this.start = start
        this.winner = winner
        this.log = log
    }
}

export {GameDtoForClient}