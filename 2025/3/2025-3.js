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

    return rawDataSet;
}

function getMaxNumber(string){
    // console.log(`max of ${string} is ${Math.max(...string.split('').map(x => Number(x)))}`);
    return Math.max(...string.split('').map(x => Number(x)));
}

function executePart1(dataset) {
    let maxVoltages = []
    
    for(battery of dataset){
        //Get the max of the first n-1 digits
        let leftDigit = getMaxNumber(battery.slice(0, battery.length-1));
        // Get the max of the remaining digits
        let rightDigit = getMaxNumber(battery.slice(battery.indexOf(leftDigit)+1));

        let maxVoltage = Number(leftDigit + '' + rightDigit);
        // console.log(`max voltage ${battery} is ${maxVoltage}`);
        maxVoltages.push(maxVoltage);
    } 
    return maxVoltages.reduce((a,b)=> a+b, 0);
}


function getMaxRemainingJoltage(string, remainingNumbers){
    if(remainingNumbers == 0){
        return '';
    }
    let nextDigit = getMaxNumber(string.slice(0, string.length - remainingNumbers + 1));
    let nextIndex = string.indexOf(nextDigit);
    return nextDigit + getMaxRemainingJoltage(string.slice(nextIndex+1), remainingNumbers - 1);
}

function executePart2(dataset) {
    let maxVoltages = []
    
    for(battery of dataset){
        let maxJoltage = getMaxRemainingJoltage(battery, 12);
        // console.log(`max voltage ${battery} is ${maxJoltage}`);
        maxVoltages.push(Number(maxJoltage));
    } 
    return maxVoltages.reduce((a,b)=> a+b, 0);
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