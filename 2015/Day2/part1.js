var fs = require('fs');
const { SourceMap } = require('module');
var path = require('path');
const { mainModule } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

let totalsum = 0
for(a of array){
    let values = a.split('x').map(x=>parseInt(x, 10));
    let sides = [];
    let sum = 0;

    for(let i = 0; i < values.length; i++){
        for(let j = 0; j < values.length; j++){
            if(i > j){
                let side = values[i]*values[j];
                sides.push(side);
                sum += 2*side;
            }
        }
    }
    //add the slack, the area of the smallest side.
    let smallestside = Math.min(...sides);
    sum += smallestside;
    console.log('Area required: ' + sum);
    totalsum += sum;
}
console.log('Total area required: ' + totalsum);
