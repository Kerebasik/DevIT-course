import {CardDeck} from "./card-deck";

class Player {
    #name
    #hand
    constructor(name) {
        this.#name = name;
        this.#hand = [];
    }

    addCard(card) {
        this.#hand.push(card);
    }

    clearHand() {
        this.#hand = [];
    }

    getHandValue() {
        let value = 0;

        for (const card of this.hand) {
            const cardValue = CardDeck.getCardValue(card);
            value += cardValue;
        }

        return value;
    }



    get name(){
        return this.#name
    }

    get hand(){
        return this.#hand
    }
}

export {Player}