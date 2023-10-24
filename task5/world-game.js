class World {
    #population
    #statistic
    #year
    #male = 'Male'
    #woman = 'Woman'

    constructor() {
        this.#population = []
        this.#statistic = {
            yearly:{
                dead:0
            },
            allGame:{
                dead:0
            }
        }
        this.#year = 0
    }

    #agingPopulation = () => {
        for(let human of this.#population){
            human.age+=1
            if(human.age === human.ageOfDeath){
                this.#deathHuman(human)
            }
        }
    }

    #passYear = () => {
        this.#year++
        this.#agingPopulation()
        if(this.#population.length>0){
            this.#yearlyLog()
        }

    }

    #yearlyLog = () => {
        console.log(`Yearly Log: ${this.#year}`)
        console.log('Population: ', this.#population.length,
            '\n',
            'Dead humans: ', this.#statistic.yearly.dead,
            '\n',
        )
        this.#statistic.yearly.dead=0
    }


    addHuman = (human) => {
        this.#population.push(human)
    }

    startGame = () => {
        this.#life()
    }

    #deathHuman = (human) => {
        this.#statistic.allGame.dead+=1
        this.#statistic.yearly.dead+=1

        for(let i = 0; i < this.#population.length; i++){
            if(this.#population[i].id === human.id){
                this.#population.splice(i,1)
            }
        }
    }

    #allGameLog = () => {
        console.log(`All statistic`)
        console.log('Population: ', this.#population.length,
            '\n',
            'Dead humans: ', this.#statistic.allGame.dead,
            '\n',
        )
    }

    #gameOver = (timerId) => {
        clearTimeout(timerId);
        this.#allGameLog()
        console.log('Game Over. Population dead :(')
    }

    #life = () => {
        const timer = setInterval(() => {
            if(this.#population.length===0){
                this.#gameOver(timer)
            }
            this.#passYear();

            }, 1000);
    }
}



class Human {
    #id
    #firstName
    #lastName
    #gender
    #ageOfDeath
    #age
    #weight
    #height
    #eyeColor
    #hairColor


    constructor(firstName, lastName, gender, weight, height, eyeColor, hairColor){
        this.#id = Date.now() + this.#random();
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#gender = gender;
        this.#ageOfDeath = this.#random();
        this.#age = 0;
        this.#weight = weight;
        this.#height = height;
        this.#eyeColor = eyeColor;
        this.#hairColor = hairColor;
    }

    #random = () =>{
        return Math.floor(Math.random() * 99) + 1
    }

    get name(){
        return this.#firstName + this.#lastName
    }


    get ageOfDeath(){
        return this.#ageOfDeath
    }

    get id(){
        return this.#id
    }

    get age(){
        return this.#age
    }

    set age(newAge){
        this.#age = newAge;
    }
}

const world = new World()
const person1 = new Human('John', 'Doe', 'Male', 80, 180, 'Blue', 'Brown');
const person2 = new Human('Samanta', 'Gray', 'Woman', 50, 150, 'Blown', 'Blond')


console.log('Start')

world.addHuman(person1)
world.addHuman(person2)
world.startGame()