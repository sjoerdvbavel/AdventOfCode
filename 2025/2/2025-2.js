function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split(",");

    let dataset = [];
    for (line of rawDataSet) {

    dataset.push(line.split('-').map(x => Number(x)));
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}

function isValidId(number){
    let string = number + '';
    if(string.length % 2 != 0){
        return true;
    }
    let halfLength = string.length / 2
    return string.substring(0, halfLength) != string.substring(halfLength);
}

function executePart1(dataset) {
    let inValidIds = []
    for (range of dataset) {
        for (let x = range[0]; x < range[1]; x++) {
            if(!isValidId(x)){
                inValidIds.push(x);
                // console.log(`invalid id; ${x}`);
            }
        }
    }
    return [...new Set(inValidIds)].reduce((a,b) => a+b, 0);
}

function isRepeatedSection(section, remainder){
    // console.log(`isRepeatedSection ${section}, ${remainder}`);
    if(section == remainder){
        return true;
    } else if(section == remainder.substring(0, section.length)){
        return isRepeatedSection(section, remainder.substring(section.length))
    } else {
        return false;
    }
}

function isRepeatingId(number){
    let string = number + '';
    for(sectionLength of [1, 2, 3, 4, 5]){//Longest id is 10
        if(string.length % sectionLength == 0){
            if(isRepeatedSection(string.substring(0, sectionLength), string.substring(sectionLength))){
                return true
            }
        }
    }
    return false;
}

function executePart2(dataset) {
    let longestNumber = Math.max(...dataset.map(x => x[1]))
    console.log(`longest number ${longestNumber}, ${(longestNumber + '').length} characters`)


    let inValidIds = []
    for (range of dataset) {
        // console.log(`Testing range ${range[0]}-${range[1]}`);
        for (let x = range[0]; x <= range[1]; x++) {
            if(isRepeatingId(x)){
                inValidIds.push(x);
                // console.log(`invalid id; ${x}`);
            }
        }
    }
    return [...new Set(inValidIds)].reduce((a,b) => a+b, 0);
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