import {Player} from "./player";
import {CardDeck} from "./card-deck";

class Game {
    #players;
    #deck;
    #gameOver;
    #playersMove;
    #currentPlayerIndex;
    #start

    constructor(players= [new Player('Player 1'),
        new Player('Player 2'),
        new Player('Player 3'),
        new Player('Player 4')]
    ) {
        this.#players = this.initialPlayers(players);
        this.#deck = new CardDeck();
        this.#playersMove = 0;
        this.#gameOver = false;
        this.#currentPlayerIndex = 0;
        this.#start = false
    }

    // Метод для перехода к следующему игроку, учитывая значение на руке и флаг "пасс"
    nextPlayer() {
        // Получаем общее количество игроков
        const totalPlayers = this.#players.length;
        for (let i = 1; i <= totalPlayers; i++) {
            // Вычисляем индекс следующего игрока
            const nextPlayerIndex = (this.#currentPlayerIndex + i) % totalPlayers;
            const nextPlayer = this.#players[nextPlayerIndex];
            // Проверяем, что следующий игрок не сделал "пасс" и значение на его руке <= 21
            if (!nextPlayer.pass && nextPlayer.player.getHandValue() <= 21) {
                this.#currentPlayerIndex = nextPlayerIndex; // Обновляем индекс текущего игрока
                return;
            }
        }

        // Если не найдено допустимых игроков, игра завершена
        this.gameEnd()
    }


    // Метод для перехода к следующему игроку, учитывая значение на руке и флаг "пасс"
    playerMove() {

        const currentPlayer = this.#players[this.#currentPlayerIndex];
        if (!currentPlayer.pass && currentPlayer.player.getHandValue() <= 21) {
            const card = this.#deck.drawCard();
            currentPlayer.player.addCard(card);

            // Если значение на руке игрока превысило 21, игрок автоматически делает "пасс"
            if (currentPlayer.player.getHandValue() > 21) {
                currentPlayer.pass = true;
                currentPlayer.over = true;
            }
        }

        this.nextPlayer();// Переход к следующему игроку
    }

    // Метод для получения имени текущего игрока
    getCurrentPlayerName() {
        return this.#players[this.#currentPlayerIndex].player.name;
    }


    // Модифицированный метод для совершения "пасса" игрока
    playerPass() {
        // Получаем общее количество игроков
        const currentPlayer = this.#players[this.#currentPlayerIndex];
        currentPlayer.pass = true;
        this.nextPlayer(); // Переход к следующему игроку
    }

    initialPlayers(players = []){
        return players.map((player, index) => {
            return {
                id: index,
                player,
                pass: false,
                over:false
            }
        })
    }

    closestTo21(){
        const winner = this.#players.filter((player) => player.player.getHandValue() <= 21)
        winner.sort((a, b)=> a.player.getHandValue() - b.player.getHandValue() )
        return winner.at(-1)
    }

    gameEnd(){
        if (this.#players.every((player) => player.pass === true)) {
            this.#gameOver = true
            this.#start = false
            const winner = this.closestTo21()
            alert(winner?.player?.name || 'Ничья')
        }

    }

    dealInitialCards() {
        for (const item of this.#players) {
            item.player.addCard(this.#deck.drawCard());
            item.player.addCard(this.#deck.drawCard());
        }
    }

    startGame() {
        if(!this.#players.every((item)=> item.player.handIsClear())){
            this.#players.map((item)=>{
                item.pass = false
                item.over = false
                item.player.clearHand()
            })
        }
        this.#currentPlayerIndex = 0
        this.#start = true
        this.#deck.shuffle();
        this.dealInitialCards();
    }

    get start(){
        return this.#start
    }

    set start(status){
        this.#start = status
    }

    set playersMove(newStep){
        this.#playersMove = newStep
    }

    get players(){
        return this.#players
    }

    get deck(){
        return this.#deck
    }
}

export {Game}