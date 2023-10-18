
const allowedChars = ['q','w','e','r','t','y','u','i','o','p','Q','W','E','R','T','Y','U','I','O','P'];

const myPassword = 'tyQWeE' // пароль который будем подбирать

const lengthAllowedChars = allowedChars.length

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

function brute(endLength = 5) {
    let indexes;
    let password;

    for(let i = 1; i <= endLength; i++){
        indexes = createMask(i)
        while (canIncrementIndexes(indexes)){
            password = generatePassword(indexes)
            if(login(password)){
                return `Password is found: ${generatePassword(indexes)}`
            }
            indexes = incrementIndexes(indexes)
        }
    }
}

console.log(brute(7))
