class Ability {
  #live;

  constructor(live) {
    this.#live = live;
  }

  static createAbilityLive(positionX, positionY, game){
    game.battlefield[positionY][positionX].abilityLive = {
      live:1,
      startPosition:[positionX, positionY]
    }
  }

  static moveAbility(game){
    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){

        if(game.battlefield[y-1][x]?.abilityLive){

          if(game.battlefield[y][x]?.player){
            game.player.addLive()
            delete game.battlefield[y-1][x].abilityLive

          } else {
            game.battlefield[y][x].abilityLive = game.battlefield[y-1][x].abilityLive
            delete game.battlefield[y-1][x].abilityLive

          }

          if(y===21 && !!game.battlefield[y][x].abilityLive){
            delete game.battlefield[y][x].abilityLive
          }
        }
      }
    }
  }

  get live() {
    return this.#live;
  }
}

export {Ability}