var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'testdata.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

DetermineResult = function(Instructionset){
    var position = 0;
    var accumulator = 0;
    while(true){
        var newposition = position;
        if(position > Instructionset.length){
            return {outcome: 'finished', accumulator:accumulator};
        }
        var instruction = Instructionset[position];
        var operation = instruction.split(' ')[0];
        var argument = Number(instruction.split(' ')[1]);

        if(operation == 'acc' ){
            accumulator += argument;
            newposition++;
        } else if(operation == 'jmp' ){
            newposition += argument;
        } else if(operation == 'nop' ){
            newposition++;
        } else if(operation == 'AlreadyVisited' ){    
            return {outcome: 'looped', accumulator:accumulator};
        }
        Instructionset[position] = "AlreadyVisited 1"
        console.log(instruction)
        position = newposition;
    }
}

console.log("Final accumulator: " + DetermineResult(array.slice()).accumulator);
