var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

for(a of array){
    chars = a.split('');
    floor = 0;
    for(char of chars){
        if(char == '('){
            floor++;
        } else if(char == ')'){
            floor = floor-1;
        }
    }
    console.log(a + ' floor: ' + floor);
}