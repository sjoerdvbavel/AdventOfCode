var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

DetermineResult = function(Instructionset){
    var position = 0;
    var accumulator = 0;
    while(true){
        var newposition = position;
        if(position >= Instructionset.length){
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
        position = newposition;
    }
}

function TryNewInstruction(newinstruction, index){
    var copyarray = array.slice();
    copyarray[index] = newinstruction;

    return DetermineResult(copyarray);
}

for(index in array){
    instruction = array[index];
    if (instruction.includes('nop')){
        var newinstruction = instruction.replace('nop', 'jmp');
        console.log(index + " " + newinstruction)
        var obj = TryNewInstruction(newinstruction, index);
        if (obj.outcome == 'finished') {
            break;
        }
    } else if (instruction.includes('jmp')){
        var newinstruction = instruction.replace('jmp', 'nop');
        console.log(index + " " + newinstruction)
        var obj = TryNewInstruction(newinstruction, index);
        if (obj.outcome == 'finished') {
            break;
        }
    }

}


console.log("Outcome: " + obj.outcome + " Final accumulator: " + obj.accumulator);
