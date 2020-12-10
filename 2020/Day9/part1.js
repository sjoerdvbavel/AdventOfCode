var fs = require('fs');
var path = require('path');
const { Console } = require('console');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n").map(x=>+x);

var preamble = 25;
var position = preamble;

for(var i = position+1; i < array.length; i++){
    var set = array.slice(i - preamble-1, i);
    var value = array[i];
    //console.log("exploring: "+ value);
    //console.log(set);
    var ValidSum = false;
    while(set.length){
        var item = set.shift();
        for(item2 of set){
            //console.log("trying " + item + " + " + item2);
            if(item + item2 == value){
                ValidSum = true;
                //console.log("found");
                break;
            }
            if(ValidSum){
                break;
            }
        }
    }
    if(!ValidSum){
        console.log("No sum found for value: " + value);
        break;
    }
}