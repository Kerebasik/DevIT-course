import {CardDeck} from "./card-deck.js";

class Player {
    #name
    #hand
    constructor(name) {
        this.#name = name;
        this.#hand = [];
    }

    static handIsClear(hand) {
        return hand.length === 0
    }

    static addCard(hand, card) {
        return hand.push(card);
    }

    static getHandValue(hand) {
        let value = 0;

        for (const card of hand) {
            const cardValue = CardDeck.getCardValue(card);
            value += cardValue;
        }

        return value;
    }

    getAllProperties(){
        return {
            hand:this.#hand,
            name:this.#name,
        }
    }

    get name(){
        return this.#name
    }

    get hand(){
        return this.#hand
    }
}

export {Player}