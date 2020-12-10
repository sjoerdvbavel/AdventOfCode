var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var numbers = array.map(str => parseInt(str, 10)).sort(function (a, b) {
    return a - b;
});

function getAvailable(startingValue) {
    return numbers.filter(n => n > startingValue && n <= startingValue + 3);
}

//Initialize an object to track the counts.
obj = {}
for (number of numbers) {
    obj[number] = 0
}
//Set the initial values
for (value of getAvailable(0)) {
    obj[value]++;
}
//Dynamic programming baby 8)
for (var i = 0; i < numbers.length; i++) {
    var currentlyAt = numbers[i];
    var reachable = getAvailable(currentlyAt);
    for (value of getAvailable(currentlyAt)) {
        obj[value] += obj[currentlyAt];
    }
}

const goal = numbers[numbers.length - 1]; //numbers is sorted
console.log("Ways to goal: " + obj[goal]);