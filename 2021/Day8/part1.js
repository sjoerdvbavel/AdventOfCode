var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

//make a long list of just words
var words = []
for (set of dataset) {
        words = words.concat(set.split(' | ')[1].split(' ').filter(x => x != '|'));
}

console.log(words);

let wordlenghts = words.map(x => x.length);

let length1 = wordlenghts.filter(x => x == 2).length;
let length4 = wordlenghts.filter(x => x == 4).length;
let length7 = wordlenghts.filter(x => x == 3).length;
let length8 = wordlenghts.filter(x => x == 7).length;

console.log(`1length: ${length1}, 4length: ${length4}, 7length: ${length7}, 8length: ${length8}, sum: ${(length1 + length4 + length7 + length8)}`);