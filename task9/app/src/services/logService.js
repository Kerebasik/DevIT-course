class LogService {
    static addLogToGame(game, log, user='server'){
        game.log.unshift([user, log])
    }
}

export {LogService}