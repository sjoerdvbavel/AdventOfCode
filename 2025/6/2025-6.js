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

    let numbers = [];
    for (line of rawDataSet.slice(0, -1)) {
        numbers.push(line.trim().split(/\s+/).map(x => Number(x)));
    }
    let operators = rawDataSet[rawDataSet.length-1].split(/\s+/);
    let output = []
    let n = numbers[0].length;
    for(let i = 0; i < n; i++){
        output.push({operator: operators[i], values: numbers.map(x => x[i])})
    }
    console.log(output.slice(0, 5));
    return output;
}

function parseDataPartTwo(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\n");

    let output = [];
    let n = rawDataSet[0].length;
    let numbers = [];
    let operator = '';
    for(let i = 0; i < n; i++){
        if(rawDataSet[rawDataSet.length-1][i] != ' '){
            if(operator != ''){ //Skip the first time
                output.push({operator: operator, values: numbers.slice(0, -1)});
            }
            operator = rawDataSet[rawDataSet.length-1][i];
            numbers = [];
        }
        numberString = rawDataSet.map(x => x[i]).slice(0, -1).filter(x => !!x).join('');
        // console.log(`${rawDataSet.map(x => x[i])} number: ${numberString}`);
        numbers.push(Number(numberString));
    }
    //Get the last one
    output.push({operator: operator, values: numbers});

    
    console.log(output.slice(0, 5));
    return output;
}


function executePart1and2(dataset) {
    let answers = 0;    
    for(sum of dataset){
        let answer = 0;
        if(sum.operator == '+'){
            answer = sum.values.reduce((a,b)=> a+b, 0);
        } else{
            answer = sum.values.reduce((a,b)=> a*b, 1);
        }
        answers += answer;
        // console.log(`${JSON.stringify(sum)} = ${answer}`);
    }
    return answers;
}

function execute(){ 
    const { performance } = require('perf_hooks');

    let testdata1 = parseData('testdata.txt');
    var starttd1 = performance.now();
    let testresult1 = executePart1and2(testdata1);
    var endtd1 = performance.now();
    if (testresult1) {
        console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    }
    
    let testdata2 = parseDataPartTwo('testdata.txt');
    var starttd2 = performance.now();
    let testresult2 = executePart1and2(testdata2);
    var endtd2 = performance.now();
    if (testresult2) {
        console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    }

    let realdata1 = parseData('data.txt');
    var startd1 = performance.now();
    let result1 = executePart1and2(realdata1);
    var endd1 = performance.now();
    if (result1) {
        console.log(`part1: ${result1} (${Math.round(endd1 - startd1)} ms)`);
    }

    let realdata2 = parseDataPartTwo('data.txt');
    var startd2 = performance.now();
    let result2 = executePart1and2(realdata2);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }
}

execute();