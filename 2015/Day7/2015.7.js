function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n");

    let dataset = [];
    for (line of rawDataSet) {
        splits = line.split(' -> ');
        lefthand = splits[0].split(' ');
        if (lefthand.length == 1) {
            dataset.push({ target: splits[1], value: lefthand[0], value2: -1, command: 'VALUE' });
        } else if (lefthand.length == 2) {
            dataset.push({ target: splits[1], value: lefthand[1], value2: -1, command: lefthand[0] });
        } else if (lefthand.length == 3) {
            dataset.push({ target: splits[1], value: lefthand[0], value2: lefthand[2], command: lefthand[1] });
        }
    }
    return dataset;
}
function executecommand(instruction, state) {
    let value1 = isNaN(instruction.value) ? state[instruction.value] : parseInt(instruction.value, 10);
    let value2 = instruction.value2 ? isNaN(instruction.value2) ? state[instruction.value2] : parseInt(instruction.value2, 10) : -1;
    if (instruction.command == 'VALUE') {
        state[instruction.target] = value1;
    } else if (instruction.command == 'NOT') {
        state[instruction.target] = (~value1 + Math.pow(2, 16)) % Math.pow(2, 16);
    } else if (instruction.command == 'AND') {
        state[instruction.target] = value1 & value2;
    } else if (instruction.command == 'OR') {
        state[instruction.target] = value1 | value2;
    } else if (instruction.command == 'LSHIFT') {
        state[instruction.target] = ((value1 << value2) + Math.pow(2, 16)) % Math.pow(2, 16);
    } else if (instruction.command == 'RSHIFT') {
        state[instruction.target] = ((value1 >>> value2) + Math.pow(2, 16)) % Math.pow(2, 16);
    }
    return state;
}

function executeProgram(program, state) {
    newstate = JSON.parse(JSON.stringify(state));
    for (instruction of program) {
        executecommand(instruction, newstate);
    }
    return newstate;
}

function executePart1(dataset) {
    let state = {};
    let newstate = executeProgram(dataset, state);
    while(JSON.stringify(state) != JSON.stringify(newstate)){
        state = newstate;
        newstate = executeProgram(dataset, state);
    }
    // console.log(JSON.stringify(state));
    return state.a ? state.a : -1;
}

function executePart2(dataset) {
    let bvalue =  executePart1(dataset);
    let instructionindex = dataset.findIndex(x => x.target == 'b');
    dataset[instructionindex].value = bvalue;
    // let state = {b: executePart1(dataset)};
    let state = {};
    let newstate = executeProgram(dataset, state);
    while(JSON.stringify(state) != JSON.stringify(newstate)){
        state = JSON.parse(JSON.stringify(newstate))
        // state['b'] = 46065;
        newstate = executeProgram(dataset, state);
    }

    return newstate.a ? newstate.a : -1;
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
    // let testdata2 = parseData('testdata.txt');
    // var starttd2 = performance.now();
    // let testresult2 = executePart2(testdata2);
    // var endtd2 = performance.now();
    // if (testresult2) {
    //     console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    // }

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