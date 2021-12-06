var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

var unparsedrules = dataSet[0].split("\r\n");
parsedrules =  new Map();
for(unparsedrule of unparsedrules){
    let a= unparsedrule.split(': ');
    parsedrules.add(a[0], a[1]);
}
var messages = dataSet[1].split("\r\n");

