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
        let numbers = line.split(' -> ').map(a => a.split(',').map(b => Number(b)));
        dataset.push(numbers);
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}

function isEmpty(row, column, field) {
    return field[row] && field[row][column] && field[row][column] == '.';
}

function dropSand(field, source, verbose) {
    let droplocation = source;
    let returnobject = { atBottom: false , atSource: false};
    if(field[source[0]][source[1]] == 'o'){
        verbose && console.log(`atSource ${source}`);
        returnobject.atSource = true;
        return returnobject;
    }
    while (true) {
        if (droplocation[0] == field.length-1) {
            verbose && console.log(`Drop reached below field at ${droplocation}`);
            returnobject.atBottom = true;
        } else if (droplocation[1] < 0) {
            verbose && console.log(`Drop reached left of field at ${droplocation}`);
            return 'error';
        }
        if (isEmpty(droplocation[0]+1, droplocation[1], field)) {//Fall below
            droplocation[0]++;
        } else if (isEmpty(droplocation[0] + 1, droplocation[1] - 1, field)) {//Fall to left
            droplocation[0]++;
            droplocation[1] -= 1;
        } else if (isEmpty(droplocation[0] + 1, droplocation[1] + 1, field)) {//Fall to right
            droplocation[0]++;
            droplocation[1] += 1;
        } else {//stopped
            field[droplocation[0]][droplocation[1]] = 'o';
            verbose && console.log(`Drop stopped at ${droplocation}`);
            return returnobject;
        }
    }
}

function drawField(dataset, padding){
    let Flatdataset = dataset.flat();
    let maxColumn = Math.max(...Flatdataset.map(a => a[0])) + padding;
    let minColumn = Math.min(...Flatdataset.map(a => a[0])) - padding;
    let maxRow = Math.max(...Flatdataset.map(a => a[1])) + 1;
    let minRow = 0;

    console.log(`Box is ${minColumn} - ${maxColumn} by ${minRow} - ${maxRow}`);



    let ColumnLim = maxColumn - minColumn;
    let RowLim = maxRow - minRow;
    let field = [];
    for (let y = 0; y <= RowLim; y++) {
        let row = [];
        for (let x = 0; x <= ColumnLim; x++) {
            row.push('.');
        }
        field.push(row);
    }

    //Fill the walls:
    for (wallset of dataset) {
        // let wallset = dataset[wallsetIndex];
        let current = wallset[0];
        for (let i = 0; i < wallset.length - 1; i++) {
            let lastPoint = wallset[i];
            let nextPoint = wallset[i + 1];
            let ColumnDirection = lastPoint[0] == nextPoint[0] ? 0 : lastPoint[0] > nextPoint[0] ? -1 : 1;
            let RowDirection = lastPoint[1] == nextPoint[1] ? 0 : lastPoint[1] > nextPoint[1] ? -1 : 1;
            field[current[1] - minRow][current[0] - minColumn] = '#'
            while (current[0] != nextPoint[0] || current[1] != nextPoint[1]) {
                current[0] += ColumnDirection;
                current[1] += RowDirection;
                field[current[1] - minRow][current[0] - minColumn] = '#'
            }
        }
    }
    return [field, minColumn];
}

function executePart1(dataset) {
    let padding = 5;
    let returnobject = drawField(dataset, padding);
    let field = returnobject[0];
    let minColumn = returnobject[1];
    let Finished = false;
    let i = 0;
    while(!Finished) {
        result = dropSand(field, [0, 500 - minColumn], false);
        Finished = result.atBottom;
        if (!Finished) {
            i++;
        }
    }

    for (row of field) {
        console.log(row.join(''));
    }
    return i;
}

function executePart2(dataset) {
    let padding = 200;
    let returnobject = drawField(dataset, padding);
    let field = returnobject[0];
    let minColumn = returnobject[1];    
    let Finished = false;
    let i = 0;
    while(!Finished) {
        result = dropSand(field, [0, 500 - minColumn], false);
        Finished = result.atSource;
        if (!Finished) {
            i++;
        }
    }

    for (row of field) {
        console.log(row.join(''));
    }
    return i;
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