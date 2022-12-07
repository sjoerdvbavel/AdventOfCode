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
        dataset.push(line.split(' '));
    }
    return dataset;
}

function executePart1(dataset) {
    let score = 0;
    for (game of dataset) {
        //Calculate my points
        let myPoints = 'XYZ'.indexOf(game[1]) + 1;
        score += myPoints;
        
        //Calculate my W/D points
        let finish = game.join('');
        if (finish == 'AY' || finish == 'BZ' || finish == 'CX') {
            score += 6;
        } else if (finish == 'AX' || finish == 'BY' || finish == 'CZ') {
            score += 3;
        }
    }
    return score;
}

function executePart2(dataset) {
    let score = 0;
    for (game of dataset) {
        //Calculate the points for my move
        let opponentMove = 'ABC'.indexOf(game[0]) + 1;
        let MyStatus = 'XYZ'.indexOf(game[1]);
        let myMove = opponentMove + MyStatus -1
        if(myMove <= 0){
            myMove += 3;
        } else if(myMove > 3){
            myMove -= 3;
        }
        //Calculate the points for the win:
        score += MyStatus * 3;
        // console.log(`${game} ${opponentMove} ${MyStatus} ${myMove}`);
        score += myMove;
    }

    return score;
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