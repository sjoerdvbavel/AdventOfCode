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

var sortedlist = idlist.sort(function(a, b){return a-b});

for(var i =0; i < sortedlist.length; i++){
    if((sortedlist[i] + 1) != sortedlist[i+1]){
        console.log("Found! "+sortedlist[i] +" "+ sortedlist[i+1]);
    }
}