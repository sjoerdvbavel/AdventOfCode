var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'testdata.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var numbers = dataset.map(x => JSON.parse(x));

function addNumbers(array1, array2) {
    let sum = [array1, array2];
    return reduceNumber(sum);
}
//Return the leftmost pair 4 levels deep.
function _getFirstPair4Deep(array) {
    for (let index1 in array) {
        let level1
        if (typeof level1 == 'array') {
            for (let level2 of array) {
                if (typeof level2 == 'array') {
                    for (let level3 of array) {
                        if (typeof level3 == 'array') {
                            for (let level4 of array) {
                                if (typeof level4 == 'array') {
                                    return [JSON.stringify(array).find(JSON.stringify(level4), level4)];
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return null;
}

function _getFirstNumberOver10(array) {
    let arraystring = JSON.stringify(array);
    let numbersover10 = arraystring.match(/(\d+)/g).filter(x => x >= 10);
    if(numbersover10.length > 0){
        return arraystring.find(numbersover10[0]);
    }
    return -1;
}

function reduceNumber(array) {
    while(true){
        a = explodeNumber(array, 0);
        if(!a.exploded){
            b = 
        }
    }
}

function explodeNumber(array, depth) {
    if(depth >= 4){
        return [true, array, array[0], array[1]];
    }

    left = explodeNumber({array: object.array[0], })    
    let returnobject = {array: object.array, }
    let indexlist = _getFirstPair4Deep(array);
    if(indexlist != null){//we found a pair 4 lvls deep
        leftnumber = _getLeftnumber(indexlist);

    }
    let leftnumber = 
}

function splitNumber(array) {

}

function calculateMagnitute(number) {
    if (typeof number == 'number') {
        return number;
    } else {
        let magnitude1 = calculateMagnitute(number[0]);
        let magnitude2 = calculateMagnitute(number[1]);
        return 3 * magnitude1 + 2 * magnitude2;
    }
}

//test magnitude
// console.log(calculateMagnitute([[1, 2], [[3, 4], 5]]));
// console.log(calculateMagnitute([[[[0,7],4],[[7,8],[6,0]]],[8,1]]));
// console.log(calculateMagnitute([[[[1,1],[2,2]],[3,3]],[4,4]]));
// console.log(calculateMagnitute([[[[3,0],[5,3]],[4,4]],[5,5]]));

//Test find first 4 lvls:
console.log(_getFirstPair4Deep([[[[[9,8],1],2],3],4]));