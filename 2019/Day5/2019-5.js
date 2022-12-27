var IntCodeProgram = require('./IntCodeProgram.js');

function unitTest(result, stringvalue) {
    if (JSON.stringify(result) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(result)} != ${stringvalue}`);
    }
}


function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString();

    let dataset = rawDataSet.split(',').map(x => Number(x));
    return dataset;
}



// unitTest(getDigit(1002, 2), '0');
// unitTest(getDigit(1002, 3), "1");
// unitTest(getDigit(1002, 4), '0');



unitTest(IntCodeProgram([3, 0, 4, 0, 99], [1]).outputs[0], "1");
// Check all examples day2
unitTest(IntCodeProgram([1,9,10,3,2,3,11,0,99,30,40,50], [0]).finalState, "[3500,9,10,70,2,3,11,0,99,30,40,50]");
unitTest(IntCodeProgram([1,0,0,0,99], [0]).finalState, "[2,0,0,0,99]");
unitTest(IntCodeProgram([2,3,0,3,99], [0]).finalState, "[2,3,0,6,99]");
unitTest(IntCodeProgram([2,4,4,5,99,0], [0]).finalState, "[2,4,4,5,99,9801]");
unitTest(IntCodeProgram([1,1,1,4,99,5,6,0,99], [0]).finalState, "[30,1,1,4,2,5,6,0,99]");



function executePart1(dataset) {
    return IntCodeProgram(dataset, [1]).outputs;
}

//Test cases
unitTest(IntCodeProgram([3,9,8,9,10,9,4,9,99,-1,8], [7]).outputs[0], "0");
unitTest(IntCodeProgram([3,9,8,9,10,9,4,9,99,-1,8], [8]).outputs[0], "1");
unitTest(IntCodeProgram([3,9,8,9,10,9,4,9,99,-1,8], [9]).outputs[0], "0");
//Test jump cases
unitTest(IntCodeProgram([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9],[0]).outputs[0], "0");
unitTest(IntCodeProgram([3,12,6,12,15,1,13,14,13,4,13,99,-1,0,1,9], [5]).outputs[0], "1");
unitTest(IntCodeProgram([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], [0]).outputs[0], "0");
unitTest(IntCodeProgram([3,3,1105,-1,9,1101,0,0,12,4,12,99,1], [5]).outputs[0], "1");
//Test larger example
let largeExample = [3,21,1008,21,8,20,1005,20,22,107,8,21,20,1006,20,31,
    1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,
    999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99];
unitTest(IntCodeProgram(largeExample.slice(), [6]).outputs[0], "999");
unitTest(IntCodeProgram(largeExample.slice(), [8]).outputs[0], "1000");
unitTest(IntCodeProgram(largeExample.slice(), [31]).outputs[0], "1001");
function executePart2(dataset) {
    return IntCodeProgram(dataset, [5]).outputs;
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