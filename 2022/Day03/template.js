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

    dataset.push([line.slice(0, line.length/2), line.slice(line.length/2, line.length), line]);
    }

    return dataset;
}
function getCharvalue(letter){
    if(letter.match(/[a-z]/)){
        return  letter.charCodeAt()-64 - 32;
    } else{
        return letter.charCodeAt()- 71 + 33;
    }
}
function executePart1(dataset) {
    let priorities = 0;
    for(rucksack of dataset){
        let items = [];
        for(item of rucksack[0]){
            if(rucksack[1].includes(item)){
                items.push(item);
            }
        }
        for(commonItem of new Set(items)){
            value = getCharvalue(commonItem)
            priorities += value
            // console.log(`${commonItem} ${value}`);
        }
    }
    return priorities;
}
function getOverlap(strings){
    let overlap = strings.pop();
    for(string of strings){
        overlap = overlap.filter(a => string.includes(a));
    }
    return [...new Set(overlap)];
}
function executePart2(dataset) {
    let badgevalues = 0;
    for(let i =0; i < dataset.length/3; i++){
        let lines = dataset.slice(3*i, 3*i+3).map(a => a[2].split(''));
        let overlap = getOverlap(lines);
        let value = getCharvalue(overlap[0]);        
        badgevalues += value;
        // console.log(`${overlap} ${value}`);
    }
    return badgevalues;
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