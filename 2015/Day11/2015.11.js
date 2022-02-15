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

function nextChar(char) {
    if (char == 'z') {
        return 'a'
    } else if (char == 'h') {
        return 'j'
    } else if (char == 'n') {
        return 'p'
    } else if (char == 'k') {
        return 'm'
    } else {
        return String.fromCharCode(char.charCodeAt(0) + 1);
    }
}

function Increment(word) {
    wordsplit = word.split('');
    index = wordsplit.length -1;
    wordsplit[index] = nextChar(wordsplit[index]);
    let lastincrementedletter = wordsplit[index];
    while (lastincrementedletter == 'a' && index >= 0) {
        index--;
        wordsplit[index] = nextChar(wordsplit[index]);
        lastincrementedletter = wordsplit[index];
    }
    return wordsplit.join('');
}

function checkWord(word) {
    let letters = word.split('');
    let charcodes = letters.map(x => x.charCodeAt(0));
    
    let hasStair = false;
    let hasPairs = false;
    let pairs = new Set();
    for (letter = 0; letter < letters.length-1; letter++) {
        //Check illegal character
        if (letters[letter] == 'i' || letters[letter] == 'o' || letters[letter] == 'l') {
            return false;
        }

        //Check stair
        if (charcodes[letter] + 1 == charcodes[letter + 1]
            && charcodes[letter] + 2 == charcodes[letter + 2]) {
            hasStair = true;
        }

        //Capture pairs
        if (charcodes[letter] == charcodes[letter + 1]) {
            pairs.add(charcodes[letter]);
            if (pairs.size >= 2) {
                hasPairs = true;
            }
        }
    }
    return hasStair && hasPairs;
}

function executePart1(dataset) {
    word = dataset;
    while(true){
        word = Increment(word);
        if(checkWord(word)){
            return word;
        }
    }
}

function executePart2(dataset) {
    oldnextpassword = executePart1(dataset);
    return executePart1(oldnextpassword);
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
    if (testresult2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();