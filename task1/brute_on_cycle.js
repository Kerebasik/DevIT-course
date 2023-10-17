
const allowedChars = ['q','w','e','r','t','y','u','i','o','p','Q','W','E','R','T','Y','U','I','O','P'];

const myPassword = 'YrwRW' // пароль который будем подбирать

const lengthPassword = 7 // максимальная длина пароля

const lengthAllowedChars = allowedChars.length
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
    for(let i = 0; i < indexes.length; i++){
        differenceIndexArray.push(lengthAllowedChars - 1 - indexes[i])
    }

    for(let i = 0; i < differenceIndexArray.length; i++){
        count= count+differenceIndexArray[i]
    }

    return count > 0;
}

function brute(endLength = 5) {
    let indexes = createMask();
    let password = generatePassword(indexes);

    for(let i = 1; i <= endLength; i++){
        indexes = createMask(i)
        while (true){
            password = generatePassword(indexes)
            if(login(password)){
                return `Password is found: ${generatePassword(indexes)}`
            }
            if(!canIncrementIndexes(indexes)){
                break;
            } else {
                indexes = incrementIndexes(indexes)
            }
        }
    }
}

console.log(brute(lengthPassword))
