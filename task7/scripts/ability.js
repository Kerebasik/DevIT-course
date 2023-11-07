class Ability {
  #live;
  #weapon

  constructor(live, weapon = {}) {
    this.#live = live;
    this.#weapon = weapon
  }

  static createAbilityLive(positionX, positionY, game){
    game.battlefield[positionY][positionX].ability = new Ability(1,{damage:2})
  }

  static deleteAbilityInPosition(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].ability
  }

  static stepForward(game, positionY, positionX){
    game.battlefield[positionY][positionX].ability = game.battlefield[positionY-1][positionX].ability
    Ability.deleteAbilityInPosition(game, positionY-1, positionX)
  }

  static getLiveFromAbilityInPosition(game, positionX, positionY){
    return game.battlefield[positionY][positionX]?.ability.live
  }

  static getWeaponFromAbilityInPosition(game, positionX, positionY){
    return game.battlefield[positionY][positionX]?.ability.weapon
  }

  static moveAbility(game){

    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){

        if(game.battlefield[y-1][x]?.ability){

          if(game.battlefield[y][x]?.player){
            game.player.addLive( Ability.getLiveFromAbilityInPosition(game, x, y-1))
            game.player.weapon = Ability.getWeaponFromAbilityInPosition(game, x, y - 1)
            Ability.deleteAbilityInPosition(game, y-1, x)
          } else {
            Ability.stepForward(game, y, x)
          }

          if(y===21 && !!game.battlefield[y][x].ability){
            delete game.battlefield[y][x].ability
            Ability.stepForward(game, y, x)
          }
        }
      }
    }
  }

  get weapon(){
    return this.#weapon
  }

  get live() {
    return this.#live;
  }
}

export {Ability}