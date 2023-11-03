const Helper = {
    random: () => {
        return Math.floor(Math.random() * 99) + 1; // случайное число от 1 до 100
    },
    randomAgeOfDeath: () => {
        return Math.floor(20 + Math.random() * (100 + 1 - 20)); // случайный возраст смерти от 20 до 100
    },
    randomWeight: () => {
        return Math.floor(Math.random() * (120 - 50 + 1) + 50); // случайный вес от 50 до 120
    },
};


class World {
    #population
    #statistic

    constructor() {
        this.#population = []
        this.#statistic = {
            yearly:{
                countMen:0,
                countWomen:0,
                born:0,
                dead:0
            },
            year:0,
            cataclysm:{
                tsunami:0,
                war:0,
                womanCataclysm:0,
                manCataclysm:0
            }
        }

    }

    #triggerCataclysm = () => {
        if (Math.random() < 0.02) {
            const random = Math.floor(1 + Math.random()*(4 - 1 + 1))
            switch (random){
                case 1:{
                    this.#statistic.cataclysm.tsunami+=1
                    const tsunami = new NaturalCataclysm('Tsunami', 3000);
                    tsunami.affectPopulation(this)
                    break;
                }
                case 2:{
                    this.#statistic.cataclysm.war+=1
                    const war = new ManMadeCataclysm('War', 30)
                    war.affectPopulation(this)
                    break;
                }
                case 3:{
                    this.#statistic.cataclysm.womanCataclysm+=1
                    const womanCataclysm = new GenderCataclysm("Female Cataclysm", Human.womanGender);
                    womanCataclysm.affectPopulation(this)
                    break;
                }
                case 4:{
                    this.#statistic.cataclysm.manCataclysm+=1
                    const manCataclysm = new GenderCataclysm("Male Cataclysm", Human.maleGender);
                    manCataclysm.affectPopulation(this)
                    break;
                }
            }

        }
    }

    #agingPopulation = () => {
        for(let human of this.#population){
            human.aging(this)
        }
    }

    #filterWomen = () => {
        return this.#population.filter((human) => {
            return human.gender === Human.womanGender && human.age > 18 && human.age < 60
        })
    }

    #filterMen = () => {
        return this.#population.filter((human) => {
            return human.gender === Human.maleGender && human.age > 18 && human.age < 70
        })
    }

    #randomMan = (men= []) => {
        return men[Math.floor(Math.random() * men.length)];
    }

    #randomWoman = (women = []) => {
        return women[Math.floor(Math.random() * women.length)]
    }

    #createCouples = () => {
        const women = this.#filterWomen()

        const men = this.#filterMen()

        this.#statistic.yearly.countWomen = women.length
        this.#statistic.yearly.countMen = men.length

        while (women.length > 0 && men.length > 0) {

            const randomWoman = this.#randomWoman(women);
            const randomMan = this.#randomMan(men)

            if (randomWoman && randomMan) {
                if (this.#population.length < 200 || Human.haveSameParents(randomWoman, randomMan)) {

                    const children = Human.sympathy(randomWoman, randomMan)

                    children?.map((child)=>{
                        this.addHuman(child)
                        this.#statistic.yearly.born += 1;
                    })
                }
            }

            women.splice(women.indexOf(randomWoman), 1);
            men.splice(men.indexOf(randomMan), 1);
        }
    }

    #passYear = () => {
        this.#statistic.year++
        this.#agingPopulation()
        this.#triggerCataclysm()
        this.#createCouples()
        this.#yearlyLog()
    }

    #yearlyLog = () => {
        console.log()
        console.log(`Yearly Log: ${ this.#statistic.year}`)
        console.log('Population: ', this.#population.length)
        console.log('Dead humans: ',  this.#statistic.yearly.dead)
        console.log('People born: ', this.#statistic.yearly.born);
        console.log()
        console.log('Men of reproductive age: ', this.#statistic.yearly.countMen);
        console.log('Women of reproductive age: ', this.#statistic.yearly.countWomen);
        console.log()
        console.log('War: ',this.#statistic.cataclysm.war)
        console.log('Tsunami: ',this.#statistic.cataclysm.tsunami)
        console.log('Man Cataclysm: ',this.#statistic.cataclysm.manCataclysm)
        console.log('Woman Cataclysm: ',this.#statistic.cataclysm.womanCataclysm)
        this.#statistic.yearly.dead=0
        this.#statistic.yearly.born=0
    }

    addHuman = (human) => {
        this.#population.push(human)
    }

    startGame = () => {
        this.#life()
    }

    deathHuman = (human) => {
        this.#statistic.yearly.dead+=1

        for(let i = 0; i < this.#population.length; i++){
            if(this.#population[i].id === human.id){
                this.#population.splice(i,1)
            }
        }
    }

    #gameOver = (timerId) => {
        clearTimeout(timerId);
        console.log('Game Over. Population dead :(')
    }

    /*
    1 секунда это 1 год.
    Если популяция стает 0, то есть все умерли, то игра окончена.
    Каждый год население стареет
     */

    #life = () => {
        const timer = setInterval(() => {

            if(this.#population.length===0){
                this.#gameOver(timer)
            } else {
                this.#passYear();
            }

            }, 1000);
    }

    get population(){
        return this.#population;
    }

    set population(population){
        this.#population=population
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
    #parentID
    #height
    #eyeColor
    #hairColor

    static maleGender = 'Man'
    static womanGender = 'Woman'
    static blueEyeColor = 'Blue'
    static brownEyeColor = 'Brown'
    static greenEyeColor = 'Green'

    #mansFirstNameList = ["John",
        "Michael",
        "William",
        "James",
        "Christopher",
        "David",
        "Robert",
        "Joseph",
        "Charles",
        "Thomas"
    ]

    #womensFirstNameList = ["Emily",
        "Sarah",
        "Jessica",
        "Jennifer",
        "Amanda",
        "Hannah",
        "Megan",
        "Ashley",
        "Lauren",
        "Grace"
    ]


    constructor({firstName, lastName, gender, weight, height, eyeColor, hairColor, parentsID}){
        this.#id = Date.now() + Helper.random()
        this.#firstName = firstName || this.#randomFirstName(gender);
        this.#lastName = lastName;
        this.#gender = gender;
        this.#ageOfDeath = Helper.randomAgeOfDeath();
        this.#parentID = parentsID || []
        this.#age = 0;
        this.#weight = weight || Helper.randomWeight();
        this.#height = height;
        this.#eyeColor = eyeColor;
        this.#hairColor = hairColor;
    }

    aging = (world) =>{
        this.#age += 1
        if(this.age === this.ageOfDeath){
            world.deathHuman(this)
        }
    }

    #randomFirstName = (gender) => {
        /*
        Случайное имя ребенка в зависимости от гендера
         */

        let firstNameList

        if(gender === Human.maleGender){
            firstNameList = this.#mansFirstNameList
        }  else {
            firstNameList = this.#womensFirstNameList
        }
        const randomIndex = Math.floor(Math.random() * firstNameList.length);

        return firstNameList[randomIndex]
    }

    static giveHairColor = (momHairColor, dadHairColor) => {
        return Math.random() < 0.5 ? momHairColor : dadHairColor
    }

    static giveEyeColor = (momEyeColor, dadEyeColor)=>{
        let childEyeColor

        /*
        Сложная логика подсчета цвета глаз.
        Сделана по сайту: https://gencalc.org/ru/genetics/tsvet-glaz
         */

        const random = Math.random();

        if(momEyeColor === Human.brownEyeColor){
            if(dadEyeColor === Human.brownEyeColor) {
                if (random < 0.027) {
                    childEyeColor = Human.blueEyeColor;
                } else if (random < 0.074) {
                    childEyeColor = Human.greenEyeColor;
                } else {
                    childEyeColor = Human.brownEyeColor;
                }
            }
            if(dadEyeColor === Human.greenEyeColor){
                if (random < 0.06) {
                    childEyeColor = Human.blueEyeColor;
                } else if (random < 0.265) {
                    childEyeColor = Human.greenEyeColor;
                } else {
                    childEyeColor = Human.brownEyeColor;
                }
            }
            if(dadEyeColor === Human.blueEyeColor){
                if (random < 0.152) {
                    childEyeColor = Human.greenEyeColor;
                } else if (random < 0.173) {
                    childEyeColor = Human.blueEyeColor;
                } else {
                    childEyeColor = Human.brownEyeColor;
                }
            }
        }

        if(momEyeColor === Human.greenEyeColor){
            if(dadEyeColor === Human.brownEyeColor){
                if (random < 0.06) {
                    childEyeColor = Human.blueEyeColor;
                } else if (random < 0.265) {
                    childEyeColor = Human.greenEyeColor;
                } else {
                    childEyeColor = Human.brownEyeColor;
                }
            }
            if(dadEyeColor === Human.greenEyeColor){
                if (random < 0.003) {
                    childEyeColor = Human.brownEyeColor;
                } else if (random < 0.093) {
                    childEyeColor = Human.blueEyeColor;
                } else {
                    childEyeColor = Human.greenEyeColor;
                }
            }
            if(dadEyeColor === Human.blueEyeColor){
                if (random < 0.004) {
                    childEyeColor = Human.brownEyeColor;
                } else if (random < 0.344) {
                    childEyeColor = Human.blueEyeColor;
                } else {
                    childEyeColor = Human.greenEyeColor;
                }
            }
        }

        if(momEyeColor === Human.blueEyeColor){
            if(dadEyeColor === Human.brownEyeColor){
                if (random < 0.152) {
                    childEyeColor = Human.greenEyeColor;
                } else if (random < 0.173) {
                    childEyeColor = Human.blueEyeColor;
                } else {
                    childEyeColor = Human.brownEyeColor;
                }
            }
            if(dadEyeColor === Human.greenEyeColor){
                if (random < 0.004) {
                    childEyeColor = Human.brownEyeColor;
                } else if (random < 0.344) {
                    childEyeColor = Human.blueEyeColor;
                } else {
                    childEyeColor = Human.greenEyeColor;
                }
            }
            if(dadEyeColor === Human.blueEyeColor){
                if (random < 0.002) {
                    childEyeColor = Human.brownEyeColor;
                } else if (random < 0.0025) {
                    childEyeColor = Human.greenEyeColor;
                } else {
                    childEyeColor = Human.blueEyeColor;
                }
            }
        }

        return childEyeColor
    }


    static giveGender = () => {
        return Math.random() < 0.5 ? this.womanGender : this.maleGender
    }

    /*
    Метод для получения роста ребенка на основе его гендера и роста родителей
     */

    static haveSameParents = (woman, man) => {
        // Проверка, что у женщины и мужчины нет общих родителей
        return woman.parentsID.every(id => !man.parentsID.includes(id));
    }

    static sympathy = (randomWoman, randomMan) => {
        if(
            Math.abs(randomWoman.age - randomMan.age) <= 5 &&
            !randomMan.parentsID.includes(randomWoman.id) &&
            !randomWoman.parentsID.includes(randomMan.id)
        ) {
           return this.pregnancy(randomWoman, randomMan)
        }
    }

    static pregnancy = (randomWoman, randomMan) => {
        if (Math.random() <= 0.85) { // Шанс беременности 85%
            if (Math.random() <= 0.1) {
                // Шанс рождения двойни 10%
               return this.#childbirth(randomWoman, randomMan, 2);
            } else if (Math.random() <= 0.05) {
                // Шанс рождения тройни 5%
                return this.#childbirth(randomWoman, randomMan, 3);
            } else {
                return this.#childbirth(randomWoman, randomMan);
            }
        }
    }

    static #childbirth = (mom, dad, numberOfChildren = 1) => {
        //this.#statistic.yearly.born += numberOfChildren;
        const newChildren = [];
        for (let i = 0; i < numberOfChildren; i++) {
            const lastName = dad.lastName;
            const gender = Human.giveGender();
            const height = Human.giveHeight(mom.height, dad.height, gender);
            const eyeColor = Human.giveEyeColor(mom.eyeColor, dad.eyeColor);
            const hairColor = Human.giveHairColor(mom.hairColor, dad.hairColor);
            const parentsID = [mom.id, dad.id];
            const options = {
                lastName,
                gender,
                height,
                eyeColor,
                hairColor,
                parentsID
            };

            const newChild = new Human(options);
            newChildren.push(newChild)
        }
        return newChildren
    }


    static giveHeight = (momHeight, dadHeight, childGender) => {
        if (momHeight < 0 || dadHeight < 0 || !childGender) {
            return "Data isn't correct";
        }

        /*
        Получаю средний рост родителей
         */

        const averageHeightOfParents = (momHeight + dadHeight) / 2;

        /*
        Мальчики обычно выше чем девочки.
        Поэтому создаю коэффициент который будет прибавляться к среднему росту родитетелей.
        Для мальчиков это рандомное число от 0 до 1 умноженное на 20
        Для девочек просто 6
         */

        const coefficient = childGender === Human.maleGender ? Math.random() * 20 : 6;

        return Math.floor(averageHeightOfParents + coefficient)
    }

    get eyeColor(){
        return this.#eyeColor
    }

    get hairColor(){
        return this.#hairColor
    }

    get gender(){
        return this.#gender
    }

    get lastName (){
        return this.#lastName
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

    get height(){
        return this.#height
    }

    get parentsID(){
        return this.#parentID
    }

}

class Cataclysm {
    _name
    _casualties
    constructor(name, casualties) {
        this._name = name;
        this._casualties = casualties
    }

    _show(){
        console.log(`${this._name} claimed ${this._casualties} lives`)
    }

    _disasterAllLivesShow() {
        console.log(`Cataclysm ${this._name} disaster claimed all lives`)
    }
}

class NaturalCataclysm extends Cataclysm{
    constructor(name, casualties) {
        super(name, casualties)
    }

    affectPopulation(world) {
        const casualties = this._casualties;
        if (world.population.length >= casualties) {
            world.population.splice(0, casualties);
            this._show()
        } else {
            world.population = [];
            this._disasterAllLivesShow()
        }

    }
}

class ManMadeCataclysm extends Cataclysm{
    #percentOfThePopulation
    constructor(name, percentOfThePopulation) {
        super(name);
        this.#percentOfThePopulation = percentOfThePopulation
    }

    affectPopulation(world) {
        const casualties = Math.floor(world.population.length * (this.#percentOfThePopulation / 100))
        console.log(casualties)
        if (world.population.length >= casualties) {
            world.population.splice(0, casualties);
            this.#show()
        } else {
            world.population = [];
            this._disasterAllLivesShow()
        }
    }

    #show() {
        console.log(`${this._name} claimed ${this.#percentOfThePopulation} percent lives`)
    }

}

class GenderCataclysm extends Cataclysm {
    #gender
    constructor(name, gender) {
        super(name);
        this.#gender = gender
    }

    affectPopulation(world) {
        world.population = world.population.filter((human, index) => {
            return !(human.gender === this.#gender && index % 2 === 0);
        });
        this.#show();
    }

    #show(){
        console.log(`${this._name} took half our lives of ${this.#gender}`)
    }
}

const world = new World()
const person1 = new Human( {firstName:'Dave', lastName:'Johnson', gender:Human.maleGender, height:180, eyeColor:'Brown', hairColor:'Blond'});
const person2 = new Human({firstName:'Shara',lastName:'Gray', gender:Human.womanGender, height:150, eyeColor:'Blue', hairColor:'Black'})

console.log('Start')
world.addHuman(person1)
world.addHuman(person2)

world.startGame()


