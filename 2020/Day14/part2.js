var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
//We split the file into lines and parse the input into objects with:
//  - command, the first word
//  - textvalue, the second word not parsed to int.
//  - intvalue, the second word parsed to int.
//  - address, the number in mem[number] if the command is not 'mask'
var commands = fs.readFileSync(filePath).toString().split("\r\n").map(
    function (string) {
        let command = string.split(' = ')[0];
        return {
            command: command,
            textvalue: string.split(' = ')[1],
            intvalue: parseInt(string.split(' = ')[1]),
            address: (command != 'mask' ? parseInt(command.match(/\d+/)[0]) : undefined)
        };
    }
);

// console.log(JSON.stringify(commands));

function AddToArrays(arraylist, newitem) {
    if (newitem == 'X') {
        let newarraylist = [];
        for (array of arraylist) {
            let newarray0 = array.slice();
            newarray0.push("0");
            newarraylist.push(newarray0);

            let newarray1 = array.slice();
            newarray1.push("1");
            newarraylist.push(newarray1);
        }
        return (newarraylist);
    } else {
        for (array of arraylist) {
            array.push(newitem);
        }
        return (arraylist);
    }
}

//This function applies the mask the new way and returns an array with all adresses.
function ApplyNewMask(value, mask) {
    let maskcharlist = mask.split('').reverse();
    let valuecharlist = value.toString(2).split('').reverse();
    let combinedarray = [[]];
    console.assert(maskcharlist.length > valuecharlist.length);

    for (let j = 0; j < maskcharlist.length; j++) {//Loop over all the characters

        if (maskcharlist[j] == 'X') {
            combinedarray = AddToArrays(combinedarray, 'X');
        } else if (maskcharlist[j] == "1") {
            combinedarray = AddToArrays(combinedarray, 1);
        } else {//mask = 0
            let newchar = j < valuecharlist.length ? valuecharlist[j] : 0;
            combinedarray = AddToArrays(combinedarray, newchar);
        }
    }
    return combinedarray.map(array => parseInt(array.reverse().join(''), 2));
}

var program = {};
for (var i = 0; i < commands.length; i++) {
    let line = commands[i];
    if (line.command == "mask") {
        program.mask = line.textvalue;
        console.log("Mask is now " + program.mask);
    } else {
        let addresses = ApplyNewMask(line.address, program.mask)
        for (adresss of addresses) {
            program[adresss] = line.intvalue;
            console.log("Line " + adresss + " is now " + line.intvalue);
        }
    }
}

//sum all the entries in all the programs.
var sum = 0;
for (entry in program) {
    if (entry != "mask") {
        sum += program[entry];
    }
}
console.log("Sum " + sum);

