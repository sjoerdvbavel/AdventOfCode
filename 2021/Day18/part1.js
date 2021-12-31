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

function reduceNumber(array) {
    while(true){
        let exploderesult = explodeNumber(array, 0);
        if(!exploderesult.exploded){
            let splitresult = splitNumber(array);
        }
    }
}

//Function returns:
//0: boolean whether the number is exploded
//1: the resulting array
//2: An array with leftvalue and rightvalue to be added, [add2left, add2right].
function explodeNumber(array, depth) {
    if(!Array.isArray(array)){
        return [false, array]
    }
    if(depth >= 4){//If we are 4 layers deep we alreay know the array consists of 2 numbers.
        return [true, 0, ...array];
    }

    let leftresult = explodeNumber(array[0], depth+1);
    if(leftresult[0]){
        let returnarrayleft = [leftresult[1],addleft(array[1], leftresult[2][1])],leftresult[2],0]
        return leftresult[2]?[true, [leftresult[1],rightresult],leftresult[2],0]:[true, [leftresult[1],rightresult]]
    }
    let rightresult = explodeNumber(array[1], depth+1);
    if(rightresult[0]){
        let rightresult = rightresult[3]?array[1] + rightresult[3]:array[1];
        return leftresult[2]?[true, [leftresult[1],rightresult],leftresult[2],0]:[true, [leftresult[1],rightresult]]
    }
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