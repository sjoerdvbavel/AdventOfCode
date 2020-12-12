var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var completearray = array.map(str => str.split(''));
var w = completearray.length;
var h = completearray[0].length;
console.log(h + " " + w);
