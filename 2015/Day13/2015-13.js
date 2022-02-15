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

    let edges = [];
    let names = new Set();
    for (line of rawDataSet) {
        words = line.split(' ');
        names.add(words[0]);
        if (words[2] == 'gain') {
            edges.push({ start: words[0], end: words[10].slice(0, -1), weight: parseInt(words[3], 10) });
        } else {
            edges.push({ start: words[0], end: words[10].slice(0, -1), weight: -parseInt(words[3], 10) });
        }

    }

    return { names: Array.from(names), edges: edges };
}

function getHappiness(permutation, edges) {
    let totalHappiness = 0;
    for (let i = 0; i < permutation.length; i++) {
        let p1 = permutation[i];
        let p2 = permutation[(i + 1) % permutation.length];
        totalHappiness += edges.find(x => x.start == p1 && x.end == p2)?.weight ?? 0;
        totalHappiness += edges.find(x => x.start == p2 && x.end == p1)?.weight ?? 0;
    }
    return totalHappiness;
}

function getPermutations(toPlace, seated) {
    let pplToPlace = toPlace.slice();
    if (pplToPlace.length == 0) {
        return [seated];
    }
    let returnlist = [];
    for (let personindex in pplToPlace) {
        let before = pplToPlace.slice(0, personindex);
        let after = pplToPlace.slice(parseInt(personindex,10) + 1, pplToPlace.length);
        let otherlist = before.concat(after);
        returnlist = returnlist.concat(getPermutations(otherlist, seated.concat(pplToPlace[personindex])));
    }
    return returnlist;
}

function executePart1(dataset) {
    let perms =  getPermutations(dataset.names.slice(1, dataset.names.length), [dataset.names[0]]);
    let happiness = perms.map(x => getHappiness(x, dataset.edges));
    return Math.max(...happiness);
}

function executePart2(dataset) {
    let perms =  getPermutations(dataset.names.slice(), ['Sjoerd']);
    let happiness = perms.map(x => getHappiness(x, dataset.edges));
    return Math.max(...happiness);
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