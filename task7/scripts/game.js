import {Player} from "./player";
import {Enemy} from "./enemy";
import {Barrier} from "./barrier";
import {Bullet} from "./bullet";


class Game {
    #level
    #hiScore
    #player
    constructor() {
        this.#player = {
            player:new Player(),
            position:[17, 21]
        }
        this.#level = 1;
        this.#hiScore = 0;
        this.sizeX = 35
        this.sizeY = 22
        this.moveDirection = 'left'
        this.battlefield = []
        this.playerBullet = false
        this.playerBulletObj={}
    }

    createEnemyLevel1(positionX,positionY){
        const enemy = new Enemy(1, { canShoot: true, score: 10, level: 1 });

        const enemyObj = {
            enemy,
            position: [positionX, positionY]
        };

        return enemyObj
    }

    createEnemyLevel2(positionX,positionY){

    }

    createEnemyLevel3(positionX,positionY){

    }

    createBulletPlayer(){
        if( this.playerBullet === false ){
            const bullet = {
                bullet: new Bullet(),
                position:[this.#player.position[0], this.#player.position[1]-1]
            }
            this.playerBulletObj = bullet
            this.battlefield[20][this.#player.position[0]] = bullet;
            this.playerBullet=true
        }
    }

    createEnemy(positionX, positionY){
        switch (this.#level){
            case 1:{
                return this.createEnemyLevel1(positionX, positionY)
            }
            case 2:{
                return this.createEnemyLevel2(positionX, positionY)
            }
            case 3:{
                return this.createEnemyLevel3(positionX, positionY)
            }
        }
    }

    createBarrier(positionX, positionY){
        const barrier =  new Barrier(1)

        const barrierObj = {
            barrier,
            position: [positionX, positionY]
        };

        return barrierObj
    }

    createBattlefield() {
        for (let y = 0; y < this.sizeY; y++) {
            let massEnemy = [];
            for (let x = 0; x < this.sizeX; x++) {
                if( y > 1 &&
                    y < 7 &&
                    x > 1 &&
                    x < this.sizeX - 2
                ){
                    massEnemy[x] = this.createEnemy(x,y)
                } else if(
                    y > 18 &&
                    y < 20 &&
                    (
                        (x > 2 && x < 6) ||
                        (x > 10 && x < 14) ||
                        (x > 20 && x < 24) ||
                        (x > 28 && x < 32)
                    )
                ){

                    massEnemy[x] = this.createBarrier(x, y)

                } else if( y === this.#player.position[1] && x === this.#player.position[0] ){
                    massEnemy[x] = { player:this.#player.player, position:[x,y] }
                } else {
                    massEnemy[x] = {
                        position: [x, y]
                    };
                }
            }
            this.battlefield[y] = massEnemy;
        }
    }

    move(){
        setInterval(()=>{
            //this.isDead()
            this.moveEnemy()
            this.movePlayerBullet()
        },500)
    }

    moveEnemy(){
        if(this.moveDirection ==='right'){
            if(this.battlefield[6][34]?.enemy){
                this.moveDirection = 'left'
            } else {
                this.moveEnemyRight()
            }
        }
        if(this.moveDirection ==='left'){
            if(this.battlefield[6][0]?.enemy){
                this.moveDirection = 'right'
            } else {
                this.moveEnemyLeft()
            }
        }
    }

    isDead(){
        for(let y = 0; y < this.sizeY; y++){
            for(let x = 0; x < this.sizeY; x++){
                if(this.battlefield[y][x]?.enemy){
                    if(this.playerBullet){
                        if(this.battlefield[y][x].position[0] === this.playerBulletObj?.position[0] && this.battlefield[y][x].position[1] === this.playerBulletObj?.position[1] ){
                            this.battlefield[y][x] ={
                                position:[x,y]
                            }
                        }
                    }
                }
            }
        }
    }

    moveEnemyRight(){
        for (let y = 0; y < this.battlefield.length; y++) {
            let row = this.battlefield[y];
            for(let x = row.length; x >= 0; x--) {
                if(row[x]?.enemy){
                   row[x+1] = row[x]
                   row[x] = row[x-1]
                }
            }
        }
    }

    moveEnemyLeft(){
        for (let y = 0; y < this.battlefield.length; y++) {
            let row = this.battlefield[y];
            for(let x = 0; x < row.length; x++) {
                if(row[x]?.enemy){
                    row[x-1] = row[x]
                    row[x] = row[x+1]
                }
            }
        }
    }

    nextLevel(level) {
        this.#level = level;
    }

    movePlayerRight(){
        let row = this.battlefield[21];
        for(let x = row.length; x >= 0; x--) {
            if(row[x]?.player){
                if(x<this.sizeX-1){
                    row[x+1] = row[x]
                    row[x] = row[x-1]
                    this.#player.position[0]+=1;
                }
            }
        }

    }

    movePlayerLeft(){
        let row = this.battlefield[21];
        for(let x = 0; x < row.length; x++) {
            if(row[x]?.player){
                if(x > 0){
                    row[x-1] = row[x]
                    row[x] = row[x+1]
                    this.#player.position[0]-=1;
                }
            }
        }

    }

    movePlayerBullet(){
        if(this.playerBullet===true){
            const bulletPositionX = this.playerBulletObj.position[0]
            for (let y = 0; y < this.battlefield.length; y++) {
                let row = this.battlefield[y][bulletPositionX];
                if(row?.bullet){
                    if(this.playerBulletObj.position[1] > 0){

                        if(this.battlefield[y-1][bulletPositionX]?.enemy || this.battlefield[y-1][bulletPositionX]?.barrier){
                            this.battlefield[y-1][bulletPositionX] = {
                                position:[bulletPositionX, y]
                            }
                            this.battlefield[y][bulletPositionX] = {
                                position:[bulletPositionX, y]
                            }
                            this.playerBulletObj={}
                            this.playerBullet = false
                        }
                        else {
                            this.battlefield[y-1][bulletPositionX] = this.battlefield[y][bulletPositionX]
                            this.battlefield[y][bulletPositionX] = {
                                position:[bulletPositionX, y]
                            }
                            this.playerBulletObj.position[1]-=1
                        }

                    } else {
                        this.battlefield[y][bulletPositionX] = {
                            position:[bulletPositionX][y]
                        }
                        this.playerBullet=false
                    }
                }
            }
        }
    }

    gameStart(){
        this.createBattlefield()
        this.move()
    }

    gameOver(){
        console.log('Game over')
    }

    updateHiScore(score) {
        if (score > this.#hiScore) {
            this.#hiScore = score;
        }
    }

    get level(){
        return this.#level
    }

    get hiScore(){
        return this.#hiScore
    }

    getPlayerLives(){
        return this.#player.lives
    }
}

export { Game }