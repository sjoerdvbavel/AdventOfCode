function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\n");

    // console.log(rawDataSet.slice(0, 5));
    return rawDataSet;
}


function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

function getNextgen(line, prevline){
    let newline = line;
    let splits = 0
    for(let i = 1; i < line.length; i++){
        if(line[i] == '^' && prevline[i] == '|'){
            splits++;
            newline = setCharAt(newline, i-1, '|');
            newline = setCharAt(newline, i+1, '|');
        }else if(prevline[i] == '|' || prevline[i] == 'S'){   
            newline = setCharAt(newline, i, '|');
        }
    }
    // console.log('line: '+line);
    // console.log('lin0: ' + newline);
    return [newline, splits];
}

function executePart1(dataset) {
    //First line is always a copy, second line is generated with a mock prevline
    let outputlineOne = getNextgen(dataset[0], dataset[0]);
    let outputField = [dataset[0], outputlineOne[0]];
    let totalSplits = outputlineOne[1];
    let lastLine = outputlineOne[0];
    for (let gen = 1; gen < dataset.length; gen++) {
        let output = getNextgen(dataset[gen], lastLine)
        lastLine = output[0];
        totalSplits += output[1]
        outputField.push(lastLine);
    }
    // console.log('Final field:');
    // outputField.forEach((line) => console.log(line));
    return totalSplits;
}


function executePart2(dataset) {
    let maxGen = dataset.length;
    let maxLine = dataset[0].length
    function getNumberOfTimeLines(gen, index){
        // console.log(`checking out ${gen}. ${index}`);
        if(gen == maxGen) return 1;
        if(index == 0 || index == maxLine) return 1;
    
        while(dataset[gen][index] != '^'){
            gen++;
            if(gen == maxGen) return 1;
        }
        return getNumberOfTimeLines(gen, index-1) 
        + getNumberOfTimeLines(gen, index + 1);
    }
    let sIndex = dataset[0].indexOf('S')
    // console.log(`S at ${sIndex}`);
    return getNumberOfTimeLines(0, sIndex);    
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