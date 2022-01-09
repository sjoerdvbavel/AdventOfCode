//Alternative file, let's find a string that tells us how 

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
    let secondaryDigit = instruction[2].match(/(\-*\d+)/) ? instruction[2] : state[instruction[2]];

    if (instruction[0] == 'add') {
        state[instruction[1]] = state[instruction[1]] + ' + ' + secondaryDigit;
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'mul') {
        state[instruction[1]] = '(' + state[instruction[1]] + ') * (' + secondaryDigit + ')';
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'div') {
        let value = '(' + state[instruction[1]] + ') / (' + secondaryDigit + ')';
        state[instruction[1]] = value
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'mod') {
        state[instruction[1]] = '(' + state[instruction[1]] + ') % (' + secondaryDigit + ')';
        return { error: false, state: state, usedinput: false };
    } else if (instruction[0] == 'eql') {
        state[instruction[1]] = '(' + state[instruction[1]] + ') == (' + secondaryDigit + ')';
        return { error: false, state: state, usedinput: false };
    }
    return { error: true, errormessage: 'invalid keyword' };
}

function ExecuteProgram(program, input) {
    let state = { w: '', x: '', y: '', z: '' };
    let output = {};
    let inputnumber = 0;
    for (let i = 0; i < program.length; i++) {
        output = executeInstruction(program[i], state, 'Input' + inputnumber);
        state = output.state;
    }
    return state;
}

//Some tests

//Execute the program.
console.log(ExecuteProgram(instructions));