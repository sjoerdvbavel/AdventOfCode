var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

//make a long list of just words
var words = []
var outputs = []
for (set of dataset) {
        outputs = outputs.concat(set.split(' | ')[1].split(' '));
        words = words.concat(set.split(' | ')[1].split(' ').filter(x => x != '|'));
}

console.log(words);

let wordlenghts = words.map(x => x.length);

let length1 = wordlenghts.filter(x => x == 2).length;
let length4 = wordlenghts.filter(x => x == 4).length;
let length7 = wordlenghts.filter(x => x == 3).length;
let length8 = wordlenghts.filter(x => x == 7).length;

console.log(`1length: ${length1}, 4length: ${length4}, 7length: ${length7}, 8length: ${length8}, sum: ${(length1 + length4 + length7 + length8)}`);
console.log(outputs);

function findStringsofLength(array, length) {
        return array.filter(x => x.length == length);
}

//Returns all characters in string1 but not in string2
function getDifferenceBetweenStrings(string1, string2) {
        let returnlist = [];
        for (char of string1) {
                if (!string2.includes(char)) {
                        returnlist.push(char);
                }
        }
        return returnlist.join('');
}
function stringmatches(string1, string2) {
        if (string1.length != string2.length) {
                return false;
        }
        for (char of string1) {
                if (!string2.includes(char)) {
                        return false;
                }
        }
        return true;
}

function parseStringWithSolution(strings, solutionmap) {
        let numbers = [];
        for (string of strings) {
                for (let i = 0; i <= 9; i++) {
                        if (stringmatches(string, solutionmap.get(i.toString()))) {
                                numbers.push(i.toString());
                        }
                }
        }
        return parseInt(numbers.join(''), 10);
}

function figureOutOutput(string) {
        let parts = string.split(' | ');
        let input = parts[0].split(' ');
        let output = parts[1].split(' ');
        let numbers = input.concat(output);

        let solution = { a: '', b: '', c: '', d: '', e: '', f: '', g: '' }
        let characterssolution = new Map();
        //Part a
        // We get all letters we can get by length.
        characterssolution.set('1', findStringsofLength(input, 2)[0]);
        characterssolution.set('7', findStringsofLength(input, 3)[0]);
        characterssolution.set('4', findStringsofLength(input, 4)[0]);
        characterssolution.set('8', findStringsofLength(input, 7)[0]);

        //Part b
        //Get all strings of length 6 (0,6, 9)
        let partb = findStringsofLength(input, 6);

        //We use:
        //(x/y = remove all letters in y from x)
        // length(0/4) = 3,length(6/4) = 3,length(9/4) = 2
        // length(0/7) = 3,length(6/7) = 4,length(9/7) = 4

        for (let partbstring of partb) {
                if (getDifferenceBetweenStrings(partbstring, characterssolution.get('4')).length == 2) {
                        characterssolution.set('9', partbstring);
                } else if (getDifferenceBetweenStrings(partbstring, characterssolution.get('7')).length == 3) {
                        characterssolution.set('0', partbstring);
                } else {
                        characterssolution.set('6', partbstring);
                }
        }

        //Part c
        // All strings of length 5 are left.

        let partc = findStringsofLength(input, 5);
        //We use:
        // length(3/1) == 3,length(2/1) == 4,length(5/1) == 4
        // length(2/4) == 2,length(3/4) == 2,length(5/4) == 2
        for (let partcstring of partc) {
                if (getDifferenceBetweenStrings(partcstring, characterssolution.get('1')).length == 3) {
                        characterssolution.set('3', partcstring);
                } else if (getDifferenceBetweenStrings(partcstring, characterssolution.get('4')).length == 3) {
                        characterssolution.set('2', partcstring);
                } else {
                        characterssolution.set('5', partcstring);
                }
        }
        console.log(characterssolution.values());

        return parseStringWithSolution(output, characterssolution);
}
let results = dataset.map(figureOutOutput);
console.log(results.reduce((a, b) => a + b));