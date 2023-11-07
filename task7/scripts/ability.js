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

  static deleteAbilityInPosition(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].abilityLive
  }

  static stepForward(game, positionY, positionX){
    game.battlefield[positionY][positionX].abilityLive = game.battlefield[positionY-1][positionX].abilityLive
    Ability.deleteAbilityInPosition(game, positionY-1, positionX)
  }

  static moveAbility(game){
    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){

        if(game.battlefield[y-1][x]?.abilityLive){

          if(game.battlefield[y][x]?.player){
            game.player.addLive()
            Ability.deleteAbilityInPosition(game, y-1, x)
          } else {
            Ability.stepForward(game, y, x)
          }

          if(y===21 && !!game.battlefield[y][x].abilityLive){
            delete game.battlefield[y][x].abilityLive
            Ability.stepForward(game, y, x)
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