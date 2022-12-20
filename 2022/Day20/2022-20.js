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
        dataset.push(Number(line));
    }
    // console.log(dataset.slice(0, 5));
    return dataset;
}

function mix(objectArray, mixorder){
    let n = objectArray.length;
    for (object of mixorder) {//Hopefully the array is sliced but references the unique objects.
        let index = objectArray.findIndex(a => a === object);

        let newIndex = -1;
        if (index + object.value <= 0) { //Subtract one to go from 1 to n-1
            newIndex = (index + object.value + n - 1) % (n - 1);
        } else if(index + object.value >= n) { //Add one to go from n-1 to 1
            newIndex = (index + object.value) % (n - 1);
        } else {
            newIndex = (index + object.value) % (n - 1);
        }
        objectArray.splice(index, 1);
        objectArray.splice(newIndex, 0, object);
    }
}


function executePart1(dataset) {
    let n = dataset.length;
    let objectArray = [];
    for (item of dataset) {
        objectArray.push({ value: item });
    }
    mix(objectArray, objectArray.slice());
    let ZeroIndex = objectArray.findIndex(a => a.value == 0);
    let grove = [objectArray[(ZeroIndex + 1000) % n].value, objectArray[(ZeroIndex + 2000) % n].value, objectArray[(ZeroIndex + 3000) % n].value]
    console.log(`Grove coodinates: ${grove}`);
    return grove.reduce((a,b) => a+b, 0);
}

function executePart2(dataset) {
    let decryptionkey = 811589153;
    let newSet = dataset.map(a=> a*decryptionkey);
    let objectArray = [];
    for (item of newSet) {
        objectArray.push({ value: item });
    }
    let originalOrder = objectArray.slice();
    for(let i = 0; i < 10; i++){
        mix(objectArray, originalOrder);
        // console.log(`After ${i+1} rounds of mixing:   
        // ${objectArray.map(a => a.value)}`);
    }

    let n = dataset.length;
    let ZeroIndex = objectArray.findIndex(a => a.value == 0);
    let grove = [objectArray[(ZeroIndex + 1000) % n].value, objectArray[(ZeroIndex + 2000) % n].value, objectArray[(ZeroIndex + 3000) % n].value]
    console.log(`Grove coodinates: ${grove}`);
    return grove.reduce((a,b) => a+b, 0);
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