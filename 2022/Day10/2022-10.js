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
        dataset.push({ command: splits[0], value: Number(splits[1]) });
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}
function drawPixel(position, currentvalue){
    let symbol = position % 40 >= currentvalue && position % 40 < currentvalue + 3?'#':'.'
    // console.log(`drawing ${symbol} ${position} with value ${currentvalue}`)
    return symbol
}

function ExecuteProgram(program, values) {
    let tick = 0;
    let signalStrength = 1;
    let output = '';
    for (let instruction of program) {
        if (instruction.command == 'noop') {
            values.push(signalStrength);
            output += drawPixel(tick, signalStrength-1);
            tick++;
        } else if (instruction.command == 'addx') {
            values.push(signalStrength);            
            values.push(signalStrength);
            output += drawPixel(tick, signalStrength-1);
            output += drawPixel(tick+1, signalStrength-1);
            signalStrength += instruction.value;
            tick += 2;
        }
    }
    return output;
}



function executePart1(dataset) {
    let values = [];
    ExecuteProgram(dataset, values);
    let result = 0;
    // console.log(JSON.stringify(values));
    for (let i = 20; i < values.length; i +=40) {
        result += values[i-1] * i;
        // console.log(`${values[i-1]} * ${i} = ${values[i-1] * i}`);
    }
    return result;
}

function executePart2(dataset) {
    let values = [];
    let output = ExecuteProgram(dataset, values);
    for (let i = 0; i < values.length; i +=40) {
        console.log(output.substring(i, i + 39));
    }
    return 1;
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