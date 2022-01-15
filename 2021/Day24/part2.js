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
    if(!Array.isArray(program)) return {errror: true, errormessage: 'instructions not an array'};
    if(!Array.isArray(input)) return {errror: true, errormessage: 'input not an array'};
    if(typeof input[0] != 'number') return {errror: true, errormessage: 'first input not an integer'};
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
    return { error: false, state: state };
}

function increaseArray(array) {
    if (array.length == 0) {
        return [0];
    }
    let lastnumber = array.length - 1;
    if (array[lastnumber] != 9) {
        array[lastnumber] = array[lastnumber] + 1;
        return array;
    } else {
        return [...increaseArray(array.slice(0, lastnumber)), 1];
    }
}

//Execute the program.

//Start with the lowest possible 14 digit number with no 0's: 1....1
var potentialnumber = [1].concat(new Array(14).fill(1));

let leadingdigit = -1;
while (potentialnumber[0] == 1) {//Because of part 1 I know i can stop at 2*10^14th.
    let xcounter = 0;
    let ztotal = 0;
    let survived = true;
    for (let i = 0; i < 14; i++) {
        let currentsubprogram = instructions.slice(18 * (i), 18 * (i+1));
        result = ExecuteProgram(currentsubprogram, { w: 0, x: 0, y: 0, z: ztotal}, [potentialnumber[i]]);
        ztotal = result.state.z;
        xcounter += result.state.x;
        if (xcounter > 7) {//I expect the sum of all x'es has to be 7 or less.
            potentialnumber = increaseArray(potentialnumber.slice(0, i+1)).concat(new Array(14 - (i+1)).fill(1));
            survived = false;
            break;
        }
    }
    if(survived){
        console.log(`Number ${potentialnumber.join('')} ${JSON.stringify(result.state)}, xcounter: ${xcounter}`);
        if (result.state.z == 0) {
            console.log(`Found a valid number: ${potentialnumber.join('')} check: ${JSON.stringify(ExecuteProgram(instructions, { w: 0, x: 0, y: 0, z: 0 }, potentialnumber).state)}`);
            break;
        } else{
        potentialnumber = increaseArray(potentialnumber);
        }
    }    
    if (result.error) {
        let errorspot = potentialnumber.slice(0, result.errorinput);
        potentialnumber = increaseArray(errorspot).concat(new Array(14 - result.errorinput).fill(1));
        console.log(`error occured at ${errorspot.join('')}, continue with ${potentialnumber.join('')}. Message: ${result.errormessage}`);
    } else {
        if (potentialnumber[1] > leadingdigit) {
            console.log(`Currently at: ${potentialnumber.join('')}`);
            leadingdigit = potentialnumber[1];
        }
    }
}
