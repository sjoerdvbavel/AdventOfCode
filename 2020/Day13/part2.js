var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var buslines = array[1].split(',').map(n => n == 'x' ? -1 : parseInt(n, 10));

console.log(buslines);

var timeslots = [];

var firstbusline = buslines[0];
var largecutoff = 100000000;

//Returns the negative principal argument of a modulo m.
function getNegativeRemainder(a, m) {
    let rem = a % m;
    return rem <= 0 ? 0 : rem-m;
}

//Check whether the timestamp satisfies the buslines.
function CheckTimeStamp(timestamp, printOutput) {
    if (printOutput) {
        console.log("Trying " + timestamp);
    }

    let isValidTimestamp = true;
    for (var j = 0; j < buslines.length; j++) {
        if (buslines[j] != -1 && (getNegativeRemainder(timestamp, buslines[j]) != -(j%buslines[j]))) {
            isValidTimestamp = false;
            if (printOutput) {
                console.log(buslines[j] + " has remainder " + getNegativeRemainder(timestamp, buslines[j]) + " instead of " + -j)
            }
            break;
        }
    }
    return isValidTimestamp;
}

// Make an array from timestamp to timestamp + a busline
for (var i = firstbusline; true; i += firstbusline) {
    let isValid = false;
    if (i % (firstbusline * 10 ** 15) != 0) {
        isValid = CheckTimeStamp(i, false);
    } else {
        isValid = CheckTimeStamp(i, true);
    }

    if (isValid) {
        console.log("Found a line at: " + i);
        break;
    }
}

console.log(CheckTimeStamp(1118684865113056  , true));
