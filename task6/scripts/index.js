import {Game} from "./game";
let game


document.getElementById(`start-game-button`).addEventListener('click', () => {
    game = new Game()
    game.startGame()

    document.getElementsByClassName('current-player')[0].innerHTML=`<h3 class="player-goes">Ход игрока:</br> <span id="current-player-name"></span></h3>`
    const currentPlayerName = document.getElementById('current-player-name');
    currentPlayerName.textContent = game.checkPlayer();

    updatePlayerDisplay()
});

document.getElementById('hit-button-player').addEventListener('click',()=>{
    game.playerMove()
    updatePlayerDisplay()
})
document.getElementById('stand-button-player').addEventListener('click',()=>{
    game.playerPass()
    updatePlayerDisplay()
})


function updatePlayerDisplay(){
        const currentPlayerName = document.getElementById('current-player-name');
        currentPlayerName.textContent = game.getCurrentPlayerName();
        for(let i = 0; i < game.players.length; i++ ){
            const playerDisplay = document.getElementById(`player-${i + 1}-hand`);
            playerDisplay.innerHTML = `<h2>(Сумма очков: ${game.players[i].player.getHandValue()})</h2>`; // Лог суммы очков каждого игрока
            playerDisplay.innerHTML += game.players[i].player.hand.map(card => `<div>${card.rank} ${card.suit}</div>`).join(''); // Какие карты на руке у игрока
        }
}

