class World {
    #population
    #statistic
    #couples

    constructor() {
        this.#population = []
        this.#couples = []
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
                    const tsunami = new Tsunami();
                    tsunami.affectPopulation(this)
                    break;
                }
                case 2:{
                    this.#statistic.cataclysm.war+=1
                    const war = new War()
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
            human.age+=1
            if(human.age === human.ageOfDeath){
                this.#deathHuman(human)
            }
        }
    }

    #createCouples = () => {
        const women = this.#population.filter((human) => {
            return human.gender === Human.womanGender && human.age > 18 && human.age < 60
        })

        const men = this.#population.filter((human) => {
            return human.gender === Human.maleGender && human.age > 18 && human.age < 70
        })

        this.#statistic.yearly.countWomen=women.length
        this.#statistic.yearly.countMen = men.length

        while (women.length > 0 && men.length > 0) {
            const randomWoman = women[Math.floor(Math.random() * women.length)];
            const randomMan = men[Math.floor(Math.random() * men.length)];

            if (randomWoman && randomMan) {

                if (this.#population.length < 200 || Human.haveSameParents(randomWoman, randomMan)) {

                    if (
                        Math.abs(randomWoman.age - randomMan.age) <= 5 &&
                        !randomMan.parentsID.includes(randomWoman.id) &&
                        !randomWoman.parentsID.includes(randomMan.id)
                    ) {
                        if (Math.random() <= 0.85) { // Шанс беременности 85%

                            if (Math.random() <= 0.1) {
                                // Шанс рождения двойни 10%
                                this.#childbirth(randomWoman, randomMan, 2);
                            } else if (Math.random() <= 0.05) {
                                // Шанс рождения тройни 5%
                                this.#childbirth(randomWoman, randomMan, 3);
                            } else {
                                this.#childbirth(randomWoman, randomMan);
                            }
                        }
                    }
                }
            }

            women.splice(women.indexOf(randomWoman), 1);
            men.splice(men.indexOf(randomMan), 1);
        }
    }

    #childbirth = (mom, dad, numberOfChildren = 1) => {
        this.#statistic.yearly.born += numberOfChildren;
        for (let i = 0; i < numberOfChildren; i++) {
            const lastName = dad.lastName;
            const gender = Human.giveGender(mom.gender, dad.gender);
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
            this.addHuman(newChild);
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

    #deathHuman = (human) => {
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
        this.#id = Date.now() + this.#random();
        this.#firstName = firstName || this.#randomFirstName(gender);
        this.#lastName = lastName;
        this.#gender = gender;
        this.#ageOfDeath = this.#randomAgeOfDeath();
        this.#parentID = parentsID || []
        this.#age = 0;
        this.#weight = weight || this.#randomWeight;
        this.#height = height;
        this.#eyeColor = eyeColor;
        this.#hairColor = hairColor;
    }

    #random = () =>{
        return Math.floor(Math.random() * 99) + 1 // случайное число от 1 до 100
    }

    #randomAgeOfDeath = () =>{
        return Math.floor(20 + Math.random() * (100 + 1 - 20)) // случайный возраст смерти от 20 до 100. 20 взята для того чтобы первые люди могли дать потомство
    }

    #randomWeight = () => {
        return Math.floor(Math.random() * (120 - 50 + 1) + 50); // случайный вес от 50 до 120
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

    static giveGender = (momGender, dadGender) => {
        return Math.random() < 0.5 ? momGender : dadGender
    }

    /*
    Метод для получения роста ребенка на основе его гендера и роста родителей
     */

    static haveSameParents = (woman, man) => {
        // Проверка, что у женщины и мужчины нет общих родителей
        return woman.parentsID.every(id => !man.parentsID.includes(id));
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
    constructor(name) {
        this.name = name;
    }

    disasterAllLives() {
        return console.log(`Cataclysm disaster claimed all lives`)
    }
}

class Tsunami extends Cataclysm {
    #casualties
    constructor() {
        super('Tsunami');
        this.#casualties = 4600;
    }

    affectPopulation(world) {
        const casualties = this.#casualties;
        if (world.population.length >= casualties) {
            world.population.splice(0, casualties);
            this.#show()
        } else {
            world.population = [];
            this.disasterAllLives()
        }

    }

    #show() {
        return console.log(`Tsunami disaster claimed ${this.#casualties} lives`)
    }
}

class War extends Cataclysm {
    #casualties
    constructor() {
        super('War');
    }

    affectPopulation(world) {
        const casualties = Math.floor(world.population.length*0.3)
        if (world.population.length >= casualties) {
            world.population.splice(0, casualties);
            this.#show()
        } else {
            world.population = [];
            this.disasterAllLives()
        }

    }
    #show() {
        return console.log(`War disaster claimed ${this.#casualties} lives`)
    }
}

class GenderCataclysm extends Cataclysm {
    #name
    #gender
    constructor(name, gender) {
        super(name);
        this.#name = name
        this.#gender = gender
    }

    affectPopulation(world) {
        world.population = world.population.filter((human, index) => {

            return !(human.gender === this.#gender && index % 2 === 0);


        });
        this.#show();
    }

    #show(){
        return console.log(`${this.name} took half our lives`)
    }
}
const world = new World()
const person1 = new Human( {firstName:'Dave', lastName:'Johnson', gender:Human.maleGender, height:180, eyeColor:'Brown', hairColor:'Blond'});
const person2 = new Human({firstName:'Shara',lastName:'Gray', gender:Human.womanGender, height:150, eyeColor:'Blue', hairColor:'Black'})

console.log('Start')
world.addHuman(person1)
world.addHuman(person2)

world.startGame()


