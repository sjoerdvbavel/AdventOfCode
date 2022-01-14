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

function testString(string){
    return JSON.stringify(ExecuteProgram(instructions, { w: 0, x: 0, y: 0, z: 0 }, "99996953827143".split('').map(x=>parseInt(x,10))).state);

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

var potentialnumber = new Array(14).fill(4);
let leadingdigit = 10;
while (parseInt(potentialnumber.join(''), 10) > 10^13) {
    var initialstate = { w: 0, x: 0, y: 0, z: 0 };
    // result = ExecuteProgram(instructions, initialstate, potentialnumber);
    let xcounter = 0;
    let ztotal = 0;
    let survived = true;
    for (let i = 0; i < 14; i++) {
        //Exe
        let currentsubprogram = instructions.slice(18 * (i), 18 * (i+1));
        result = ExecuteProgram(currentsubprogram, { w: 0, x: 0, y: 0, z: ztotal}, [potentialnumber[i]]);
        ztotal = result.state.z;
        xcounter += result.state.x;
        if(result.state.x != 0 && result.state.x != 1){
            // console.log(`Found x = ${result.state.x} number ${potentialnumber.join('')} at step ${i}.`);
        }
        if (xcounter > 7) {//I expect the sum of all x'es has to be 6 or less.
            potentialnumber = reduceArray(potentialnumber.slice(0, i)).concat(new Array(14 - i).fill(9));
            survived = false;
            break;
            // console.log(`xcounter too high, continue with ${potentialnumber.join('')}.`);
        }
    }
    if(survived){
        console.log(`Number ${potentialnumber.join('')} ${JSON.stringify(result.state)}, x ${xcounter}`);
        // console.log(`${JSON.stringify(ExecuteProgram(instructions, { w: 0, x: 0, y: 0, z: 0}, potentialnumber).state)}`);
        potentialnumber = reduceArray(potentialnumber);
    } else {
    }

    if (result.error) {
        let errorspot = potentialnumber.slice(0, result.errorinput);
        potentialnumber = reduceArray(errorspot).concat(new Array(14 - result.errorinput).fill(9));
        console.log(`error occured at ${errorspot.join('')}, continue with ${potentialnumber.join('')}. Message: ${result.errormessage}`);
    } else if (result.state.z == 0) {
        console.log(`Found a valid number ${potentialnumber.join('')}. check: ${JSON.stringify(ExecuteProgram(instructions, { w: 0, x: 0, y: 0, z: 0 }, potentialnumber).state)}`);
        break;
    } else {
        if (potentialnumber[0] < leadingdigit) {
            console.log(`Number ${potentialnumber.join('')} invalid, ztotal = ${ztotal}`);
            leadingdigit = potentialnumber[0];
        }
    }
}
