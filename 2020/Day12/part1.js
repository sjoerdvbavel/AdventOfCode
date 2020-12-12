var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var xloc = 0;
var yloc = 0;
var direction = 0; //east = 0, follow clockwise

for(var i = 0; i < array.length; i++){
    let instruction = array[i];
    let directionstep = instruction.charAt(0);
    let instructionvalue = parseInt(instruction.substring(1, instruction.length), 10);
    if(directionstep == "E"){
        xloc += instructionvalue;
    } else if(directionstep == "S"){
        yloc -= instructionvalue;
    } else if(directionstep == "W"){
        xloc -= instructionvalue;
    } else if(directionstep == "N"){
        yloc += instructionvalue;
    }else if(directionstep == "L"){
        direction = (direction - instructionvalue + 360) % 360;
    }else if(directionstep == "R"){
        direction = (direction + instructionvalue + 360) % 360;
    }else if(directionstep == "F"){
        if(direction == 0){
            xloc += instructionvalue;
        } else if(direction == 90){
            yloc -= instructionvalue;
        } else if(direction == 180){
            xloc -= instructionvalue;
        } else if(direction == 270){
            yloc += instructionvalue;
        }
    }
    // console.log(instruction);
    // console.log("location " + xloc +" "+ yloc + " dir " + direction);
}

function getManhattandistance(a_x, a_y, b_x, b_y){
    return Math.abs(a_x - b_x) + Math.abs(a_y - b_y);
}


console.log("Final location " + xloc +" "+ yloc);
console.log("Manhattan distance " + getManhattandistance(0,0,xloc, yloc));