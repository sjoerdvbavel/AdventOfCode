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
        dataset.push(parseInt(line));
    }

    return dataset;
}
const arrayWithoutElementAtIndex = function (arr, index) {
    return arr.slice(0, index).concat(arr.slice(parseInt(index) + 1));
}
function allSets(items, weights) {
    if (weights.length == 0) {
        return [[[]]];
    }
    let returnset = [];
    for (let itemindex in items) {
        if (items[itemindex] == weights[0]) {
            let setsnewbins = allSets(arrayWithoutElementAtIndex(items, itemindex), weights.slice(1));
            returnset.concat(setsnewbins.map(set => set[0].push(items[itemindex])));
        } else if (items[itemindex] < weights[0]) {
            let newweights = weights.slice();
            newweights[0] -= items[itemindex];
            let setstoadd = allSets(arrayWithoutElementAtIndex(items, itemindex), newweights);
            returnset.concat(setstoadd.map(set => set[0].push(items[itemindex])));
        }
    }
    return returnset;
}
unitTest(allSets([10], [10]), '[[10]]');
unitTest(allSets([10,10], [10,10]), '[[10,10],[10,10]]');
unitTest(allSets([1,2,8,9], [10,10]), '[[10,10],[10,10]]');
function executePart1(dataset) {
    let packageweight = dataset.reduce((a, b) => a + b) / 3;
    let bestsolution = [];
    let amountofPackagesInFront = Infinity;
    let smallestQuantumEntanglement = Infinity;
    let allsets = allSets(dataset, [packageweight, packageweight, packageweight]);
    console.log(JSON.stringify(allsets));
    for (sets of allsets) {
        if ((sets[0].length < amountofPackagesInFront)
            || (sets[0].length == amountofPackagesInFront && getQuantumEntanglement(sets[0]) < smallestQuantumEntanglement)) {
            amountofPackagesInFront = set[0].length;
            smallestQuantumEntanglement = getQuantumEntanglement(sets[0]);
            bestsolution = sets;
        }
    }
    console.log(`${amountofPackagesInFront} ${JSON.stringify(bestsolution)}`);
    return smallestQuantumEntanglement;
}

function executePart2(dataset) {

    return -1;
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