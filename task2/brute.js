
const allowedChars = ['q','w','e','r','t','y','Q','W','E','R','T','Y'];

const myPassword = 'Qer' // пароль который будем подбирать

const lengthPassword = 3; // максимальная длина пароля

const lengthAllowedChars = allowedChars.length;
function createMask(length = 1) {
    const mask=[]

    for (let i = 0; i<length; i++){
        mask.push(0)
    }

    return mask
}

function generatePassword(indexes) {
    if (!Array.isArray(indexes)) {
        throw new Error('Input must be an array');
    }

    let password = ''

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

    let carry = 1;

    for (let i = indexes.length - 1; i >= 0; i--) {
        indexes[i] += carry;
        carry = Math.floor(indexes[i] / lengthAllowedChars);
        indexes[i] %= lengthAllowedChars;
    }

    while (carry > 0) {
        indexes.unshift(carry % lengthAllowedChars);
        carry = Math.floor(carry / lengthAllowedChars);
    }

    return indexes;
}

function canIncrementIndexes(indexes) {
    if (!Array.isArray(indexes)) {
        throw new Error('Input must be an array');
    }

    const differenceIndexArray=[];
    let count=0

    /*
    Проверяю находится ли маска в своем максимальном значении.
    Вычитаю единицу так как в массиве отчет идет с 0, а не 1
     */

    for(let i = 0; i < indexes.length; i++){
        differenceIndexArray.push(lengthAllowedChars - 1 - indexes[i])
    }

    /*
    Подсчет возможных итераций с каждого разряда матрицы
     */

    for(let i = 0; i < differenceIndexArray.length; i++){
        count = count+differenceIndexArray[i] //
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

console.log(brute(lengthPassword))
