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

    return JSON.parse(rawDataSet);
}

function sumJSON(dataset){
    let numbers = JSON.stringify(dataset).match(/([-0-9]+)/g);
    return numbers.map(x => parseInt(x, 10)).reduce((a, b) => a + b);
}

function executePart1(dataset) {
    return sumJSON(dataset);
}

function hasRed(object) {
    if (!Array.isArray(object)) {
        for (item of Object.values(object)) {
            if (item === 'red') {
                return true;
            }
        }
    }
    return false;
}

function exploreObject(object) {
    for (let itemkey of Object.keys(object)) {
        if (hasRed(object[itemkey])) {
            object[itemkey] = 0;
        } else {
            if(typeof object[itemkey] == 'object'){
                exploreObject(object[itemkey]);
            }
        }
    }
}

function executePart2(dataset) {
    exploreObject(dataset);
    return sumJSON(dataset);
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
    if (testresult2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();