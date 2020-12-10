var fs = require('fs');
var path = require('path');
const { Console } = require('console');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n").map(x=>+x);

// var value = 127;
var value = 88311122;

var rangestart = 0;
var rangeend = 1;

function arragsum(array){
    return array.reduce(function(a, b){return a + b;}, 0);
}

for(var i = 0; i < array.length; i++){
    var rangestart = i;
    var rangeend = i+1;
    var range = array.slice(rangestart, rangeend);
    var asum = arragsum(range);
    
    while(asum < value){
        rangeend++;
        var range = array.slice(rangestart, rangeend);
        var asum = arragsum(range);
        if(asum == value){
            var sortedrange = range.sort();
            console.log("Found range!");
            console.log(sortedrange);
            console.log(sortedrange[0] + sortedrange[sortedrange.length-1]);
            break;
        }
    }
}