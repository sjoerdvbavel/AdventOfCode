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

    return rawDataSet;
}

function executePart1(dataset) {
    let sum = 0;

    for (line of dataset) {
        trimmedline = line.substring(1, line.length-1);
        let regex = /\\x[0-9a-h]{0,2}|\\\"|\\\\/gm;
        replacedline = trimmedline.replace(regex, '.');

        sum += line.length - replacedline.length;
    }

    return sum;
}

function executePart2(dataset) {
    let sum = 0;
    for (line of dataset) {
        
        replacedline = line.replaceAll('\\', '\\\\');
        replacedline = '"' + replacedline.replaceAll('"', '."') + "'";

        sum += replacedline.length - line.length;
    }

    return sum;
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