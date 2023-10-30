import {Player} from "./player";
import {CardDeck} from "./card-deck";

class Game {
    #players
    #deck
    #gameOver
    #start
    constructor() {
        this.#players = [
            new Player('Player 1'),
            new Player('Player 2'),
            new Player('Player 3'),
            new Player('Player 4')
        ];
        this.#deck = new CardDeck();
        this.#gameOver = false;
        this.#start = false
    }

    dealInitialCards() {
        for (const player of this.#players) {
            player.addCard(this.#deck.drawCard());
            player.addCard(this.#deck.drawCard());
        }
    }

    startGame() {
        this.start = true
        for(let player of this.#players){
            player.clearHand()
        }
        this.#deck.shuffle();
        this.dealInitialCards();

    }

    checkWinner(){
        const massive = this.players.filter((item)=> item.getHandValue()<=21)
        massive.sort((a, b)=>a.getHandValue() - b.getHandValue())
        this.endGame()
        return massive.pop()
    }

    endGame() {
        this.gameOver = true
    }

    get players(){
        return this.#players
    }

    get deck(){
        return this.#deck
    }
}

export {Game}