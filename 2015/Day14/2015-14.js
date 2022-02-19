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

    let dataset = [];
    for (line of rawDataSet) {
        numbers = line.match(/[0-9]+/g).map(x => parseInt(x, 10));
        words = line.split(' ');
        dataset.push({ name: words[0], speed: numbers[0], endurance: numbers[1], rest: numbers[2] });
    }

    return dataset;
}

function getDistance(reindeer, duration){
    let remaining = duration;
    let distance = 0;
    while(remaining >= 0){
        distance += Math.min(remaining, reindeer.endurance)*reindeer.speed;
        remaining -= reindeer.endurance;
        remaining -= reindeer.rest;
    }
    return distance;
}


function executePart1(dataset, raceduration) {
    let dists = dataset.map(x => getDistance(x, raceduration));
    return Math.max(...dists);
}

function executePart2(dataset, raceduration) {
    for(animal of dataset){
        animal.score = 0;
    }

    for(let i = 1; i <= raceduration; i++){
        let fastest = -1;
        let winners = [];
        for(animal of dataset){
            let animaldist = getDistance(animal, i);
            if(animaldist > fastest){
                winners = [animal];
                fastest = animaldist;
            } else if(animaldist == fastest){
                winners.push(animal);
            }
        }
        for(winner of winners){
            winner.score++;
        }
    }
    return Math.max(...dataset.map(x => x.score));
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1, 1000);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    let testdata2 = parseData('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart2(testdata2, 1000);
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1, 2503);
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2, 2503);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();