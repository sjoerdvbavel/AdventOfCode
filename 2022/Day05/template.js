function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n").map(a=>a.split("\r\n"));

    let stackCount = rawDataSet[0].pop().match(/[0-9]/g).length;
    let stacks = [];
    for(let i = 0; i< stackCount; i++){
        stacks.push([]);
    }
    for(row of rawDataSet[0].reverse()){
        for(let i = 0; i< stackCount; i++){
            let index = 1 + 4*i
            if(row[index] && row[index] != ' '){
                stacks[i].push(row[index]);
            }    
        }
    }
    let moves = [];
    for (line of rawDataSet[1]) {
        // eg: move 1 from 2 to 1
        let numbers = line.split(' ').map(a=>Number(a));
        moves.push({move: numbers[1], from: numbers[3], to: numbers[5] });
    }

    // console.log({moves: moves, stacks: stacks});
    return {moves: moves, stacks: stacks};
}

function executePart1(dataset) {
    let stacks = dataset.stacks.map(a=>a.slice());
    for(move of dataset.moves){
        for(let i = 0; i < move.move; i++){
            stacks[move.to-1].push(stacks[move.from-1].pop());
        }
    }
    return stacks.map(a=>a[a.length-1]).join('');
}

function executePart2(dataset) {
    let stacks = dataset.stacks.map(a=>a.slice());
    for(move of dataset.moves){
        let cratesToMove = stacks[move.from-1].slice(-move.move);
        //Remove from old stack
        stacks[move.from-1].splice(stacks[move.from-1].length - move.move, move.move);
        //Add to new stack
        stacks[move.to-1] = stacks[move.to-1].concat(cratesToMove);
    }
    return stacks.map(a=>a[a.length-1]).join('');
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