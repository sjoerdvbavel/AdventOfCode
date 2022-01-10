// Attemp no 2, I noticed the input consists of 14 parts that are almost the same. 
// Each part only depends on the input and the previous z value so we solve backwards.

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


let N = 100000; //The maxvalue of z to search for.	  	
let results = [{ value: 0, hist: '' }];
for (let i = 1; i <= 14; i++) {
    let prevresults = results.slice();
    results = [];
    let currentsubprogram = instructions.slice(18 * (14 - i), 18 * (14 - i+1));
    for (let z_a = 0; z_a < N; z_a++) {
        for (let z_rem = 0; z_rem < 26; z_rem++) {
            for (let w = 1; w <= 9; w++) {
                let ztotal = (z_a * 26) + z_rem
                let result = ExecuteProgram(currentsubprogram, { w: 0, x: 0, y: 0, z: ztotal }, [w.toString()]);
                if (prevresults.find(y => y.value == result.finalstate.z)) {
                    results.push({value:ztotal, hist:w + prevresults.find(y => y.value == result.finalstate.z).hist});
                }
            }
        }
    }
    console.log(`Finished iteration ${i}. ${results.length} solutions`);
}

let maxresult = Math.max(...results.map(x => parseInt(x.hist,10)));
let finalinput = maxresult.split('').map(x=> parseInt(x,10));
console.log(`maxresult: ${maxresult} check: ${ExecuteProgram(instructions, {w:0, x:0, y:0, z:0}, finalinput)}`);