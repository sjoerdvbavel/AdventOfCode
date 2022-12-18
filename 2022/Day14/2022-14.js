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
        let numbers = line.split(' -> ').map(a => a.split(',').map(b => Number(b)));
        dataset.push(numbers);
    }

    console.log(dataset.slice(0, 5));
    return dataset;
}

function executePart1(dataset) {
    let Flatdataset = dataset.flat();
    let maxX = Math.max(...Flatdataset.map(a=>a[0]));
    let minX = Math.min(...Flatdataset.map(a=>a[0]));
    let maxY = Math.max(...Flatdataset.map(a=>a[1]));
    let minY = Math.min(...Flatdataset.map(a=>a[1]));

    console.log(`Box is ${minX} - ${maxX} by ${minY} - ${maxY}`);
    


    let xlim = maxX - minX;
    let ylim = maxY - maxY;
    let field = [];
    for (let y = 0; y < ylim; y++) {
        let row = [];
        for (let x = 0; x < xlim; x++) {
            row.push('.');
        }
        field.push(row);
    }

    //Fill the walls:
    for(wallset of dataset){
        let current = wallset[0];

        for(let i = 1; )
        let xDirection = wallset[i][0] == wallset[i+1][0]?0:wallset[i][0] > wallset[i+1][0]?1:-1;
        let yDirection = wallset[i][1] == wallset[i+1][1]?0:wallset[i][1] > wallset[i+1][1]?1:-1;
        while(current[0] != wallset[i+1][0] && current[1] != wallset[i+1][1]){
            current[0] += xDirection;
            current[1] += yDirection;
            field[current[0]][current[1]] = '#'
        }
    }
    return -1;
}

function executePart2(dataset) {
    let xlim = dataset[0].length;
    let ylim = dataset.length;
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            //do something
        }
    }
    return -1;
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