var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split(",");

var fishes = {
    "0": 0,
    "1": 0,
    "2": 0,
    "3": 0,
    "4": 0,
    "5": 0,
    "6": 0,
    "7": 0,
    "8": 0
}

for (initialfish of dataset) {
    fishes[initialfish]++;
}
console.log('Fishes at start: ' + JSON.stringify(fishes));
function ageFish(fishobject) {
    returnobject = {
        "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0
    }
    returnobject["6"] = fishobject["0"];
    returnobject["8"] = fishobject["0"];
    for (i = 0; i < 8; i++) {
        returnobject[i.toString()] += fishobject[(i + 1).toString()];
    }
    return returnobject;
}

function totalFish(fishobject) {
    return Object.values(fishobject).reduce((a, b) => a + b);
}

for (let date = 0; date < 256; date++) {
    fishes = ageFish(fishes);
    if (date <= 5) {
        console.log('After ' + (date + 1) + ' day:   ' + JSON.stringify(fishes));
    }
}
console.log('fishes at day 256: ' + totalFish(fishes));