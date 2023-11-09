import {Player} from "./player";
import {CardDeck} from "./card-deck";

class Game {
    #players;
    #deck;
    #gameOver;
    #playersMove;
    #currentPlayerIndex;

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
        this.#gameOver = true;
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
            }
        }

        this.checkStep();// Проверка шага
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
        this.checkStep();  // Проверка шага
        this.nextPlayer(); // Переход к следующему игроку

        // Если все игроки сделали "пасс", находим игрока с наилучшим значением на руке
        if (this.#players.every((player) => player.pass === true)) {
            const playerWithClosestHand = this.#players
                .filter((player) => player.player.getHandValue() <= 21)
                .reduce((closest, player) =>
                    player.player.getHandValue() > closest.player.getHandValue()
                        ? player
                        : closest
                );
            alert(`Победитель: ${playerWithClosestHand.player.name}`);
            this.#gameOver = true;
        }
    }

    checkStep(){
        if(this.#playersMove < this.#players.length){
            if(this.#playersMove === this.#players.length){
                this.#players = this.#players.filter((item) => {
                    return item.pass === false && item.player.getHandValue()<=21
                })
                this.#playersMove = 0
            }else{
                this.#playersMove += 1;
            }
        }
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

    checkPlayer(){
        return this.#players[this.#playersMove]?.player?.name
    }

    dealInitialCards() {
        for (const item of this.#players) {
            item.player.addCard(this.#deck.drawCard());
            item.player.addCard(this.#deck.drawCard());
        }
    }

    startGame() {
        this.start = true
        this.#deck.shuffle();
        this.dealInitialCards();
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