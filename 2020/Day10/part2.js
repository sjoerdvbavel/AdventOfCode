var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var numbers = array.map(str => parseInt(str, 10)).sort(function(a, b) {
    return a - b;
  });
const goal = numbers[numbers.length-1];

function HowManyWays(startingValue){
    if(startingValue == goal){
        return 1;
    }
    var available = numbers.filter(n => n > startingValue && n <= startingValue + 3);
    var counter = 0;

    for(adapter of available){
        counter += HowManyWays(adapter, numbers);
    }
    return counter;
}


console.log("This many ways: " + HowManyWays(0));