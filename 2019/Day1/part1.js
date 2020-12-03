var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

var fuel = array.map(n => Math.floor(n/3) - 2);

var sum = fuel.reduce(function(a, b){
    return a + b;
}, 0);

console.log("Sum of fuel: " + sum);