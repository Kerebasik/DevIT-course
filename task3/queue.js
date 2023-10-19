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

    add = (task, priority, onResolve = ()=>{}, onReject = ()=>{}) => {
        /*
        Пушу объект с полями:
            task - задача которую нужно будет выполнить
            priority - её приоритет перед остальными задачами 100 максимальная приоритетность
         */
        if(priority > 100){
            priority = 100
        }
        this.#tasks.push({
            task,
            priority,
            onResolve,
            onReject
        })
        this.#loop()
    }


    #giveTask = () => {
        this.#tasks.sort((a, b) => a.priority - b.priority);
        return this.#tasks.shift();
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
                taskObject.onResolve()
            })
            .catch((e)=>{
                console.log(`Error: ${e}`)
                taskObject.onReject()
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
        return true
    }

    #loop = () => {

        if(this.#status ===this.#PAUSED){
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
    const queue = new Queue(3);
    /*
    Прокидую в очередь Promise, Timeout, Request, Обычную функцию
     */
    for(let i = 1; i<=100; i++){
        let task
        if(i%2===0){
            task = createTaskPromise(i)
            queue.add(task,
                i,
                () => { console.log(`createTaskPromise Task ${i} is resolve`) },
                () => { console.log(`createTaskPromise Task ${i} is reject`) }
            )
        } else {
            task = createTaskSync(i)
            queue.add(task,
                i*10,
                () => { console.log(`createTaskSync Task ${i} is resolve`) },
                () => { console.log(`createTaskSync Task ${i} is reject`) })
        }


        //queue.pause();
        //queue.run();
        //queue.stop();
    }
}

start();


