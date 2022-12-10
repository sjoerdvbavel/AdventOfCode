const IntCodeProgram = require('../Day5/IntCodeProgram');

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString();

    let dataset = rawDataSet.split(',').map(a => Number(a));
    // console.log(dataset.slice(0, 5));
    return dataset;
}
function generatePermutations(array) {
    if (array.length == 1) {
        return [array];
    }
    let permutations = [];
    for (let i in array) {
        let otherElements = array.slice(0, i).concat(array.slice(Number(i) + 1, array.length));
        permutations = permutations.concat(generatePermutations(otherElements).map(a => [array[i], ...a]));
    }
    return permutations;
}

function executePrograms(program, order) {
    let input = 0;
    for (step of order) {
        input = IntCodeProgram(program, [step, input]).outputs[0];
    }
    return input;
}
unitTest(executePrograms([3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0], [4, 3, 2, 1, 0]), '43210');

function executePart1(dataset) {
    let maxSignal = 0;
    let maxSignalSequence = [];
    for (perm of generatePermutations([0, 1, 2, 3, 4])) {
        let signal = executePrograms(dataset, perm);
        if (signal >= maxSignal) {
            maxSignal = signal;
            maxSignalSequence = perm;
        }
    }
    console.log(`Max ${maxSignal} at ${maxSignalSequence}`);
    return maxSignal;
}

function getDigit(number, digit) {
    let attempt = (number + '').split('').reverse()[digit];
    return Number(attempt ? attempt : 0);
}

function ExecuteSteps(program, machine, verbose) {
    var position = machine.position;
    var newOutputs = [];
    // console.log(array);
    verbose && console.log(`Resumed program ${program} with input ${machine.input}`);
    while (true) {
        var command = program[position],
            opcode = command % 100,
            OpmodeA = getDigit(command, 4),
            OpmodeB = getDigit(command, 3),
            OpmodeC = getDigit(command, 2),
            parOne = OpmodeC ? program[position + 1] : program[program[position + 1]],
            adressOne = program[position + 1];
            parTwo = OpmodeB ? program[position + 2] : program[program[position + 2]],
            //parThree = OpmodeA ? array[position + 3] : array[array[position + 3]],
            adressThree = program[position + 3];
        verbose && console.log(`${position} ${program}  values: ${parOne}(${OpmodeC}, ${program[position + 1]}) ${parTwo}(${OpmodeB}, ${program[position + 2]})`);
        if (opcode == 1) {
            program[adressThree] = parOne + parTwo;
            verbose && console.log(`wrote sum ${program[adressThree]} to ${adressThree}`);
            position += 4;
        } else if (opcode == 2) {
            program[adressThree] = parOne * parTwo;
            verbose && console.log(`wrote product ${program[adressThree]} to ${adressThree}`);
            position += 4;
        } else if (opcode == 3) {
            if(machine.input.length != 0){
            program[adressOne] = machine.input.shift();
            position += 2;
            verbose && console.log(`wrote input ${program[adressOne]} to ${adressOne}`);
            } else{
                //Pauze machine
                machine.position = position;
                machine.status = 'waiting';
                return newOutputs;
            }
        } else if (opcode == 4) {
            newOutputs.push(parOne);
            machine.output.push(parOne);
            verbose && console.log(`Output ${parOne} from ${position + 1}`);
            position += 2;
        } else if (opcode == 5) {
            if(parOne != 0){
                position = parTwo;
                verbose && console.log(`Set position to  ${parOne}`);
            } else{
                position += 3;
                verbose && console.log(`Skipped jump-if-true, value ${parOne}`);
            }
        }else if (opcode == 6) {
            if(parOne == 0){
                position = parTwo;
                verbose && console.log(`Set position to  ${parTwo}`);
            } else{
                position += 3;
                verbose && console.log(`Skipped jump-if-false, value ${parOne}`);
            }
        } else if (opcode == 7) {
            program[adressThree] = parOne < parTwo?1:0;
            verbose && console.log(`wrote less than ${program[adressThree]}(${parOne} < ${parTwo}) to ${adressThree}`);
            position += 4;
        }else if (opcode == 8) {
            program[adressThree] = parOne == parTwo?1:0;
            verbose && console.log(`wrote ${program[adressThree]} (${parOne} == ${parTwo}) to ${adressThree}`);
            position += 4;
        } else if (opcode == 99) {
            verbose && console.log(`Exited 99`);
            machine.position = position;
            machine.status = 'halted';
            return newOutputs;
        } else {
            console.log("Error " + opcode);
            machine.position = position;
            machine.status = 'error';
            return newOutputs;
        }
    }
}

function executeFeedbackLoop(program, order) {
    let input = [0];
    let amplifiers = [];
    for (step of order) {
        amplifiers.push({status: 'running', input:[step], output: [], position: 0});
    }
    amplifiers[0].input.push(0);
    let allHalted = false;
    //Execute    
    while(!allHalted){
        for(amplifierIndex in amplifiers){
            let amplifier = amplifiers[amplifierIndex];
            let nextAmplifier = amplifiers[(Number(amplifierIndex) + 1) % 5]
            if(amplifier.status == 'running'){
                //Execute program for a while
                let newOutput = ExecuteSteps(program, amplifier, false);
                //Add output to next amplifier inputs and remove a waiting status.
                if(newOutput.length != 0){
                    nextAmplifier.input.push(...newOutput);
                    nextAmplifier.status = nextAmplifier.status == 'waiting'?'running':nextAmplifier.status;
                }
                //if halted, check whether it is the last machine running.
                if(amplifier.status == 'halted'){
                    allHalted = !amplifiers.some(a=> a.status != 'halted');
                }
            }
            
        }
    }
    return amplifiers[4].output.pop();
}
unitTest(executeFeedbackLoop(
    [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,
        -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,
        53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10], 
    [9,7,8,5,6]), '18216');



function executePart2(dataset) {
    let maxSignal = 0;
    let maxSignalSequence = [];
    for (perm of generatePermutations([5, 6, 7, 8, 9])) {
        let signal = executeFeedbackLoop(dataset, perm);
        if (signal >= maxSignal) {
            maxSignal = signal;
            maxSignalSequence = perm;
        }
    }
    console.log(`Max ${maxSignal} at ${maxSignalSequence}`);
    return maxSignal;
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    let testdata2 = parseData('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart2(testdata2);
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1);
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();