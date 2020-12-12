var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var xloc = 0;
var yloc = 0;
var direction = 0; //east = 0, follow clockwise

var xwaypoint = 10;
var ywaypoint = 1;


for(var i = 0; i < array.length; i++){
    let instruction = array[i];
    let directionstep = instruction.charAt(0);
    let instructionvalue = parseInt(instruction.substring(1, instruction.length), 10);
    if(directionstep == "E"){
        xwaypoint += instructionvalue;
    } else if(directionstep == "S"){
        ywaypoint -= instructionvalue;
    } else if(directionstep == "W"){
        xwaypoint -= instructionvalue;
    } else if(directionstep == "N"){
        ywaypoint += instructionvalue;
    }else if(directionstep == "L"){
        let tempx = xwaypoint;
        let tempy = ywaypoint; 
        if(instructionvalue == 90){
            xwaypoint = -tempy;
            ywaypoint = tempx;
        } else if(instructionvalue == 180){
            xwaypoint = -tempx;
            ywaypoint = -tempy;
        } else if(instructionvalue == 270){
            xwaypoint = tempy;
            ywaypoint = -tempx;
        }
    }else if(directionstep == "R"){
        let tempx = xwaypoint;
        let tempy = ywaypoint; 
        if(instructionvalue == 90){
            xwaypoint = tempy;
            ywaypoint = -tempx;
        } else if(instructionvalue == 180){
            xwaypoint = -tempx;
            ywaypoint = -tempy;
        } else if(instructionvalue == 270){
            xwaypoint = -tempy;
            ywaypoint = tempx;
        } else{
            console.log("boem "+ instruction);
        }
    }else if(directionstep == "F"){
        xloc += xwaypoint*instructionvalue;
        yloc += ywaypoint*instructionvalue;
    }
    console.log(instruction);
    console.log("location " + xloc +" "+ yloc + " waypoint: " + xwaypoint + " " + ywaypoint);
}

function getManhattandistance(a_x, a_y, b_x, b_y){
    return Math.abs(a_x - b_x) + Math.abs(a_y - b_y);
}


console.log("Final location " + xloc +" "+ yloc);
console.log("Manhattan distance " + getManhattandistance(0,0,xloc, yloc));