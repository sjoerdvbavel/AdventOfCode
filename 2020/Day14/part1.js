var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
//We split the file into lines and parse the input into objects with:
//  - command, the first word
//  - textvalue, the second word not parsed to int.
//  - intvalue, the second word parsed to int.
//  - address, the number in mem[number] if the command is not 'mask'
var array = fs.readFileSync(filePath).toString().split("\r\n").map(
    function(string){let command = string.split(' = ')[0];
        return {command:command,
                textvalue:string.split(' = ')[1],
                intvalue:parseInt(string.split(' = ')[1]),
                address:(command != 'mask'?parseInt(command.match(/\d+/)[0]): undefined)
        };
    }
);
//This function applies the mask to the value.
//  We convert the value into binary, both the binary and the mask are split into characters and reversed. We walk through the characters.
function ApplyMask(value, mask){
    console.log("Apply mask " + mask + " to value "+ value);
    let maskcharlist = mask.split('').reverse();
    let valuecharlist = value.toString(2).split('').reverse();
    // console.assert(parseInt(valuecharlist.reverse().join(''),2) == value);
    // valuecharlist.reverse(); //undo the reversing done in the assertion.
    console.log(maskcharlist);
    console.log(valuecharlist);
    let combinedarray = [];
    console.assert(maskcharlist.length > valuecharlist.length);
    for(let j = 0; j < maskcharlist.length; j++){//Loop over all the characters
        if(j < valuecharlist.length){
            combinedarray.push(maskcharlist[j] != 'X'?maskcharlist[j]:valuecharlist[j]);
        } else {
            combinedarray.push(maskcharlist[j] !='X'?maskcharlist[j]:"0");
        }
    }
    console.log(combinedarray);
    return parseInt(combinedarray.reverse().join(''),2);
}

var programs = [];
var program = {};
//We loop over all the commands, every time we encounter a new 'mask' command we save the program and create a new one.
for(var i = 0; i<array.length;i++){
    let line = array[i];
    if(line.command == "mask"){
        programs.push(program);//Add the old program to the array
        program = { mask:line.textvalue};//Create a new program
    } else {
        program[line.address] = ApplyMask(line.intvalue, program.mask);
        console.log("Line " + line.address + " is now "+ ApplyMask(line.intvalue, program.mask));
    }
}
//Finish the last program.
programs.push(program);

console.log(JSON.stringify(programs));

//sum all the entries in all the programs.
var sum = 0;
for(program of programs){
    for(entry in program){
        if(entry != "mask"){
            sum += program[entry];
        }
    }
}
console.log("Sum " + sum);

