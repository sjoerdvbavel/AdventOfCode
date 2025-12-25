function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\n");
    let dataset = [];
    for (line of rawDataSet) {
        dataset.push({direction: line[0], left: line[0]=='L', distance: Number(line.substring(1))});
    }
    return dataset;
}

function executePart1(dataset) {
    let value = 50;
    let count = 0
    // console.log(`The dial starts by pointing at ${value}`);
    for(item of dataset){
        if(item.left){
            value -= item.distance;
        } else{
            value += item.distance;
        }
        // console.log(`The dial is rotated ${item.direction + item.distance} to point at ${((value % 100) + 100) % 100}`)
        if(value % 100 == 0){
            count++;
        }
    }   
    return count;
}

function countZeroes(start, distance){
    // console.log(`${start}, ${distance} ${Math.floor((start + distance) / 100)+ (start %100 == 0?-1:0)}`)
    return Math.floor((start + distance) / 100)
}

function executePart2(dataset) {
    let value = 50;
    let count = 0
    // console.log(`The dial starts by pointing at ${value}`);
    for(item of dataset){
        let countThisRound = 0;
        if(item.left){
            countThisRound = countZeroes((100 - value) % 100, item.distance);
            value -= item.distance;
        } else{
            countThisRound = countZeroes(value, item.distance);
            value += item.distance;

        }

        count += countThisRound;
        value = ((value % 100) + 100) % 100
        // console.log(`The dial is rotated ${item.direction + item.distance} to point at ${((value % 100) + 100) % 100} (count this round: ${countThisRound})` )
    }   
    return count;
}

function execute(){ 
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