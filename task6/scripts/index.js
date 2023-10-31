import {Game} from "./game";
let game
let currentPlayerIndex; // Индекс текущего игрока

document.getElementById('check-winner-button').addEventListener('click',() => {
    for(let i = 0; i < 4; i++){
        document.getElementsByClassName('buttons__control')[i].style.opacity = "0";
    }
    const winner = game.checkWinner().name
    document.getElementsByClassName('current-player')[0].innerHTML =`<h1 class="winner">Winner:</br> ${winner}</h1>`

    deleteDisplay()
})

document.getElementById(`start-game-button`).addEventListener('click', () => {
    game = new Game() // создаю новую игру
    game.startGame() // начинаю игру
    currentPlayerIndex = 0

    // Делаю кнопки видимыми после предыдущей игры

    for(let i=0; i < 4; i++){
        document.getElementsByClassName('buttons__control')[i].style.opacity = "1";
        document.getElementById(`hit-button-player-${i+1}`).style.opacity='1'
    }
    // Создаю лог для отображения очередности игры
    document.getElementsByClassName('current-player')[0].innerHTML=`<h3 class="player-goes">Ход игрока:</br> <span id="current-player-name"></span></h3>`

    initMenuButtons();
    updateCurrentPlayerName();
    updateDisplay();
});

function overkillLog(playerIndex){
    const log = document.getElementById(`player-${playerIndex + 1}-log`);
    log.innerText = 'Перебор'; // отрисовка лога в случае перебора
}

//Накидываю слушатели на кнопки игроков и в ходе игры скрываю кнопку взять если у игрока перебор

function initMenuButtons() {
    const players = game.players;
    for (let i = 0; i < players.length; i++) {
        const hitButton = document.getElementById(`hit-button-player-${i + 1}`);
        const standButton = document.getElementById(`stand-button-player-${i + 1}`);
        hitButton.disabled = true;
        standButton.disabled = true;

        hitButton.addEventListener('click', () => {
            if (!game.gameOver) {
                if (game.players[i].getHandValue() <= 21) { // Проверка на наличие перебора

                    const newCard = game.deck.drawCard()

                    game.players[i].addCard(newCard);

                    if (game.players[i].getHandValue() > 21) { // Проверка на перебор после взятии карты
                        overkillLog(i)
                    }
                    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

                    updateDisplay()
                    updateCurrentPlayerName()

                } else {
                    // Пропускаем игрока, у которого уже перебор
                    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

                    updateDisplay()
                    updateCurrentPlayerName()
                }
            }
        });

        standButton.addEventListener('click', () => {
            // выключаю кнопки игрока и перехожу к следующему игроку
            hitButton.disabled = true;
            standButton.disabled = true;

            currentPlayerIndex = (currentPlayerIndex + 1) % players.length;

            updateDisplay()
            updateCurrentPlayerName()
        });
    }

    // Показать первого игрока, чтобы начать
    updateDisplay()

}

function updateCurrentPlayerName() {
    // Обновляю игрока в логе очередности хода

    const players = game.players;
    const currentPlayerName = document.getElementById('current-player-name');
    currentPlayerName.textContent = players[currentPlayerIndex].name;
}

function deleteDisplay() {
    // очищаю все логи после окончания игры
    for (let i = 0; i < game.players.length; i++) {
        const playerDisplay = document.getElementById(`player-${i + 1}-hand`);
        document.getElementById(`player-${i+1}-log`).innerText=''
        while (playerDisplay.lastElementChild) {
            playerDisplay.removeChild(playerDisplay.lastElementChild);
        }
    }
}

function updateDisplay() {
    // Обновляю отрисовку
    for (let i = 0; i < game.players.length; i++) {
        const playerDisplay = document.getElementById(`player-${i + 1}-hand`);
        const hitButton = document.getElementById(`hit-button-player-${i+1}`)
        const  standButton = document.getElementById(`stand-button-player-${i+1}`)

        if(game.players[i].getHandValue()>21){
            hitButton.style.opacity='0'
        } // если у игрока перебор, то его кнопка скрывается

        playerDisplay.innerHTML = `<h2>(Сумма очков: ${game.players[i].getHandValue()})</h2>`; // Лог суммы очков каждого игрока
        playerDisplay.innerHTML += game.players[i].hand.map(card => `<div>${card.rank} ${card.suit}</div>`).join(''); // Какие карты на руке у игрока

        if (i === currentPlayerIndex) {
            // если индекс совпадает с индексом игрока который ходит, то кнопки активируются
            hitButton.disabled = false;
            standButton.disabled = false;
        } else {
            // если не совпадает кнопки блокируются
            hitButton.disabled = true;
            standButton.disabled = true;
        }
    }
}

