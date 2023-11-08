class Ability {
  #live;
  #weapon

  constructor(live, weapon = {}) {
    this.#live = live;
    this.#weapon = weapon
  }
  // Создание улучшения в определенной позиции с новым оружием
  static createAbilityLive(positionX, positionY, game){
    game.battlefield[positionY][positionX].ability = new Ability(1,{damage:2})
  }
  // Удаление улучшения в определенной позиции
  static deleteAbilityInPosition(game, positionY, positionX){
    delete game.battlefield[positionY][positionX].ability
  }

  // опускание ниже на линию
  static stepForward(game, positionY, positionX){
    game.battlefield[positionY][positionX].ability = game.battlefield[positionY-1][positionX].ability
    Ability.deleteAbilityInPosition(game, positionY-1, positionX)
  }

  // получения количества дополнительных жизней из улучшения
  static getLiveFromAbilityInPosition(game, positionX, positionY){
    return game.battlefield[positionY][positionX]?.ability.live
  }
  // получения оружия из улучшения
  static getWeaponFromAbilityInPosition(game, positionX, positionY){
    return game.battlefield[positionY][positionX]?.ability.weapon
  }

  // движение нижу по линии
  static moveAbility(game){

    for(let x = game.sizeX - 1; x > 0; x--){
      for(let y = game.sizeY - 1; y > 0; y--){
        // если ниже улучшение, то
        if(game.battlefield[y-1][x]?.ability){
          // игрок, то
          if(game.battlefield[y][x]?.player){
            // добавляем игроку жизнь
            game.player.addLive( Ability.getLiveFromAbilityInPosition(game, x, y-1))
            // улучшаем оружие игрока
            game.player.weapon = Ability.getWeaponFromAbilityInPosition(game, x, y - 1)
            // удаляем улучшение на позиции
            Ability.deleteAbilityInPosition(game, y-1, x)
          } else {

          }

          if(y===21 && !!game.battlefield[y][x].ability){
            // удаляем улучшение на позиции
            delete game.battlefield[y][x].ability
          }
          // шаг вперед
          Ability.stepForward(game, y, x)
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