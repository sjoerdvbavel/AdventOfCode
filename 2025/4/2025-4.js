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

    dataset.push(line.split(''));
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}
function isPaperRoll(dataset, point){
    if(point[0] < 0 || point[0] >= dataset.length || point[1] < 0 || point[1] >= dataset[0].length ) {
        return false;
    }
    return dataset[point[0]][point[1]] == '@';
}

function applyDirection(point, direction){
    return [point[0] + direction[0],point[1] + direction[1]];
}
function printField(field) {
    for (line of field) {
        console.log(line.join(''));
    }
}

function removeRolls(dataset){
    let outputField = []
    for(row of dataset){
        outputField.push(row.slice());
    }
    let length = dataset.length;
    let height = dataset[0].length;
    let directions = [
        [ 1,-1],[ 1,0],[ 1,1],
        [ 0,-1],       [ 0,1],
        [-1,-1],[-1,0],[-1,1],
    ];
    let totalCount = 0;
    for(let rowIndex = 0; rowIndex < dataset.length; rowIndex++){
        for(let columnIndex = 0; columnIndex < dataset[rowIndex].length; columnIndex++){
            if(isPaperRoll(dataset, [rowIndex, columnIndex])){
                // console.log(`@Paper roll ${[rowIndex, columnIndex]}`)
                let count = 0
                for(direction of directions){
                    if(isPaperRoll(dataset, applyDirection([rowIndex, columnIndex], direction))){
                        count++;
                    }
                }
                if(count < 4){
                    totalCount++;
                    outputField[rowIndex][columnIndex] = '.';
                }       
            }
        }
    }
    return [outputField, totalCount];
}

function executePart1(dataset) {
    let output = removeRolls(dataset);

    return output[1];
}

function executePart2(dataset) {
    let totalRemoved = 0;
    let output = removeRolls(dataset);
    totalRemoved += output[1];
    // console.log();
    // console.log(`Remove ${output[1]} rolls of paper:`);
    // printField(output[0]);
    while(output[1] != 0){
        output = removeRolls(output[0]);
        totalRemoved += output[1];
        // console.log();
        // console.log(`Remove ${output[1]} rolls of paper:`);
        // printField(output[0]);
    }

    return totalRemoved;
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