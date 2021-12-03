var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n")

let position = 0;
let depth = 0;
let aim = 0;
for(command of array){
    commandsplit = command.split(' ');
    let direction = commandsplit[0];
    let distance = parseInt(commandsplit[1], 10);
    if(direction == 'forward'){
        position += distance;
        depth += aim*distance;
    } else if(direction == 'down'){
        aim = aim + distance;
    } else if(direction == 'up'){
        aim = aim - distance;
    }
}
console.log('Position ' + position + ' Depth ' + depth);
console.log('Position times depth is ' + position * depth);