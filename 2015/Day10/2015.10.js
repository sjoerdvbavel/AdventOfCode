
function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var dataset = fs.readFileSync(filePath).toString();

    return dataset;
}

function LookAndSee(word) {
    array = word.split('');
    returnword = ''
    index = 0;
    while (index < word.length) {
        nextchar = array[index];
        nextcharcounter = 1;
        index++
        while (array[index] == nextchar) {
            index++
            nextcharcounter++;
        }
        returnword = returnword + nextcharcounter + nextchar;
    }
    return returnword;
}

function executePart1(dataset) {
    let newword = dataset;
    for (i = 0; i < 40; i++) {
        newword = LookAndSee(newword);
        // if (i % 5 == 0) {
        //     console.log(newword.length);
        // }
    }
    return newword.length;
}

function executePart2(dataset) {
    let newword = dataset;
    for (i = 0; i < 50; i++) {
        newword = LookAndSee(newword);
        // if (i % 5 == 0) {
        //     console.log(newword.length);
        // }
    }
    return newword.length;
}

function execute() {
    const { performance } = require('perf_hooks');

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