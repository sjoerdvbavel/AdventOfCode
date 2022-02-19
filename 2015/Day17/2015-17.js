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

    return rawDataSet.map(x => parseInt(x, 10));
}

function countWays(containers, volume) {
    if (volume == 0) {
        return 1;
    } if (containers.length == 0) {
        return 0;
    }

    let sum = 0;
    for (let i = 0; i< containers.length; i++) {
        if (volume - containers[i] >= 0) {
            sum += countWays(containers.slice(i + 1, containers.length), volume - containers[i]);
        }
    }
    return sum;
}

function getWays(containers, volume) {
    if (volume == 0) {
        return [[]];
    } if (containers.length == 0) {
        return [];
    }

    let set = [];
    for (let i = 0; i< containers.length; i++) {
        if (volume - containers[i] >= 0) {
            let results = getWays(containers.slice(i + 1, containers.length), volume - containers[i]);
            set = set.concat(results.map(x => [containers[i], ...x]));
        }
    }
    return set;
}

function executePart1(dataset, volume) {
    return countWays(dataset, volume);
}

function executePart2(dataset, volume) {
    ways = getWays(dataset, volume);
    let min = Math.min(...ways.map(x => x.length));
    return ways.filter(x => x.length == min).length;
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1, 25);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    let testdata2 = parseData('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart2(testdata2, 25);
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1, 150);
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2, 150);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();