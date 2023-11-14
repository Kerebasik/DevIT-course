class StorageService{
    #storage
    constructor(storage) {
        this.#storage = storage
    }

    setItem(key, value){
        this.#storage.setItem(key, value)
    }

    getItem(key){
        return this.#storage.getItem(key)
    }

    removeItem(key){
        this.#storage.removeItem(key)
    }
}

const LocalStorageService = new StorageService(localStorage)

export {LocalStorageService}