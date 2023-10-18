class Queue {
    #maxRunningThreads;
    #tasks;
    #status;
    #runningThreads;
    #RUNNING = 'running';
    #STOPPED = 'stopped';
    #PAUSED = 'paused';

    constructor(maxRunningThreads) {
        this.#maxRunningThreads = maxRunningThreads;
        this.#tasks = [];
        this.#status = this.#RUNNING // paused, stopped, running
        this.#runningThreads = 0;
    }

    run = () => {
        this.#status = this.#RUNNING;
        this.#loop();
    }

    stop = () => {
        this.#status = this.#STOPPED;
        this.#loop()
    }

    pause = () => {
        this.#status = this.#PAUSED;
        this.#loop();
    }

    add = (task) => {
        this.#tasks.push(task)
        this.#loop()
    }

    #loop = () => {
        /*
        В случае если статус stopped то,
        очищаю массив с задачами,
        обнуляю число задачь которые выполняются,
        заканчиваю выполнения метода loop
        */

        if(this.#status === this.#STOPPED){
            this.#tasks = [];
            this.#runningThreads = 0
            return
        }

        /*
            Очередь работает при статусе running
            При статусе paused выполняются те функции которые остались, а потом остается в ожидании run() или add()
        */

        if (
            (this.#status === this.#RUNNING || this.#status === this.#PAUSED) &&
            this.#runningThreads < this.#maxRunningThreads &&
            this.#tasks.length > 0) {

            /*
            Беру задание из очереди заданий
            Инкрементирую счетчик задачь которые выполняются
             */

            const task = this.#tasks.shift();
            this.#runningThreads++;

            /*
            Делаю промис для выполнения внутри него задания которое взял из очереди
            В блоке catch обрабатываю ошибку которая может произойти внутри промиса
            В блоке finally деинкрементирую счетчик задачь и проверяю статус running для продолжения работы очереди
             */

            new Promise((resolve, reject) => {
                try {
                    task()
                    resolve()
                } catch (e) {
                    reject(e)
                }
            })
                .catch((e)=>{
                    console.log(`Error: ${e}`)
                })
                .finally(()=>{
                    this.#runningThreads--
                    if(this.#status === this.#RUNNING){
                        this.#loop();
                    }
            })
        }
    }
}

////////////////////////////////////////////////////////////////////////

const queue = new Queue(3);

function createTaskPromise(id) {
    return () =>{
        return new Promise((resolve) => {
            console.log(`Task id ${id}`)
            resolve()
        });
    }
}

function createTaskTimeout(id){
    return ()=> {
        return setTimeout(()=>{
            console.log(`Task id ${id}`)
        },4000)
    }
}

function createTaskSync(id){
    return ()=> { console.log(`Task sync ${id}`) }
}

function createTaskRequest() {
    return async ()=>{
        const response = await fetch("http://example.com/movies.json");
        return console.log(response);
    }
}

function start() {
    /*
    Прокидую в очередь Promise, Timeout, Request, Обычную функцию
     */
    for(let i = 1; i<=100; i++){
        let task
        if(i%2===0){
            if(i<50){

                task = createTaskTimeout(i)

            } else {

                task = createTaskRequest()

            }
        } else {
            if(i<50){

                task = createTaskPromise(i)

            } else {

                task = createTaskSync(i)

            }
        }
        queue.add(task);
        //queue.pause();
        //queue.run();
        //queue.stop();
    }
}

start();

