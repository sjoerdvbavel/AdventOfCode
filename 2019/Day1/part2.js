//Load data
var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");


// Define functions
function CalculateFuelModule(n) {
    return Math.max(0, Math.floor(n / 3) - 2);
}

function CalculateTotalFuelModule(ModuleWeight) {
    var fuelsum = 0;
    var remainingload = CalculateFuelModule(ModuleWeight);

    while (remainingload > 0) {
        fuelsum += remainingload;
        remainingload = CalculateFuelModule(remainingload);
    }
    return fuelsum;
}


//Execute
var fuel = array.map(n => CalculateTotalFuelModule(n));

var fuelsum = fuel.reduce(function (a, b) {
    return a + b;
}, 0);

console.log("Sum of fuel: " + fuelsum);