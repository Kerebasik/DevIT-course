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
            const cardValue = this.getCardValue(card);
            value += cardValue;
        }

        return value;
    }

    getCardValue(card) {
        const rank = card.rank;
        if (['Валет', 'Дама', 'Король'].includes(rank)) {
            return 10;
        }
        if (rank === 'Туз') {
            return 1;
        }
        return parseInt(rank)
    }

    get name(){
        return this.#name
    }

    get hand(){
        return this.#hand
    }
}

export {Player}