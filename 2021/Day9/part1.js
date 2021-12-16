const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var numbers = dataset.map(x => x.split('').map(y => parseInt(y, 10)));

var ylim = numbers.length;
var xlim = numbers[0].length;

function getValue(yval, xval) {
    if (xval >= 0 && yval >= 0 && xval < xlim && yval < ylim) {
        return numbers[yval][xval];
    } else {
        return 10;
    }

}

//return the risk of a set of coordinates, return -1 if it's not a low point.
function getRisk(xcor, ycor) {
    let spotvalue = numbers[ycor][xcor];
    let result = 0;
    for (dir of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        let neighbourvalue = getValue(ycor + dir[0], xcor + dir[1]);
        if (neighbourvalue <= spotvalue) return -1;
    }
    return spotvalue+1;
}

let totalrisk = 0;
for (let y = 0; y < ylim; y++) {
    for (let x = 0; x < xlim; x++) {
        let riskval = getRisk(x, y);
        if (riskval != -1) {
            totalrisk += riskval;
            console.log(`At ${x},${y} a risk of ${riskval} was found.`);
        }
    }

}

console.log(`Total risk: ${totalrisk}`);
// console.log(getRisk(2,9));