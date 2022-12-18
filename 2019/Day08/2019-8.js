const { count } = require('console');

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString();

    let layers = [];
    let n = rawDataSet.length / (25 * 6);
    for (let i = 0; i < n; i++) {
        layers.push(rawDataSet.substring(i * 25 * 6, i * 25 * 6 + 25 * 6));
    }
    return layers

}

function countChar(string, target) {
    return string.split('').filter(a => a == target).length;
}

function executePart1(dataset) {
    min = Infinity;
    let minLayer = 0;
    for (layer of dataset) {
        let count = countChar(layer, '0');
        if (count < min) {
            min = count;
            minLayer = layer;
        }
    }
    // console.log(`Min ${min} at layer ${minLayer}`);
    return countChar(minLayer, '1') * countChar(minLayer, '2');
}

function PrintLayer(layer) {
    for (let i = 0; i < 6; i++) {
        console.log(layer.substring(i * 25, i * 25 + 25));
    }
}

function executePart2(dataset) {
    let completeLayer = '';
    for(pixelIndex in dataset[0]){
        let layer = 0;
        while(dataset[layer][pixelIndex] == '2'){
            layer++;
        }
        completeLayer += dataset[layer][pixelIndex]=='1'?'█':'░';
    }
    PrintLayer(completeLayer);
    return 1;
}

function execute() {
    const { performance } = require('perf_hooks');

    // let testdata1 = parseData('testdata.txt');
    // var starttd1 = performance.now();
    // let testresult1 = executePart1(testdata1);
    // var endtd1 = performance.now();
    // if (testresult1) {
    //     console.log(`testdata part1: ${testresult1} (${Math.round(endtd1 - starttd1)} ms)`);
    // }

    // let testdata2 = parseData('testdata.txt');
    // var starttd2 = performance.now();
    // let testresult2 = executePart2(testdata2);
    // var endtd2 = performance.now();
    // if (testresult2) {
    //     console.log(`testdata part2: ${testresult2} (${Math.round(endtd2 - starttd2)} ms)`);
    // }

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