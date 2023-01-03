const { wrap } = require('module');

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

    let dataset = [];
    for (line of rawDataSet[0].split("\r\n")) {
        dataset.push(line.split(''));
    }

    // console.log(dataset.slice(0, 5));
    return { instructions: rawDataSet[1], field: dataset };
}
//Return whether square (x,y) is valid in field.
function isValid(x, y, field) {
    return field[y] && field[y][x] && field[y][x] != ' ';
}

//Attempt 1 step in direction, where do I step to?
function GetCoordinates(x, y, direction, field, verbose) {
    let stepdir = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    let directStepX = x + stepdir[direction][0];
    let directStepY = y + stepdir[direction][1];
    if (isValid(directStepX, directStepY, field)) {
        //No wrap needed
        return [directStepX, directStepY];
    }
    //else: wrap around
    let newX = x;
    let newY = y;
    //Wrap around by stepping back till you bump in an edge.
    while (true) {
        let nextX = newX - stepdir[direction][0];
        let nextY = newY - stepdir[direction][1];
        if (!isValid(nextX, nextY, field)) {
            verbose && console.log(`Wrapped from ${x},${y} to ${newX},${newY} in direction ${direction}`);
            return [newX, newY];
        } else {
            newX = nextX;
            newY = nextY;
        }
    }
}



function executePart1(dataset, verbose) {
    let instructions = dataset.instructions.match(/(\d+|[RL])/g);
    let facing = 0; //L = 0, D = 1, R=2, U=3
    let currY = 0;
    let currX = dataset.field[0].findIndex(a => a[0] != ' ');
    verbose && console.log(`Start at ${currX}, ${currY}`);
    let maxX = Math.max(...dataset.field.map(a => a.length));

    for (let step of instructions) {
        if (!isNaN(Number(step))) {
            let number = Number(step);
            for (let i = 0; i < number; i++) {
                let newCoor = GetCoordinates(currX, currY, facing, dataset.field, verbose);
                if (dataset.field[newCoor[1]][newCoor[0]] == '#') {
                    //Do nothing, bumping in a wall                    
                } else {
                    //Just step
                    currX = newCoor[0];
                    currY = newCoor[1];
                }
            }
        } else if (step == 'L') {//instruction is a turn
            facing = (facing + 3) % 4;
        } else if (step == 'R') {
            facing = (facing + 1) % 4
        }
        verbose && console.log(`Moved to ${currX},${currY} direction ${facing}`);
    }

    console.log(`Steps finished row:${(currY + 1)} column: ${(currX + 1)} facing: ${facing}`);
    return 1000 * (currY + 1) + 4 * (currX + 1) + facing;
}

//Step on a cube, where do I step to?
//      1112222
//      1112222
//      1112222
//      333
//      333
//      333
//   444555
//   444555
//   444555
//   666
//   666
//   666
function GetCoordinates2(x, y, direction, field, verbose) {
    let stepdir = [[1, 0], [0, 1], [-1, 0], [0, -1]];
    let directStepX = x + stepdir[direction][0];
    let directStepY = y + stepdir[direction][1];
    if (isValid(directStepX, directStepY, field)) {
        //No wrap needed
        return { direction: direction, loc: [directStepX, directStepY] };
    }
    //else: wrap around
    let distX = x % 50;
    let distY = y % 50;
    let stepX = (x - distX) / 50
    let stepY = (y - distY) / 50
    let returnObject = {}
    if (direction == 0) {
        if (stepY == 0) {//Step right from 2
            verbose && console.log(`Step right from 2`);
            returnObject = { direction: 2, loc: [99, 50+ distY] };
        } else if (stepY == 1) {//Step right from 3
            verbose && console.log(`Step right from 3`);
            returnObject = { direction: 3, loc: [99, 100+ + distY] };
        } else if (stepY == 2) {//Step right from 5
            verbose && console.log(`Step right from 5`);
            returnObject = { direction: 2, loc: [50-distY, 149] };
        } else if (stepY == 3) {//Step right from 6
            verbose && console.log(`Step right from 6`);
            returnObject = { direction: 3, loc: [50 + distY, 149 ] };
        }
    } else if (direction == 1) {
        if (stepX == 0) {//Step down from 2
            verbose && console.log(`Step down from 2`);
            returnObject = { direction: 2, loc: [99, 50 + distX] };
        } else if (stepX == 1) {// Step down from 5
            verbose && console.log(`Step down from 5`);
            returnObject = { direction: 2, loc: [150 + distX, 50] };
        } else if (stepX == 2) {//Step down from 6
            verbose && console.log(`Step down from 6`);
            returnObject = { direction: 1, loc: [50 + distX, 100] };
        }
    } else if (direction == 2) {
        if (stepY == 0) {//Step left from 1
            verbose && console.log(`Step left from 1`);
            returnObject = { direction: 0, loc: [150 - distY, 0] };
        } else if (stepY == 1) {// Step left from 3
            verbose && console.log(`Step left from 3`);
            returnObject = { direction: 1, loc: [100, distY] };
        } else if (stepY == 2) {//Step left from 4
            verbose && console.log(`Step left from 4`);
            returnObject = { direction: 0, loc: [49 - distY, 50] };
        } else if (stepY == 3) {//Step left from 6
            verbose && console.log(`Step left from 6`);
            returnObject = { direction: 1, loc: [50 + distY, 0] };
        }
    } else if (direction == 3) {
        if (stepX == 0) {//Step up from 4
            verbose && console.log(`Step up from 4`);
            returnObject = { direction: 0, loc: [50 + distX, 50] };
        } else if (stepX == 1) {// Step up from 1
            verbose && console.log(`Step up from 1`);
            returnObject = { direction: 0, loc: [0, 150 + distX] };
        } else if (stepX == 2) {//Step up from 2
            verbose && console.log(`Step up from 2`);
            returnObject = { direction: 3, loc: [199, distX] };
        }
    }
    console.log(`Warped from ${[x,y]}(steps (${stepX},${stepY}), rem: ${distX} ${distY}) dir ${direction} to ${JSON.stringify(returnObject)}`);
    return returnObject;
}
//Step on a cube, where do I step to?
//      1112222
//      1112222
//      1112222
//      333
//      333
//      333
//   444555
//   444555
//   444555
//   666
//   666
//   666

function executePart2(dataset, verbose) {
    let instructions = dataset.instructions.match(/(\d+|[RL])/g);
    let facing = 0; //L = 0, D = 1, R=2, U=3
    let currY = 0;
    let currX = dataset.field[0].findIndex(a => a[0] != ' ');
    verbose && console.log(`Start at ${currX}, ${currY}`);
    let maxX = Math.max(...dataset.field.map(a => a.length));

    for (let step of instructions) {
        if (!isNaN(Number(step))) {
            let number = Number(step);
            for (let i = 0; i < number; i++) {
                let result = GetCoordinates2(currX, currY, facing, dataset.field, verbose);
                facing = result.direction
                let newloc = result.loc;
                if (dataset.field[newloc[1]][newloc[0]] == '#') {
                    //Do nothing, bumping in a wall                    
                } else {
                    //Just step
                    currX = newloc[0];
                    currY = newloc[1];
                }
            }
        } else if (step == 'L') {//instruction is a turn
            facing = (facing + 3) % 4;
        } else if (step == 'R') {
            facing = (facing + 1) % 4
        }
        false && console.log(`Moved to ${currX},${currY} direction ${facing}`);
    }

    console.log(`Steps finished row:${(currY + 1)} column: ${(currX + 1)} facing: ${facing}`);
    return 1000 * (currY + 1) + 4 * (currX + 1) + facing;
    return -1;
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1, true);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    // let testdata2 = parseData('testdata.txt');
    // var starttd2 = performance.now();
    // let testresult2 = executePart2(testdata2);
    // var endtd2 = performance.now();
    // if (testresult2) {
    //     console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    // }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1, false);
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2, true);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();