function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n");

    let dataset = [];
    for (line of rawDataSet) {
        numbers = line.match(/([\d]+)/g).map(x => parseInt(x, 10));
        let action = '';
        if (line[6] == 'n') {
            action = 'on';
        } else if (line[6] == 'f') {
            action = 'off';
        } else {
            action = 'toggle';
        }
        dataset.push({
            action: action,
            x: [numbers[0], numbers[2]],
            y: [numbers[1], numbers[3]]
        });
    }

    return dataset;
}

function executePart1(dataset) {
    N = 1000;
    let grid = [];
    for (i = 0; i < N; i++) {
        grid.push(new Array(N).fill(0));
    }
    for (instruction of dataset) {
        for (ycor = instruction.y[0]; ycor <= instruction.y[1]; ycor++) {
            for (xcor = instruction.x[0]; xcor <= instruction.x[1]; xcor++) {
                if (instruction.action == 'on') {
                    grid[ycor][xcor] = 1
                } else if (instruction.action == 'off') {
                    grid[ycor][xcor] = 0;
                } else if (instruction.action == 'toggle') {
                    grid[ycor][xcor] = grid[ycor][xcor] == 1 ? 0 : 1;
                }
            }
        }
    }
    let totallights = grid.reduce((a,b)=> a+b.reduce((a,b) => a+b,0),0);
    return totallights;
}

function executePart2(dataset) {

    N = 1000;
    let grid = [];
    for (i = 0; i < N; i++) {
        grid.push(new Array(N).fill(0));
    }
    for (instruction of dataset) {
        for (ycor = instruction.y[0]; ycor <= instruction.y[1]; ycor++) {
            for (xcor = instruction.x[0]; xcor <= instruction.x[1]; xcor++) {
                if (instruction.action == 'on') {
                    grid[ycor][xcor] += 1
                } else if (instruction.action == 'off') {
                    grid[ycor][xcor] = Math.max(0, grid[ycor][xcor]-1);
                } else if (instruction.action == 'toggle') {
                    grid[ycor][xcor] += 2;
                }
            }
        }
    }
    let totallights = grid.reduce((a,b)=> a+b.reduce((a,b) => a+b,0),0);
    return totallights;
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