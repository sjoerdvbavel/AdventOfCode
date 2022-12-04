const { get } = require('https');
const { start } = require('repl');

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
        dataset.push(line.split(',').map(a => a.split('-').map(b => Number(b))));
    }

    return dataset;
}

function executePart1(dataset) {
    console.log(dataset.slice(0, 5));
    let count = 0;
    for (elfs of dataset) {
        let elfZero = elfs[0];
        let elfOne = elfs[1];
        if (elfZero[0] >= elfOne[0] && elfZero[1] <= elfOne[1]) {
            count++;
        } else if (elfZero[0] <= elfOne[0] && elfZero[1] >= elfOne[1]) {
            count++
        }
    }
    return count;
}
function getOverlap(range){
    //Check if overlap occurs
    if(range[0][0] > range[1][1] ||range[0][1] < range[1][0]){
        return false;
    }
    return true;
}
function executePart2(dataset) {
    let Overlap = 0;
    for (elfs of dataset) {
        if(!(elfs[0][0] > elfs[1][1] ||elfs[0][1] < elfs[1][0])) Overlap++;
        // console.log(`${elfs[0][0]}-${elfs[0][1]} ${elfs[1][0]}-${elfs[1][1]} ${getOverlap(elfs)}`);
    }
    return Overlap;
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