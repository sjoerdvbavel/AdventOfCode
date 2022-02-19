const { off } = require('process');

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
        dataset.push(line.split('').map(x => x == '#'));
    }

    return dataset;
}

function getNB(field, x, y) {
    let nb = 0;
    for (xdif of [-1, 0, 1]) {
        for (ydif of [-1, 0, 1]) {
            if (xdif != 0 || ydif != 0) {
                nb += field[x + xdif]?.[y + ydif] ?1:0;
            }
        }
    }
    return nb;
}

function nextGen(field){
    let newfield = field.map(x => x.slice());

    for(let i = 0; i < field.length; i++){
        for(let j = 0; j < field[0].length; j++){
            let nb = getNB(field, i, j);
            newfield[i][j] =(field[i][j] && nb == 2) || nb ==3;
        }
    }
    return newfield;
}

function executePart1(dataset, steps) {
    let newfield = dataset.map(x => x.slice());
    for(let i = 0; i < steps; i++){
        newfield = nextGen(newfield);
        // for(row of newfield){
        //     console.log(row.map(x=> x?'#':'.').join(''));
        // }
    }
    return newfield.map(x => x.map(b=> b?1:0).reduce((a,b) => a+b)).reduce((a,b)=> a + b);
}

function lightcorners(newfield){
    newfield[0][0] = true;
    newfield[0][newfield.length-1] = true;
    newfield[newfield.length-1][0] = true;
    newfield[newfield.length-1][newfield.length-1] = true;
    return newfield;
}

function executePart2(dataset, steps) {
    let newfield = lightcorners(dataset.map(x => x.slice()));
    for(let i = 0; i < steps; i++){
        newfield = lightcorners(nextGen(newfield));        
        // console.log('-----')
        // for(row of newfield){
        //     console.log(row.map(x=> x?'#':'.').join(''));
        // }
    }
    return newfield.map(x => x.map(b=> b?1:0).reduce((a,b) => a+b)).reduce((a,b)=> a + b);
}

function execute() {
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1(testdata1, 4);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }

    let testdata2 = parseData('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart2(testdata2, 5);
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1(realdata1, 100);
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2, 100);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();