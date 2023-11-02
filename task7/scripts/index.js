import {Game} from "./game";

let game = new Game()

function startGame(){
    document.getElementById('hi-scope').innerText = game.hiScore;
    document.getElementById('count-level').innerText = game.level;
    document.getElementById('count-lives').innerText = game.getPlayerLives();
    game.gameStart()

    setInterval(()=>{
        updateDisplay()
    },500)
}



function updateDisplay(){
    const battleField = document.getElementById('battlefield').children[0]
    for (let y = 0; y < 22; y++) {
        for(let x = 0; x < 35; x++){
            if(game.battlefield[y][x]?.enemy){

                battleField.children[y].children[x].style.backgroundColor='orange'

            } else if(game.battlefield[y][x]?.barrier){

                battleField.children[y].children[x].style.backgroundColor='red'

            } else if(game.battlefield[y][x]?.player){

                battleField.children[y].children[x].style.backgroundColor='yellow'

            } else if(game.battlefield[y][x]?.bullet){

                battleField.children[y].children[x].style.backgroundColor='gray'

            } else {
                battleField.children[y].children[x].style.backgroundColor='green'
            }
        }
    }
}

document.addEventListener('keydown', (event) => {
    if ( event.key === 'ArrowLeft') {
        game.movePlayerLeft()
    } else if( event.key === " "){
        game.createBulletPlayer()
    } else if ( event.key === 'ArrowRight' )  {
        game.movePlayerRight()
    }
    updateDisplay()
});


document.getElementById('start-button').addEventListener('click',()=>{
    document.getElementsByClassName('start-page')[0].style.display='none'
    document.getElementsByClassName('game-page')[0].style.display='block'

    startGame()
})
document.getElementById('winner-page-start-button').addEventListener('click',()=>{
    document.getElementsByClassName('game-page')[0].style.display='block'
    document.getElementsByClassName('winner-page')[0].style.display='none'

    startGame()
})
document.getElementById('game-over-start-button').addEventListener('click',()=>{
    document.getElementsByClassName('game-page')[0].style.display='block'
    document.getElementsByClassName('game-over-page')[0].style.display='none'

    startGame()
})

function winner(){
    document.getElementsByClassName('game-page')[0].style.display='none'
    document.getElementsByClassName('winner-page')[0].style.display='block'

}

function gameOver(){
    document.getElementsByClassName('game-page')[0].style.display='none'
    document.getElementsByClassName('game-over-page')[0].style.display='block'
    game.gameOver()
}
