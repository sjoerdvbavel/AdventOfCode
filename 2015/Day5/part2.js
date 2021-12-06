var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

function isNice(string) {
    //Look for matching characters with one char in between, e.g. odo.
    let odo = string.match(/(.)\w\1/g)
    if (odo == null || odo < 3) {
        return false;
    }
    //Look for double characters.
    let doublematch = string.match(/(.{2})\w*\1/g);
    if (doublematch == null || doublematch.length == 0) {
        return false;
    }
    return true;
}

let nicestrings = dataset.filter(isNice);

console.log('nice strings: ' + nicestrings.length);
console.log(nicestrings);