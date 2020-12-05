var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

function ConvertDirectly(string){
    var replacedstring = string.replaceAll('B', '1').replaceAll('F', '0').replaceAll('R', '1').replaceAll('L', '0');
    return parseInt(replacedstring, 2);
}

var idlist = array.map(str => ConvertDirectly(str));
var max_of_array = Math.max.apply(Math, idlist);

//console.log(idlist.sort());
console.log("Max seatID: " + max_of_array);