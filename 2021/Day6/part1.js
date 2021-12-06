var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'testdata.txt');
var dataset = fs.readFileSync(filePath).toString().split(",").map(x => parseInt(x, 10));

function createFish(initialnumber) {
    return { initialAge: initialnumber, currentAge: initialnumber };
}

var fishes = []
for (number of dataset) {
    fishes.push(createFish(number));
}
console.log('Fishes at start: ' + fishes.length);
function ageFish(fish, fishlist) {
    if (fish.currentAge == 0) {
        fish.currentAge = 6;
        fishlist.push(createFish(8));
    } else {
        fish.currentAge--;
    }
}
console.log('Initial state: ' + fishes.map(x => x.currentAge).join(','));
for (let date = 0; date < 256; date++) {
    for (fish of fishes.slice()) {
        ageFish(fish, fishes);
    }
    if (date <= 5) {
        console.log('After ' + (date + 1) + ' day:   ' + fishes.map(x => x.currentAge).join(','));
    }
}
console.log('fishes at day 80: ' + fishes.length);