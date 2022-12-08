function unitTest(result, stringvalue) {
    if (String(result) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(result)} != ${stringvalue}`);
    }
}


function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString();

    let dataset = rawDataSet.split(',').map(x => Number(x));
    return dataset;
}

function getDigit(number, digit){
    let attempt = (number + '').split('').reverse()[digit];
    return Number(attempt?attempt:0);
}

unitTest(getDigit(1002, 2), '0');
unitTest(getDigit(1002, 3), "1");
unitTest(getDigit(1002, 4), '0');


function ExecuteStep(array, input){
    var position = 0;
    var outputs = [];
    var program = array[position];
    // console.log(array);
    while(array[position] != 99){
        
        var program = array[position],
            opcode = program % 100;
            OpmodeA = getDigit(program, 4),
            OpmodeB = getDigit(program, 3),
            OpmodeC = getDigit(program, 2),
            parOne =     !OpmodeC?array[position + 1]:array[array[position + 1]],
            parTwo =     !OpmodeB?array[position + 2]:array[array[position + 2]],
            parThree =   !OpmodeA?array[position + 3]:array[array[position + 3]];
            console.log(`${program} Opmodes:${OpmodeA} ${OpmodeB} ${OpmodeC} values: ${parOne} ${parTwo} ${parThree}`);
            if(opcode == 1){
            array[parThree] = parOne + parTwo;
            console.log(`wrote sum ${array[parThree]} to ${parThree}`);
            position += 4;
        } else if(opcode == 2){
            array[parThree] = parOne * parTwo;
            console.log(`wrote product ${array[parThree]} to ${parThree}`);
            position += 4;
        } else if(opcode == 3){
            array[parOne] = input;
            position += 2;
            console.log(`wrote input ${input} to ${parOne}`);
        } else if(opcode == 4){
            outputs.push(array[parOne]);
            console.log(`Output ${array[parOne]} from ${parOne}`);
            position += 2;
        } else {
            console.log("Error " + opcode);
            return array;
        }
    }
    return outputs;
}

unitTest(executePart1([3,0,4,0,99]), "1");
unitTest(executePart1([3,0,4,0,99]), "1");


function executePart1(dataset) {
    return ExecuteStep(dataset, 1);
}

function executePart2(dataset) {

    return -1;
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