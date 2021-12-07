var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString();

var instructions = dataset.split('');
var northsouth = 0;
var westeast = 0;
var houses = new Set();
houses.add('(' + northsouth + ', ' + westeast + ')');

function ParseInstruction(instruction){
    if(instruction == '>'){
        westeast++;
        houses.add('(' + northsouth + ', ' + westeast + ')');
    } else if(instruction == 'v'){
        northsouth++;
        houses.add('(' + northsouth + ', ' + westeast + ')'); 
    } else if(instruction == '<'){
        westeast--;
        houses.add('(' + northsouth + ', ' + westeast + ')');
    } else if(instruction == '^'){
        northsouth--;
        houses.add('(' + northsouth + ', ' + westeast + ')');
    }
}
for(var i = 0; i < instructions.length; i += 2) {  // take every odd element
    ParseInstruction(instructions[i]);
}

var northsouth = 0;
var westeast = 0;
for(var i = 1; i < instructions.length; i += 2) {  // take every even
    ParseInstruction(instructions[i]);
}


console.log('Houses visited: ' + houses.size);