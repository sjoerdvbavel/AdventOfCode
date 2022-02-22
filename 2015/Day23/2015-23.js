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
        let splits = line.split(' ');
        if (splits.length == 3) {
            //jio a, +18
            dataset.push({ 'command': splits[0], 'target': 'a', 'value': parseInt(splits[2]) });
        } else {
            //inc a
            dataset.push({ 'command': splits[0], 'target': isNaN(splits[1])?splits[1]:parseInt(splits[1])});
        }

    }
    return dataset;
}


function executeProgram(instructionList, state) {
    let currentline = 0;
    while (currentline < instructionList.length) {
        let line = instructionList[currentline];
        if (line.command == 'hlf') {
            // hlf r sets register r to half its current value, then continues with the next instruction.
            state[line.target] = state[line.target]/2
            currentline++;
        } else if (line.command == 'tpl') {
            // tpl r sets register r to triple its current value, then continues with the next instruction.
            state[line.target] = state[line.target]*3;
            currentline++;
        } else if (line.command == 'inc') {
            // inc r increments register r, adding 1 to it, then continues with the next instruction.
            state[line.target] = state[line.target]+1;
            currentline++;
        } else if (line.command == 'jmp') {
            // jmp offset is a jump; it continues with the instruction offset away relative to itself.
            currentline += line.target;
        } else if (line.command == 'jie') {
            // jie r, offset is like jmp, but only jumps if register r is even ("jump if even").
            if(state[line.target] %2 == 0){
                currentline += line.value;
            } else{
                currentline++
            }
        } else if (line.command == 'jio') {
            // jio r, offset is like jmp, but only jumps if register r is 1 ("jump if one", not odd).
            if(state[line.target] == 1){
                currentline += line.value;
            } else{
                currentline++
            }
        }
    }
    return state;
}

function executePart1(dataset, outputvalue) {
    let state = { a: 0, b: 0 };
    return executeProgram(dataset, state)[outputvalue];
}

function executePart2(dataset, outputvalue) {
    let state = { a: 1, b: 0 };
    return executeProgram(dataset, state)[outputvalue];
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1, 'a');
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    let testdata2 = parseData('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart2(testdata2, 'a');
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1, 'b');
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt', 'b');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2,  'b');
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();