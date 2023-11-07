import { Game } from './game';

let game;

function startGame() {
  game = new Game();
  game.gameStart();
  setInterval(() => {
    updateDisplay();
  }, 500);
}

function renderEnemy(positionY, positionX) {
  const battleField = document.getElementById('battlefield').children[0];

  if (game.battlefield[positionY][positionX]?.enemy.level === 1) {

    battleField.children[positionY].children[positionX].style.backgroundColor = '#ADFF2F';

  }

  if (game.battlefield[positionY][positionX]?.enemy.level === 2) {

    battleField.children[positionY].children[positionX].style.backgroundColor = '#FF69B4';

  }

  if (game.battlefield[positionY][positionX]?.enemy.level === 3) {

    battleField.children[positionY].children[positionX].style.backgroundColor = '#FFD700';

  }

  if (game.battlefield[positionY][positionX]?.enemy.level === 4) {

    battleField.children[positionY].children[positionX].style.backgroundColor = '#20B2AA';

  }

  if (game.battlefield[positionY][positionX]?.enemy.level === 5) {

    battleField.children[positionY].children[positionX].style.backgroundColor = '#4682B4';

  }
}

function updateDisplay() {
  document.getElementById('hi-scope').innerText = game.hiScore;
  document.getElementById('count-level').innerText = game.level;
  document.getElementById('count-lives').innerText = game.getPlayerLives();
  const battleField = document.getElementById('battlefield').children[0];

  if (game.win) {
    winner();
  }

  if (game.gameOver) {
    gameOver();
  }
  for (let y = 0; y < 22; y++) {
    for (let x = 0; x < 35; x++) {
      if (game.battlefield[y][x]?.enemy) {

        renderEnemy(y, x)

      } else if (game.battlefield[y][x]?.barrier) {

        battleField.children[y].children[x].style.backgroundColor = 'red';

      } else if (game.battlefield[y][x]?.player) {

        battleField.children[y].children[x].style.backgroundColor = 'yellow';

      } else if (game.battlefield[y][x]?.playerBullet) {

        battleField.children[y].children[x].style.backgroundColor = 'gray';

      } else if (game.battlefield[y][x]?.abilityLive) {

        battleField.children[y].children[x].style.backgroundColor = '#800000';

      } else if (game.battlefield[y][x]?.enemyBullet) {

        battleField.children[y].children[x].style.backgroundColor = '#696969';

      } else {

        battleField.children[y].children[x].style.backgroundColor = 'green';

      }
    }
  }
}

document.addEventListener('keydown', (event) => {
  event.preventDefault();
  if (event.key === 'ArrowLeft') {
    game.movePlayerLeftOnBattlefield();
  } else if (event.key === ' ' && event.target === document.body) {
    game.createBulletPlayerOnBattlefield();
  } else if (event.key === 'ArrowRight') {
    game.movePlayerRightOnBattlefield();
  }
  updateDisplay();
});

document.getElementById('start-button').addEventListener('click', () => {
  document.getElementsByClassName('start-page')[0].style.display = 'none';
  document.getElementsByClassName('game-page')[0].style.display = 'block';

  startGame();
});

document
  .getElementById('winner-page-start-button')
  .addEventListener('click', () => {
    document.getElementsByClassName('game-page')[0].style.display = 'block';
    document.getElementsByClassName('winner-page')[0].style.display = 'none';

    startGame();
  });

document
  .getElementById('game-over-start-button')
  .addEventListener('click', () => {
    document.getElementsByClassName('game-page')[0].style.display = 'block';
    document.getElementsByClassName('game-over-page')[0].style.display = 'none';

    startGame();
  });

function winner() {
  document.getElementsByClassName('game-page')[0].style.display = 'none';
  document.getElementsByClassName('winner-page')[0].style.display = 'block';
  document.getElementById('winner-score-log').innerText = game.hiScore;
}

function gameOver() {
  document.getElementsByClassName('game-page')[0].style.display = 'none';
  document.getElementsByClassName('game-over-page')[0].style.display = 'block';
}
