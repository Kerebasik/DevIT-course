class Queue {
    #maxRunningThreads;
    #tasks;
    #status;
    #runningThreads;
    #priorityTasks;
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

    add = (task, priority) => {
        /*
        Пушу объект с полями:
            task - задача которую нужно будет выполнить
            priority - её приоритет перед остальными задачами
         */
        if(priority >100){
            priority=100
        }
        this.#tasks.push({
            task,
            priority
        })
        this.#loop()
    }


    #giveTask = () => {
        this.#tasks.sort((a, b) => a.priority - b.priority);
        return this.#tasks.shift();
    }

    #loop = () => {
        /*
        В случае если статус stopped то,
        очищаю массив с задачами,
        обнуляю число задачь которые выполняются,
        заканчиваю выполнения метода loop
        */

        if (this.#status === this.#STOPPED) {
            this.#tasks = [];
            // this.#runningThreads = 0;
            return;
        }

        /*
            Очередь работает при статусе running
            При статусе paused выполняются те функции которые остались, а потом остается в ожидании run() или add()

            loop() работает если:
                статус имеет значение running или paused(доделывает задачи которые уже в очереди)
                счетчик выполняемых задачь меньше максимума выполнения задачь
                список обычных задач или список приоритетных задачь не пустой
        */

        if (
            ( this.#status === this.#RUNNING || this.#status === this.#PAUSED ) &&
            this.#runningThreads < this.#maxRunningThreads &&
            (this.#tasks.length > 0 || this.#priorityTasks > 0)
        ) {

            /*
            Беру задание из очереди заданий
            Инкрементирую счетчик задачь которые выполняются
             */

            const task = this.#giveTask().task;

            this.#runningThreads++;

            /*
            Делаю промис для выполнения внутри него задания которое взял из очереди
            В блоке catch обрабатываю ошибку которая может произойти внутри промиса
            В блоке finally деинкрементирую счетчик задачь и проверяю статус running для продолжения работы очереди
             */

            new Promise(async (resolve, reject) => {
                try {
                    const data = await task()
                    resolve(data)
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



function createTaskPromise(id) {
    return () =>{
        return new Promise((resolve) => {
            console.log(`Promise Task id ${id}`)
            resolve()
        });
    }
}

function createTaskTimeout(id){
    return ()=> {
        return setTimeout(()=>{
            console.log(`Timeout Task id ${id}`)
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
    const queue = new Queue(3);
    /*
    Прокидую в очередь Promise, Timeout, Request, Обычную функцию
     */
    for(let i = 1; i<=50; i++){
        let task
        if(i%2===0){
            task = createTaskPromise(i)
            queue.add(task, i)
        } else {
            task = createTaskSync(i)
            queue.add(task, i*2)
        }


        //queue.pause();
        //queue.run();
        //queue.stop();
    }
}

start();


