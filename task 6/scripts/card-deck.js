class CardDeck {
    #suits
    #ranks
    #deck
    constructor() {
        this.#suits = ['Черви', 'Бубны', 'Пики', 'Крести'];
        this.#ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Валет', 'Дама', 'Король', 'Туз'];
        this.#deck = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        for (const suit of this.#suits) {
            for (const rank of this.#ranks) {
                this.#deck.push({ suit, rank });
            }
        }
    }

    shuffle() {
        for (let i = this.#deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.#deck[i], this.#deck[j]] = [this.#deck[j], this.#deck[i]];
        }
    }

    drawCard() {
        return this.#deck.pop();
    }


}

export { CardDeck }

