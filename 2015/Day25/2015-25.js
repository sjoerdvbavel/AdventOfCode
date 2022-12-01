function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function nextNumber(integer) {
    return (integer * 252533) % 33554393;
}

function getIndex(row, column) {
    //So get the column the diagional starts on:
    let a = column + row - 1;

    //Get the index of the first number on that diagonal.
    //Column    1   2   3   4   5   6   7
    //Index     1   2   4   7   11  16  22 
    //This is 1 + ... + (a-1) + 1
    let b = a * (a - 1) / 2 + 1;

    // And then do row steps to get to the right number:
    return b + column - 1;
}
unitTest(getIndex(1, 1), 1);
unitTest(getIndex(3, 2), 8);
unitTest(getIndex(2, 3), 9);
unitTest(getIndex(1, 6), 21);
unitTest(getIndex(6, 1), 16);

function getCode(row, column) {
    let number = getIndex(row, column);
    let nextvalue = 20151125;
    for (let i = 1; i < number; i++) {
        nextvalue = nextNumber(nextvalue);
    }
    return nextvalue;
}
unitTest(getCode(1, 1), 20151125);
unitTest(getCode(3, 2), 8057251);
unitTest(getCode(2, 3), 16929656);
unitTest(getCode(1, 6), 33511524);
unitTest(getCode(6, 6), 27995004);

function executePart1(dataset) {
    //Skipping the parsing for this.
    let row = 3010;
    let column = 3019;

    return getCode(row, column);
}

function execute() {
    const { performance } = require('perf_hooks');

    // let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1();
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }
}

execute();