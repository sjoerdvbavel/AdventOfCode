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

    return { door: parseInt(rawDataSet[0], 10), card: parseInt(rawDataSet[1], 10) };
}

function executeStep(value, subject){
    return (value * subject) % 20201227
}

function transform(subject, loopsize) {
    value = 1;
    for (i = 0; i < loopsize; i++) {
        value = executeStep(value, subject);
    }
    return value;
}
unitTest(transform(7, 8), '5764801');
unitTest(transform(7, 11), '17807724');

function executePart1(dataset) {
    let founddoor = false;
    let foundcard = false;
    let doorvalue = -1;
    let cardvalue = -1;
    let currentstep = 1;
    let answer = 1;
    let subject = 7;
    while (!founddoor || !foundcard) {
        answer = executeStep(answer, subject);
        if (answer == dataset.door) {
            founddoor = true;
            doorvalue = currentstep;
            console.log(`Found doorvalue: ${doorvalue} key: ${transform(dataset.card, doorvalue)}`);
        }
        if (answer == dataset.card) {
            foundcard = true;
            cardvalue = currentstep;
            console.log(`Found doorvalue: ${cardvalue} key: ${transform(dataset.card, doorvalue)}`);
        }
        currentstep++;
    }


    encryptionkey1 = transform(dataset.door, cardvalue);
    encryptionkey2 = transform(dataset.card, doorvalue);
    if (encryptionkey1 == encryptionkey2) {
        return encryptionkey2;
    } else {
        console.log(`Error: keys don't match doorkey,cardloop:${encryptionkey1} cardkey,doorloop:${encryptionkey2} `);
        console.log(`cardloop:${cardloop} doorloop:${doorloop} `);
        return -1;
    }
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