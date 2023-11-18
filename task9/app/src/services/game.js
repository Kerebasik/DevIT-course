import {CardDeck} from "./card-deck.js";
import {Player} from "./player.js";

class Game {
    #players;
    #deck;
    #gameOver;
    #currentPlayerIndex;
    #start
    #winner
    #log

    constructor(players) {
        this.#players = Game.initialPlayers([players]);
        this.#deck = new CardDeck();
        this.#gameOver = false;
        this.#currentPlayerIndex = 0;
        this.#start = false
        this.#winner = ''
        this.#log = []
    }

    get log(){
        return this.#log
    }

    // addPlayer(newPlayer){
    //     this.#players.push(Game.initialPlayers(newPlayer))
    // }

    // Метод для перехода к следующему игроку, учитывая значение на руке и флаг "пасс"
    static nextPlayer(game) {
        let { players, currentPlayerIndex } = game
        // Получаем общее количество игроков
        const totalPlayers = players.length;
        for (let i = 1; i <= totalPlayers; i++) {
            // Вычисляем индекс следующего игрока
            const nextPlayerIndex = (currentPlayerIndex + i) % totalPlayers;
            const nextPlayer = players[nextPlayerIndex];
            // Проверяем, что следующий игрок не сделал "пасс" и значение на его руке <= 21
            if (!nextPlayer.pass && Player.getHandValue(nextPlayer.player.hand) <= 21) {
                game.currentPlayerIndex = nextPlayerIndex; // Обновляем индекс текущего игрока
                return;
            }
        }

        // Если не найдено допустимых игроков, игра завершена
       Game.gameEnd(game)
    }


    // Метод для перехода к следующему игроку, учитывая значение на руке и флаг "пасс"
    static playerMove(game) {
        let {players, deck, currentPlayerIndex} = game
        const currentPlayer = players[currentPlayerIndex];
        if (!currentPlayer.pass && Player.getHandValue(currentPlayer.player.hand) <= 21) {
            const card = CardDeck.drawCard(deck);
            Player.addCard(currentPlayer.player.hand, card)
            currentPlayer.player.points = Player.getHandValue(currentPlayer.player.hand)
            // Если значение на руке игрока превысило 21, игрок автоматически делает "пасс"
            if (Player.getHandValue(currentPlayer.player.hand) > 21) {
                currentPlayer.pass = true;
                currentPlayer.over = true;

            }
        }

        Game.nextPlayer(game);// Переход к следующему игроку
    }

    // Модифицированный метод для совершения "пасса" игрока
    static playerPass(game) {
        // Получаем общее количество игроков
        let {players, currentPlayerIndex} = game
        const currentPlayer = players[currentPlayerIndex];
        currentPlayer.pass = true;
        Game.nextPlayer(game); // Переход к следующему игроку
    }

    static initialPlayers(players = []){
        return players.map((player) => {
            return {
                player,
                pass: false,
                over: false,
                ready: false
            }
        })
    }

    static closestTo21(game){
        let {players} = game
        const winner = players.filter((item) => Player.getHandValue(item.player.hand) <= 21)
        winner.sort((a, b)=> Player.getHandValue(a.player.hand) - Player.getHandValue(b.player.hand) )
        return winner.at(-1)
    }

    static gameEnd(game){
        let {players } = game
        if (players.every((player) => player.pass === true)) {
            game.gameOver = true
            const winner = this.closestTo21(game)
            game.winner = winner?.player?.name || 'Ничья'
        }

    }

    static dealInitialCards(game) {
        let {players, deck} = game
        for (const item of players) {
            item.player.hand.push(CardDeck.drawCard(deck))
            item.player.hand.push(CardDeck.drawCard(deck))
            item.player.points = Player.getHandValue(item.player.hand)
        }
    }

    // startGame() {
    //     if(!this.#players.every((item)=> item.player.handIsClear())){
    //         this.#players.map((item)=>{
    //             item.pass = false
    //             item.over = false
    //             item.player.clearHand()
    //         })
    //     }
    //     this.#currentPlayerIndex = 0
    //     this.#start = true
    //     this.#deck.shuffle();
    //     this.dealInitialCards();
    // }

    getAllProperties(){
        const playersInfo = this.#players.map((item)=>{
            return {
                player: item.player.getAllProperties(),
                pass: item.pass,
                over: item.over,
                ready: item.ready
            }
        })

        return{
            players:playersInfo,
            deck:this.#deck.deck,
            gameOver:this.#gameOver,
            currentPlayerIndex: this.#currentPlayerIndex,
            start:this.#start,
            winner:this.#winner,
            log:this.#log
        }
    }

    get start(){
        return this.#start
    }

    set start(status){
        this.#start = status
    }

    get currentPlayerIndex(){
        return this.#currentPlayerIndex
    }


    get gameOver(){
        return this.#gameOver
    }

    get players(){
        return this.#players
    }

    get deck(){
        return this.#deck
    }

    set log(newLog){
        this.#log = newLog
    }
}

export {Game}