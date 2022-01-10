const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
const { off } = require('process');
const { start } = require('repl');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString();

//parse instructions
var instructions = dataset.split('\r\n').map(x => x.split(' '));



function executeInstruction(instruction, state, nextinput) {
    if (instruction[0] == 'inp') {
        state[instruction[1]] = nextinput;
        return { error: false, state: state, usedinput: true };
    }
    //Parse or grab the digit.
    let secondaryDigit = instruction[2].match(/(\-*\d+)/) ? parseInt(instruction[2], 10) : state[instruction[2]];

    if (instruction[0] == 'add') {
        state[instruction[1]] += secondaryDigit;
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'mul') {
        state[instruction[1]] *= secondaryDigit;
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'div') {
        if (secondaryDigit == 0) {
            return { error: true, errormessage: 'divide by zero' };
        }
        let value = state[instruction[1]] / secondaryDigit;
        state[instruction[1]] = value >= 0 ? Math.floor(value) : Math.ceil(value);
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'mod') {
        if (state[instruction[1]] < 0) {
            return { error: true, errormessage: 'mod a negative' };
        }
        if (secondaryDigit <= 0) {
            return { error: true, errormessage: 'mod with a nonpositive' };
        }
        state[instruction[1]] = state[instruction[1]] % secondaryDigit;
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'eql') {
        state[instruction[1]] = state[instruction[1]] == secondaryDigit ? 1 : 0;
        return { error: false, state: state, usedinput: false };
    }
    return { error: true, errormessage: 'invalid keyword' };
}

function ExecuteProgram(program, initialstate, input) {
    let state = initialstate;
    let output = {};
    let inputnumber = 0;
    for (let i = 0; i < program.length; i++) {
        output = executeInstruction(program[i], state, input[inputnumber]);

        if (output.error) {
            return { error: true, errormessage: output.errormessage, errorinstruction: i, errorinput: inputnumber };
        }
        state = output.state;
        if (output.usedinput) {
            inputnumber++
        }
    }
    return { error: false, finalstate: state };
}

function reduceArray(array) {
    if (array.length == 0) {
        return [0];
    }
    let lastnumber = array.length - 1;
    if (array[lastnumber] != 1) {
        array[lastnumber] = array[lastnumber] - 1;
        return array;
    } else {
        return [...reduceArray(array.slice(0, lastnumber)), 9];
    }
}

//Some tests
console.log(JSON.stringify(ExecuteProgram([['inp', 'x'], ['mul', 'x', '-1']], { w: 0, x: 0, y: 0, z: 0 }, [1])));

//Execute the program.

//Start with a large number:

// var potentialnumber = new Array(14).fill(8);

// while (parseInt(potentialnumber.join(''), 10) > 0) {
//     var initialstate = { w: 0, x: 0, y: 0, z: 0 };
//     result = ExecuteProgram(instructions, initialstate, potentialnumber);

//     if (result.error) {
//         let errorspot = potentialnumber.slice(0, result.errorinput);
//         potentialnumber = reduceArray(errorspot).concat(new Array(14 - result.errorinput).fill(9));
//         console.log(`error occured at ${errorspot.join('')}, continue with ${potentialnumber.join('')}. Message: ${result.errormessage}`);
//     } else {
//         if (result.finalstate.z == 0) {
//             console.log(`Found a valid number ${potentialnumber.join('')}`);
//             break;
//         } else {
//             potentialnumber = reduceArray(potentialnumber);
//             // if ((parseInt(potentialnumber.join(''), 10) - 1) % 10^7 == 0) {
//                 // console.log(`${potentialnumber.join('')} was invalid, z=${result.finalstate.z}`);
//             // }
//         }
//     }
// }
let lastset = instructions.slice(18 * 13, instructions.length);
let z1sols = [];
for (let z_rem = 0; z_rem < 26; z_rem++) {
    for (let z_a = 0; z_a < 100; z_a++) {
        for (let w = 1; w <= 9; w++) {
            let ztotal = z_a * 26 + z_rem
            let result = ExecuteProgram(lastset, { w: 0, x: 0, y: 0, z: ztotal }, [w.toString()]);
            if (result.finalstate.z == 0) {
                console.log(`z:${ztotal}, w:${w} ${JSON.stringify(result.finalstate)}`);
                z1sols.push(ztotal);
            }
        }
    }
}

let second2lastset = instructions.slice(18 * 12, 18 * 13);
let z2sols = [];
for (let z_a = 0; z_a < 1000; z_a++) {
    for (let z_rem = 0; z_rem < 26; z_rem++) {
        for (let w = 1; w <= 9; w++) {
            let ztotal = (z_a * 26) + z_rem
            let result = ExecuteProgram(second2lastset, { w: 0, x: 0, y: 0, z: ztotal }, [w.toString()]);
            if (z1sols.find(y => result.finalstate.z == y)) {
                console.log(`z2:${ztotal}, w:${w} ${JSON.stringify(result.finalstate)}`);
                z2sols.push(ztotal);
            }
        }
    }
}
console.log(`${z2sols.length}`)