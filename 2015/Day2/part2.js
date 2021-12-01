var fs = require('fs');
const { SourceMap } = require('module');
var path = require('path');
const { mainModule } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

let totalsum = 0
for(a of array){
    let values = a.split('x').map(x=>parseInt(x, 10));
    let sum = 0;

    //sort the values
    sidessorted = values.sort(function(a, b) {return a - b;});

    //
    bow = sidessorted.reduce((a,b)=>a*b);
    sum = 2*sidessorted[0] + 2*sidessorted[1] + bow;

    console.log('Ribbon required: ' + sum);
    totalsum += sum;
}
console.log('Total ribbon required: ' + totalsum);
