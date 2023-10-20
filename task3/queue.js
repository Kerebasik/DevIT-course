class Queue {
    #maxRunningThreads;
    #tasks;
    #status;
    #runningThreads;
    #onCallback;
    #RUNNING = 'running';
    #STOPPED = 'stopped';
    #PAUSED = 'paused';

    constructor(maxRunningThreads, onCallback=()=>{}) {
        this.#maxRunningThreads = maxRunningThreads;
        this.#tasks = [];
        this.#onCallback = onCallback;
        this.#status = this.#RUNNING; // paused, stopped, running
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

    add = (task, options = {}) => {
        /*
        Пушу объект с полями:
            task - задача которую нужно будет выполнить
            options.priority - её приоритет перед остальными задачами. 100 максимальная приоритетность
            options.onResolve - Колбэк при успешном выполнении задачи.
            options.onReject - Колбэк при не успешном выполнении задачи.
         */
        if (options.priority > 100) {
            options.priority = 100;
        }

        this.#tasks.push({
            task,
            priority: options.priority,
            onResolve: options.onResolve || (() => {}),
            onReject: options.onReject || (() => {}),
        });

        this.#loop();
    }



    #giveTask = () => {
        const random = this.#randomNumber(); // беру рандомное число

        let task

        for (let i = 0; i < this.#tasks.length; i++) { // прохожусь по очереди
            if (this.#tasks[i].priority >= random) { // если нахожу задачу с приоритетом больше чем рандомное число возвращаю его
                return this.#tasks.splice(i, 1)[0];
            }
        }

        if(task === undefined){ // если я прошел по задачам и не нашел задачу с приоритетом больше чем рандомное число, просто беру из начала очереди.
            task = this.#tasks.shift();
        }

        return task
    }

    #randomNumber = () =>{
        return Math.floor(Math.random() * 99) + 1 // 1 до 100
    }

    #runTask = (taskObject) => {
        new Promise(async (resolve, reject) => {
            try {
                const data = await taskObject.task()
                resolve(data)
            } catch (e) {
                reject(e)
            }
        })
            .then(()=>{
                taskObject?.onResolve()
            })
            .catch((e)=>{
                console.log(`Error: ${e}`)
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
        this.#onCallback();
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

////////////////////////////////////////////////////////////////////////



function createTaskPromise() {
    return () =>{
        return new Promise((resolve) => {
            resolve(2)
        });
    }
}

function createTaskTimeout(){
    return ()=> {
        return setTimeout(()=>{
            return 1+1
        },4000)
    }
}

function createTaskSync(){
    return ()=> { return 2 }
}

function createTaskRequest() {
    return async ()=>{
        return  await fetch("http://example.com/movies.json");
    }
}

function start() {
    const callback = () => {
        console.log('Queue выполнена')
    }

    const queue = new Queue(3, callback);
    /*
    Прокидую в очередь Promise, Timeout, Request, Обычную функцию
     */
    for (let i = 1; i <= 100; i++) {
        let task = createTaskPromise(i);
        const options = {
            priority: i,
            onResolve: () => {
                console.log(`createTaskPromise Task ${i} is resolve`);
            },
            onReject: () => {
                console.log(`createTaskPromise Task ${i} is reject`);
            }
        };
        queue.add(task, options);
    }
}

start();




