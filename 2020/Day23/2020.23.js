function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString();

    return rawDataSet.split('').map(x => parseInt(x,10));
}

function playGame(startingcups){
    let cups = startingcups.slice();
    let currentcup = 0;


    for(let i = 0; i < 100; i++){
        let currentvalue = cups[currentcup];
        let pickupcups = cups.slice(currentcup, currentcup + 3);
        

    }
}

function executePart1(dataset) {
 
    return -1;
}

function executePart2(dataset) {

    return -1;
}

function execute() {
    let testdata1 = parseData('testdata.txt');
    let testresult1 = executePart1(testdata1);
    if (testresult1) {
        console.log(`testdata part1: ${testresult1}`);
    }
    let testdata2 = parseData('testdata.txt');
    let testresult2 = executePart2(testdata2);
    if (testresult2) {
        console.log(`testdata part2: ${testresult2}`);
    }
    let realdata1 = parseData('data.txt');
    let result1 = executePart1(realdata1);
    if (result1) {
        console.log(`part1: ${result1}`);
    }
    let realdata2 = parseData('data.txt');
    let result2 = executePart2(realdata2);
    if (testresult2) {
        console.log(`part2: ${result2}`);
    }
}

execute();