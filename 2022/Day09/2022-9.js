const { createSecureServer } = require('http2');

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
        let splits = line.split(' ')
        dataset.push({ dir: splits[0], length: Number(splits[1]) });
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}
function adjustTail(headSpot, tailSpot) {
    let xdiff = headSpot[0] - tailSpot[0];
    let ydiff = headSpot[1] - tailSpot[1];
    if (Math.abs(xdiff) > 1 && Math.abs(ydiff) > 1) {
        tailSpot[0] = Math.abs(xdiff) > 1 ? tailSpot[0] + xdiff / 2 : tailSpot[0];
        tailSpot[1] = Math.abs(ydiff) > 1 ? tailSpot[1] + ydiff / 2 : tailSpot[1];
    } else if (Math.abs(xdiff) > 1) {
        tailSpot[0] = Math.abs(xdiff) > 1 ? tailSpot[0] + xdiff / 2 : tailSpot[0];
        tailSpot[1] = headSpot[1]
    } else if (Math.abs(ydiff) > 1) {
        tailSpot[0] = headSpot[0]
        tailSpot[1] = Math.abs(ydiff) > 1 ? tailSpot[1] + ydiff / 2 : tailSpot[1];
    }
}
function executePart1(dataset) {
    let visited = new Set();
    visited.add('0,0');
    let headSpot = [0, 0];
    let tailSpot = [0, 0];
    for (instruction of dataset) {
        for (let i = 0; i < instruction.length; i++) {
            switch (instruction.dir) {
                case 'L':
                    headSpot[0]--;
                    break;
                case 'R':
                    headSpot[0]++;
                    break;
                case 'D':
                    headSpot[1]++;
                    break;
                case 'U':
                    headSpot[1]--;
                    break;
            }
            adjustTail(headSpot, tailSpot);
            visited.add(`${tailSpot[0]},${tailSpot[1]}`);
            // if(dataset.length < 20) console.log(`headspot ${headSpot} tailspot ${tailSpot}`);
        }
    }
    // if(dataset.length < 20) console.log(visited);
    return visited.size;
}

function executePart2(dataset) {
    let visited = new Set();
    visited.add('0,0');
    let headSpot = [0, 0];
    let tailSpots = [];
    for (let j = 0; j < 9; j++) {
        tailSpots.push([0, 0]);
    }
    for (instruction of dataset) {
        for (let i = 0; i < instruction.length; i++) {
            switch (instruction.dir) {
                case 'L':
                    headSpot[0]--;
                    break;
                case 'R':
                    headSpot[0]++;
                    break;
                case 'D':
                    headSpot[1]++;
                    break;
                case 'U':
                    headSpot[1]--;
                    break;
            }
            adjustTail(headSpot, tailSpots[0])
            for (let k = 1; k < 9; k++) {
                adjustTail(tailSpots[k - 1], tailSpots[k]);
            }
            visited.add(`${tailSpots[8][0]},${tailSpots[8][1]}`);
            // if (dataset.length < 20) console.log(`headspot ${headSpot} tailspot ${tailSpots}`);
        }
    }
    // if (dataset.length < 20) console.log(visited);
    return visited.size;
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