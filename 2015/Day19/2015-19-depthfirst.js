const { isGeneratorFunction } = require('util/types');

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

    let rules = [];
    for (line of rawDataSet[0].split("\r\n")) {
        let splits = line.split(' => ');
        // rules.push({replace:splits[0].toLowerCase(), by: splits[1].toLowerCase() });
        rules.push({ replace: splits[0], by: splits[1] });
    }

    return [rules, rawDataSet[1]];
}

function reduceMolecule(molecule, rules, set, maxlength) {
    for (rule of rules) {
        let finds = [...molecule.matchAll(new RegExp(rule.by, 'g'))].map(a => a.index)
        for (find of finds) {
            let pre = molecule.substring(0, find);
            let post = molecule.substring(find + rule.by.length, molecule.length);
            let newword = pre + rule.replace + post
            set.add((newword));
        }
    }
}
function getNext(startingMol, rules) {
    let newMols = new Set();

    for (rule of rules) {
        finds = [...startingMol.matchAll(new RegExp(rule.replace, 'g'))].map(a => a.index)
        for (find of finds) {
            let pre = startingMol.substring(0, find);
            let post = startingMol.substring(find + rule.replace.length, startingMol.length);
            newMols.add((pre + rule.by + post));
        }
    }
    // console.log(JSON.stringify(Array.from(newMols).slice(0,5)));
    return newMols;
}

function getPrev(startingMol, rules) {
    let newMols = new Set();

    for (rule of rules) {
        finds = [...startingMol.matchAll(new RegExp(rule.by, 'g'))].map(a => a.index)
        for (find of finds) {
            let pre = startingMol.substring(0, find);
            let post = startingMol.substring(find + rule.by.length, startingMol.length);
            newMols.add((pre + rule.replace + post));
        }
    }
    // console.log(JSON.stringify(Array.from(newMols).slice(0,5)));
    return newMols;
}
function executePart1(dataset) {
    let rules = dataset[0];
    let startingMol = dataset[1];

    return getNext(startingMol, rules).size;
}



//Return wether a word is worth exploring more, may be expanded
function isInteresting(word) {
    //'e' cannot be replaced by something else so eveything with e and length != 1 is a dead end.
    if (word.length > 1 && word.search('e') != -1) {
        return false;
    }
    return true;
}

function hasAr(word){
    return word.search('e') != -1;
}

//So since we are memory bound and we 
function exploreTreeRecursively(word, rules, exploredset, steps, ArFreeReported) {
    // console.log(`started exploring ${word}`);
    if (word == 'e') {
        return [true, 0, [word]];
    } else if (exploredset.has(word)) {
        return [false];
    }
    let newwords = getPrev(word, rules);
    for (let newword of newwords) {
        if (isInteresting(newword) && !exploredset.has(word)) {
            if(!ArFreeReported && !hasAr(newword)){
                console.log(`Ar-free word found: ${newword}, steps ${}, suggested total: `)
            let result = exploreTreeRecursively(newword, rules, exploredset, true);
            } else{
                let result = exploreTreeRecursively(newword, rules, exploredset, steps + 1, ArFreeReported);
            }
            // console.log(`explored ${newword}`);
            if (result[0]) {
                return [true, result[1] + 1, result[2].concat(word)];
            } else {
                exploredset.add(newword);
                if(exploredset.size % 1000000 == 0){
                    console.log(`${exploredset.size} currentword: ${newword}`);
                }
            }
        }
    }
    return [false];
}

function executePart2(dataset) {
    let rules = dataset[0];
    let start = dataset[1];
    let destination = 'e';
    let Molecules = new Set();

    let result = exploreTreeRecursively(start, rules, Molecules, 0, false);
    if (result[0]) {
        console.log(`Found solution, ${JSON.stringify(result[2])}`);
        return result[1];
    } else {
        console.log(`Search finished, no result found`);
    }
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
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();