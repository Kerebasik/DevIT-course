class World {
    #population
    #statistic
    #year
    #couples

    constructor() {
        this.#population = []
        this.#couples = []
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

    #createCouples = () => {
        const women = this.#population.filter((human) => {
            return human.gender === 'Woman' && human.age > 16
        })
        const men = this.#population.filter((human) => {
            return human.gender === 'Male' && human.age > 16
        })
    }

    #childbirth = (mom, dad) => {
        let child
        const parents = [dad,mom]


        this.addHuman(child)
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
    #parentID
    #height
    #eyeColor
    #hairColor
    #male = 'Male'
    #woman = 'Woman'
    #blue = 'Blue'
    #brown = 'Brown'
    #green = 'Green'
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
    #lastNameList = ["Smith",
        "Johnson",
        "Williams",
        "Jones",
        "Brown",
        "Davis",
        "Miller",
        "Wilson",
        "Moore",
        "Taylor"
    ]


    constructor({firstName, lastName, gender, weight, height, eyeColor, hairColor, parentsID}){
        this.#id = Date.now() + this.#random();
        this.#firstName = firstName || this.#randomFirstName();
        this.#lastName = lastName;
        this.#gender = gender;
        this.#ageOfDeath = this.#random();
        this.#parentID = parentsID || []
        this.#age = 0;
        this.#weight = weight || this.#randomWeight;
        this.#height = height;
        this.#eyeColor = eyeColor;
        this.#hairColor = hairColor;
    }

    #random = () =>{
        return Math.floor(Math.random() * 99) + 1
    }

    #randomWeight = () => {
        return Math.floor(Math.random() * (120 - 50 + 1) + 50);
    }

    #randomFirstName = () => {
        let firstNameList

        if(this.#gender === this.#male){
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

        const random = Math.random();

        if(momEyeColor === this.#brown){
            if(dadEyeColor === this.#brown) {
                if (random < 0.027) {
                    childEyeColor = this.#blue;
                } else if (random < 0.074) {
                    childEyeColor = this.#green;
                } else {
                    childEyeColor = this.#brown;
                }
            }
            if(dadEyeColor === this.#green){
                if (random < 0.06) {
                    childEyeColor = this.#blue;
                } else if (random < 0.265) {
                    childEyeColor = this.#green;
                } else {
                    childEyeColor = this.#brown;
                }
            }
            if(dadEyeColor === this.#blue){
                if (random < 0.152) {
                    childEyeColor = this.#green;
                } else if (random < 0.173) {
                    childEyeColor = this.#blue;
                } else {
                    childEyeColor = this.#brown;
                }
            }
        }

        if(momEyeColor === this.#green){
            if(dadEyeColor === this.#brown){
                if (random < 0.06) {
                    childEyeColor = this.#blue;
                } else if (random < 0.265) {
                    childEyeColor = this.#green;
                } else {
                    childEyeColor = this.#brown;
                }
            }
            if(dadEyeColor === this.#green){
                if (random < 0.003) {
                    childEyeColor = this.#brown;
                } else if (random < 0.093) {
                    childEyeColor = this.#blue;
                } else {
                    childEyeColor = this.#green;
                }
            }
            if(dadEyeColor === this.#blue){
                if (random < 0.004) {
                    childEyeColor = this.#brown;
                } else if (random < 0.344) {
                    childEyeColor = this.#blue;
                } else {
                    childEyeColor = this.#green;
                }
            }
        }

        if(momEyeColor === this.#blue){
            if(dadEyeColor === this.#brown){
                if (random < 0.152) {
                    childEyeColor = this.#green;
                } else if (random < 0.173) {
                    childEyeColor = this.#blue;
                } else {
                    childEyeColor = this.#brown;
                }
            }
            if(dadEyeColor === this.#green){
                if (random < 0.004) {
                    childEyeColor = this.#brown;
                } else if (random < 0.344) {
                    childEyeColor = this.#blue;
                } else {
                    childEyeColor = this.#green;
                }
            }
            if(dadEyeColor === this.#blue){
                if (random < 0.002) {
                    childEyeColor = this.#brown;
                } else if (random < 0.0025) {
                    childEyeColor = this.#green;
                } else {
                    childEyeColor = this.#blue;
                }
            }
        }


        return childEyeColor
    }

    static giveGender = (momGender, dadGender) => {
        return Math.random() < 0.5 ? momGender : dadGender
    }

    static giveHeight = (momHeight, dadHeight, childGender) => {
        if (momHeight < 0 || dadHeight < 0 || !childGender) {
            return "Data isn't correct";
        }

        const averageHeightOfParents = (momHeight + dadHeight) / 2;

        const coefficient = childGender === this.#male ? Math.random()*10 : 0;

        const childHeight = averageHeightOfParents + coefficient;

        return childHeight
    }

    get name(){
        return this.#firstName + this.#lastName
    }

    get eyeColor(){
        return this.#eyeColor
    }

    get hairColor(){
        return this.#hairColor
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
const person1 = new Human( {firstName:'Dave', lastName:'Johnson', gender:'Male', height:180, eyeColor:'Brown', hairColor:'Blond'});
const person2 = new Human({firstName:'Shara',lastName:'Gray', gender:'Woman', height:150, eyeColor:'Blown', hairColor:'Black'})


console.log('Start')


console.log()
world.addHuman(person1)
world.addHuman(person2)
world.startGame()