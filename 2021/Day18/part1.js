var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'testdata.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var numbers = dataset.map(x => JSON.parse(x));

function addNumbers(array1, array2) {
    let sum = [array1, array2];
    // console.log(`After addition:  ${JSON.stringify(sum)}`);
    return reduceNumber(sum);
}

function reduceNumber(array) {
    //Loop until we return something.
    while (true) {
        let exploderesult = explodeNumber(array, 0);
        if (exploderesult[0]) {
            array = exploderesult[1];
            // console.log(`After explosion:  ${JSON.stringify(array)}`);
        } else {
            let splitresult = splitNumber(array);
            if (splitresult[0]) {
                array = splitresult[1];
                // console.log(`After split:  ${JSON.stringify(array)}`);
            } else {
                //If the result doesn't explode or split it's reduced.
                return array;
            }
        }
    }
}

//Add number to the leftmost number of array
function addLeft(array, number) {
    if (!Array.isArray(array)) {
        return array + number;
    }
    return [addLeft(array[0], number), array[1]];
}

//Add number to the rightmost number of array
function addRight(array, number) {
    if (!Array.isArray(array)) {
        return array + number;
    }
    return [array[0], addRight(array[1], number)];
}

//Function returns:
//0: boolean whether the number is exploded
//1: the resulting array
//2: An array with leftvalue and rightvalue to be added, [add2left, add2right].
function explodeNumber(array, depth) {
    if (!Array.isArray(array)) {
        return [false, array, [0, 0]]
    }
    if (depth >= 4) {//If we are 4 layers deep we alreay know the array consists of 2 numbers.
        return [true, 0, array];
    }

    let leftresult = explodeNumber(array[0], depth + 1);
    if (leftresult[0]) {
        //If the exploderesult is found on the left:
        //- The rightvalue is added to the rightside.
        //- The leftvalue is propogated above.
        let rightside = addLeft(array[1], leftresult[2][1]);
        return [true, [leftresult[1], rightside], [leftresult[2][0], 0]];
    }
    let rightresult = explodeNumber(array[1], depth + 1);
    if (rightresult[0]) {
        //If the exploderesult is found on the right:
        //- The leftvalue is added to the leftside.
        //- The rightvalue is propogated above.
        let leftside = addRight(array[0], rightresult[2][0]);
        return [true, [leftside, rightresult[1]], [0, rightresult[2][1]]];
    }
    return [false, array, [0, 0]];
}
//Function returns:
//0: boolean whether the number is split.
//1: the resulting array
function splitNumber(array) {
    if (!Array.isArray(array)) {
        if (array >= 10) {
            return [true, [Math.floor(array / 2), Math.ceil(array / 2)]];
        }
        return [false, array];
    }
    let leftsplit = splitNumber(array[0]);
    if (leftsplit[0]) {
        return [true, [leftsplit[1], array[1]]];
    }
    let rightsplit = splitNumber(array[1]);
    if (rightsplit[0]) {
        return [true, [array[0], rightsplit[1]]];
    }
    return [false, array];
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


function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}
function unitTest1(array, stringvalue) {
    if (JSON.stringify(array[1]) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array[1])} != ${stringvalue}`);
    }
}
//test magnitude
unitTest(calculateMagnitute([[1, 2], [[3, 4], 5]]), 143);
unitTest(calculateMagnitute([[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]]), 1384);
unitTest(calculateMagnitute([[[[1, 1], [2, 2]], [3, 3]], [4, 4]]), 445);
unitTest(calculateMagnitute([[[[3, 0], [5, 3]], [4, 4]], [5, 5]]), 791);
unitTest(calculateMagnitute([[[[5, 0], [7, 4]], [5, 5]], [6, 6]]), 1137);
unitTest(calculateMagnitute([[[[8, 7], [7, 7]], [[8, 6], [7, 7]]], [[[0, 7], [6, 6]], [8, 7]]]), 3488);

//Test explodenumber
unitTest1(explodeNumber([[[[[4, 3], 4], 4], [7, [[8, 4], 9]]], [1, 1]], 0), '[[[[0,7],4],[7,[[8,4],9]]],[1,1]]');
unitTest1(explodeNumber([[[[0, 7], 4], [7, [[8, 4], 9]]], [1, 1]], 0), '[[[[0,7],4],[15,[0,13]]],[1,1]]');

// unitTest(explodeNumber(,0), '');

//Test splitnumber
unitTest1(splitNumber([[[[0, 7], 4], [15, [0, 13]]], [1, 1]]), '[[[[0,7],4],[[7,8],[0,13]]],[1,1]]');
unitTest1(splitNumber([[[[0, 7], 4], [[7, 8], [0, 13]]], [1, 1]]), '[[[[0,7],4],[[7,8],[0,[6,7]]]],[1,1]]')
// unitTest(splitNumber(), '');

//Test addnumber
unitTest(addNumbers([[[[4, 3], 4], 4], [7, [[8, 4], 9]]], [1, 1]), '[[[[0,7],4],[[7,8],[6,0]]],[8,1]]');


function AddNumberslist(numberslist){
    let sum = numberslist[0];
    for(number of numberslist.slice(1)){
        // console.log(JSON.stringify(sum));
        sum = addNumbers(sum, number);
    }
    return sum;
}
// Test AddNumberslist
unitTest(AddNumberslist([
[[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]],
[[[5,[2,8]],4],[5,[[9,9],0]]],
[6,[[[6,2],[5,6]],[[7,6],[4,7]]]],
[[[6,[0,7]],[0,9]],[4,[9,[9,0]]]],
[[[7,[6,4]],[3,[1,3]]],[[[5,5],1],9]],
[[6,[[7,3],[3,2]]],[[[3,8],[5,7]],4]],
[[[[5,4],[7,7]],8],[[8,3],8]],
[[9,3],[[9,9],[6,[4,9]]]],
[[2,[[7,7],7]],[[5,8],[[9,3],[0,2]]]],
[[[[5,2],5],[8,[3,7]]],[[5,[7,5]],[4,4]]],
]), '[[[[6,6],[7,6]],[[7,7],[7,0]]],[[[7,7],[7,7]],[[7,8],[9,9]]]]');

unitTest(AddNumberslist([
[[[0,[4,5]],[0,0]],[[[4,5],[2,6]],[9,5]]],
[7,[[[3,7],[4,3]],[[6,3],[8,8]]]],
[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]],
[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]],
[7,[5,[[3,8],[1,4]]]],
[[2,[2,2]],[8,[8,1]]],
[2,9],
[1,[[[9,3],9],[[9,0],[0,7]]]],
[[[5,[7,4]],7],1],
[[[[4,2],2],6],[8,7]]
]), '[[[[8,7],[7,7]],[[8,6],[7,7]]],[[[0,7],[6,6]],[8,7]]]');

//Final result part1:

var finalnumber = AddNumberslist(numbers);
console.log(`Final result numbers, magnitute ${calculateMagnitute(finalnumber)}, number: ${JSON.stringify(finalnumber)}`);

// Part2:

var maxmagnitude = 0;
for(number1 of numbers){
    for(number2 of numbers){
        if(number1 != number2){
            var mag = calculateMagnitute(addNumbers(number1, number2));
            if(mag > maxmagnitude){
                maxmagnitude = mag;
            }
        }
    }
}
console.log(`Max magnitude of 2 numbers = ${maxmagnitude}`);