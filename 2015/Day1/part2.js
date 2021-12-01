var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

for(a of array){
    chars = a.split('');
    floor = 0;
    for(let i = 1; i <= chars.length;i++){
        let char = chars[i-1];
        if(char == '('){
            floor++;
        } else if(char == ')'){
            floor = floor-1;
        }
        if(floor == -1){
            console.log(a + ' position: ' + i);
            break;
        }
    }

}