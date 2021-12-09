var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split(",").map(x => parseInt(x, 10));

function calculateFuel(array, integer){
    return array.map(x=>Math.abs(x-integer)).reduce((a,b)=>a+b);
}

let mindataset = Math.min(...dataset);
let maxdataset = Math.max(...dataset);
let minfuel = calculateFuel(dataset, mindataset);
let mini = 0;
for(let i = mindataset; i<=maxdataset;i++){
    let fuel = calculateFuel(dataset, i);
    if(fuel < minfuel){
        minfuel = fuel;
        mini = i;
    }
}
console.log(`minfuel is ${minfuel} at ${mini}`);