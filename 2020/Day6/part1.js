var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n\r");

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

function countUniqChars(string){
    var charlist = string.replaceAll(/\s/g, '').split('');
    return uniq(charlist).length;
}

var counts = array.map(n => countUniqChars(n));

console.log(counts);

var sum = counts.reduce(function (a, b) {
    return a + b;
}, 0);

console.log("Total sum: " + sum);

// var idlist = array.map(str => ConvertDirectly(str));
// var max_of_array = Math.max.apply(Math, idlist);

// //console.log(idlist.sort());
// console.log("Max seatID: " + max_of_array);