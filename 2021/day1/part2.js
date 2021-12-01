var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'testdata.txt');
var depths = fs.readFileSync(filePath).toString().split("\r\n").map(x=>parseInt(x));

let counter = 0;
const n = 3; //amount of numbers to aggregate

for(let i = 0; i < depths.length-n;i++){
    let oldrange = depths.slice(i, i+n);
    let newrange = depths.slice(i+1, i+1+n);
    let oldsum = oldrange.reduce((a, b) => a + b, 0);
    let newsum = newrange.reduce((a, b) => a + b, 0);

    if(newsum > oldsum){
        counter++;
    }
}
console.log('Times increased: ' + counter);
