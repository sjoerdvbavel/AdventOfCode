var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

function isNice(string) {
    //Count the unique vowels
    if (string.match(/[aeiou]/g) == null || string.match(/[aeiou]/g).length < 3) {
        return false;
    }
    //Look for double characters.
    if (string.match(/(.)\1/g) == null || string.match(/(.)\1/g).length == 0) {
        return false;
    }

    //check forbidden strings.
    for (set of ["ab", "cd", "pq", "xy"]) {
        if (string.includes(set)) {
            return false;
        }
    }
    return true;
}

let nicestrings = dataset.filter(isNice);

console.log('nice strings: ' + nicestrings.length);
console.log(nicestrings);