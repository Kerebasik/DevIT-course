
const allowedChars = ['q','w','e','r','t','y','u','i','o','p'];

const myPassword = 'type'

const lengthAllowedChars = allowedChars.length

class Queue {
    #maxRunningThreads;
    #tasks;
    #status;
    #runningThreads;
    #onQueueComplete;
    #RUNNING = 'running';
    #STOPPED = 'stopped';
    #PAUSED = 'paused';

    constructor(maxRunningThreads = 5, onQueueComplete=()=>{}) {
        this.#maxRunningThreads = maxRunningThreads;
        this.#tasks = [];
        this.#onQueueComplete = onQueueComplete;
        this.#status = this.#RUNNING; // paused, stopped, running
        this.#runningThreads = 0;
    }

    run = () => {
        this.#status = this.#RUNNING;
        this.#loop();
    }

    stop = () => {
        this.#status = this.#STOPPED;
        this.#onQueueComplete();
        this.#loop()
    }

    pause = () => {
        this.#status = this.#PAUSED;
        this.#loop();
    }

    add = (task, options = {}) => {
        /*
        Пушу объект с полями:
            task - задача которую нужно будет выполнить
            options.priority - её приоритет перед остальными задачами. 100 максимальная приоритетность
            options.onResolve - Колбэк при успешном выполнении задачи.
            options.onReject - Колбэк при не успешном выполнении задачи.
         */
        if (options.priority > 10) {
            options.priority = 10;
        }

        this.#tasks.push({
            task: () => task,
            priority: options.priority || 0,
            onResolve: options.onResolve || (() => {}),
            onReject: options.onReject || (() => {}),
        });

        this.#loop();
    }

    #giveTask = () => {
        this.#tasks.sort((a, b) => a.priority - b.priority);
        return this.#tasks.shift();
    }

    #runTask = (taskObject) => {
        new Promise(async (resolve, reject) => {
            try {

                const data = await taskObject.task()
                if(data === true){
                    resolve(data)
                } else {
                    reject(data)
                }
            } catch (e) {
                reject(e)
            }
        })
            .then(()=>{
                taskObject?.onResolve()
            })
            .catch(()=>{
                taskObject?.onReject()
            })
            .finally(()=>{
                this.#runningThreads--
                if(this.#status === this.#RUNNING){
                    this.#loop();
                }
            })
    }

    #onFinish = () => {
        this.stop()
        this.#onQueueComplete();
        return true
    }

    #loop = () => {

        if(this.#status === this.#PAUSED){
            return;
        }

        if (this.#status === this.#STOPPED) {
            this.#tasks = [];
            this.#runningThreads = 0;
            return;
        }

        if (
            this.#status === this.#RUNNING
        ) {
            if(this.#tasks.length > 0){

                if(this.#runningThreads < this.#maxRunningThreads){

                    this.#runningThreads++;
                    const task = this.#giveTask();
                    this.#runTask(task)

                }

            } else {

                this.#onFinish()

            }
        }
    }
}

function createMask(length = 1) {
    return new Array(length).fill(0);
}

function generatePassword(indexes) {
    if (!Array.isArray(indexes)) {
        throw new Error('Input must be an array');
    }

    let password = ''

    /*
    Прохожусь по массиву символов собирая пароль по маске
     */

    for(const item of indexes){
        password = password + allowedChars[item]
    }

    return password
}

function login(password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(myPassword === password);
        }, 1000);
    });
}

function incrementIndexes(indexes){
    if (!Array.isArray(indexes)) {
        throw new Error('Input must be an array');
    }

    for (let i = indexes.length - 1; i >= 0; i--) {

        /*
        Инкрементирую только последний элемент
         */
        if(i===indexes.length-1){
            indexes[i]++;
        }
        /*
        Проверяю не является ли элемент больше максимального значения.
        Если да,то присваиваю ему 0 и инкрементирую следующий элемент
         */
        if(indexes[i]>lengthAllowedChars-1){
            indexes[i]=0;
            indexes[i-1]+=1
        }
    }

    return indexes;
}

function canIncrementIndexes(indexes) {
    if (!Array.isArray(indexes)) {
        throw new Error('Input must be an array');
    }

    let count=0
    /*
       Вычитаю индексы из максимального варианта маски
    */
    for(let i = 0; i < indexes.length; i++){
        count += lengthAllowedChars - 1 - indexes[i]
    }

    return count > 0;
}


function countPriority(password, priorityChars = []) {
    let count = 0;

    for (const char of password) { // проходимся по паролю
        if (priorityChars.includes(char)) { // проверяем есть ли символ в пароле
            count++; // если символ совпадает то +1 к счетчику
        }
    }

    let priority = 10 // дефолтный приоритет

    if( count > 0){ // если не совпадает не с одним символом, то приоритет будет 10
        priority = count * 33;
    }

    return priority;
}

function* generateIndexes(maskSize= 1){
    let indexes = createMask(maskSize) // создаем начальную маску
    yield indexes
    while (canIncrementIndexes(indexes)){ // генератор будет выполняться пока у нас есть возможность итерировать индексы
        indexes = incrementIndexes(indexes)
        yield indexes
    }
}

function brute(maxLengthPassword = 6, priorityChars ) {

    let onComplete = () => console.log('Пароль подобран')
    let queue = new Queue(3, onComplete);
    let indexes

    for (let i = 1; i <= maxLengthPassword; i++) {
        let gena = generateIndexes(i); // создаем генератор который будет возвращать нам индексы

        do {
            indexes = gena.next() // возвращаем первый yield генератора
            if (indexes.value === undefined){ // в случае если value === undefined, то мы останавливаем цикл
                break;
            }
            let password = generatePassword(indexes.value); // генерируем пароль из индексов
            const task = login(password) // создаем таску
            queue.add(
                 task,
                 {
                     priority: countPriority(password, priorityChars),
                     onResolve: () => {
                         console.log(`Password is ${password}`);
                         queue.stop()
                     }
                 }); // передаем все в очередь
        } while (indexes.done === false);

    }
}


brute(4, [])


