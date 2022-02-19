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
        numbers = line.match(/[\-0-9]+/g).map(x => parseInt(x, 10));
        dataset.push(numbers);
    }
    return dataset;
}

function calcScore(recipe, matrix){
    product = 1;
    for(let i = 0; i<matrix[0].length; i++){
        values = matrix.map(x => x[i]);
        let sum = 0
        for(let j = 0; j< values.length; j++){
            sum += values[j]*recipe[j];
        }
        if(sum <= 0 ){
            return 0;
        }
        product *= sum;
    }
    return product;
}
function getSums(toDistrubute, handsLeft) {
    if(handsLeft == 1){
        return [[toDistrubute]];
    } else if(toDistrubute == 0){
        return new Array(handsLeft).fill([0]);
    }
    let returnhands = [];
    for(let firsthand = 0; firsthand <= toDistrubute; firsthand++){
        let otherhands = getSums(toDistrubute-firsthand, handsLeft- 1);
        returnhands = returnhands.concat(otherhands.map(x => [firsthand, ...x]));
    }
    return returnhands;
}

function calcScore(array, weights){
    let returnproduct = 1;
    for(let i = 0; i< weights[0].length; i++){
        let sum = 0;
        for(a in array){
            sum += array[a]*weights[a][i];
        }
        if(sum <= 0){
            return 0;
        } else{
            returnproduct *= sum;
        }
    }
    return returnproduct;
}

function findMax(array){
    let max = -1;
    for(a of array){
        max = a > max?a:max;
    }
    return max;
}

function executePart1(dataset) {
    let numbersnocals = dataset.map(x => x.slice(0, x.length-1));
    let options = getSums(100, dataset.length);
    let scores = options.map(x=>calcScore(x, numbersnocals));
    // return Math.max(...scores);
    return findMax(scores);
}

function has500Cals(values, cals){
    let sum = 0;
    for(a in values){
        sum += values[a]*cals[a];
    }
    return sum == 500;
}

function executePart2(dataset) {
    let numbersnocals = dataset.map(x => x.slice(0, x.length-1));
    let cals = dataset.map(x => x[x.length-1]);
    let options = getSums(100, dataset.length);
    let validOptions = options.filter(x => has500Cals(x, cals));
    let scores = validOptions.map(x=>calcScore(x, numbersnocals));

    return findMax(scores);
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
    } else {
        console.log(`No result1, Guus heeft gelijk.`);
    }

    let realdata2 = parseData('data.txt');
    var startd2 = performance.now();
    let result2 = executePart2(realdata2);
    var endd2 = performance.now();
    if (result2) {
        console.log(`part2: ${result2} (${Math.round(endd2 - startd2)} ms)`);
    }else {
        console.log(`No result2, Guus heeft gelijk.`);
    }
}

execute();