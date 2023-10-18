
const allowedChars = ['q','w','e','r','t','y','Q','W','E','R','T','Y'];

const myPassword = 'Qer' // пароль который будем подбирать

const lengthAllowedChars = allowedChars.length;

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
    return password === myPassword
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

function brute(endLength = 3, indexes) {
    if(!indexes){
        indexes = createMask()
    }

    const password = generatePassword(indexes)

    if(login(password)){
        return `Password is found: ${password}`
    }

    /*
        Проверяю является ли матрица в максимальном значении которое может быть.
        Если да, то генерирую генерирую новую маску длиной придыдущая + 1
        Если нет, то просто инкрементрую на +1
     */

    if(!canIncrementIndexes(indexes)){
        indexes = createMask(indexes.length+1)
    } else {
        indexes = incrementIndexes(indexes)
    }

    if(indexes.length > endLength){
        return 'Password not found'
    }

    return brute(endLength, indexes)
}

console.log(brute())
