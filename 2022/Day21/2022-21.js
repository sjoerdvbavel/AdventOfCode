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
        let split1 = line.split(': ');
        let split2 = split1[1].split(' ');
        if (split2.length > 1) {
            dataset.push({ name: split1[0], type: split2[1], par1: split2[0], par2: split2[2] });
        } else {
            dataset.push({ name: split1[0], type: 'value', value: Number(split2[0]) });
        }
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}

function resolveValue(itemName, list) {
    let item = list.find(a => a.name == itemName);
    if (item.type == 'value') return item.value;

    let item1 = resolveValue(item.par1, list);
    if (item1 == 'invalid') return 'invalid';
    let item2 = resolveValue(item.par2, list);
    if (item2 == 'invalid') return 'invalid';
    if (item.type == '+') {
        if (Number.isInteger(item1) && Number.isInteger(item2)) return item1 + item2;
        return `(${item1} + ${item2})`
    } else if (item.type == '-') {
        if (Number.isInteger(item1) && Number.isInteger(item2)) return item1 - item2;
        return `(${item1} - ${item2})`
    } else if (item.type == '*') {
        if (Number.isInteger(item1) && Number.isInteger(item2)) return item1 * item2;
        return `(${item1} * ${item2})`
    } else if (item.type == '/') {
        if (Number.isInteger(item1) && Number.isInteger(item2)) {
            let divide = item1 / item2;
            if (divide % 1 != 0) console.log(`Divide ${item1} by ${item2} is not integer`);
            return divide;
        }
        return `(${item1}/${item2})`;
    } else if (item.type == '=') {
        return `${item1} == ${item2}`;
    }
}

function executePart1(dataset) {
    return resolveValue('root', dataset);
}

function executePart2(dataset) {
    rootItem = dataset.find(a => a.name == 'root');
    rootItem.type = '='
    humnItem = dataset.find(a => a.name == 'humn');
    let i = 0;
    // while (i < 10 ** 10) {//while solution not found;
    humnItem.value = 'a';
    console.log(resolveValue('root', dataset));
    // solved equation using https://www.mathpapa.com/equation-solver/ ... cos i'm lazy.
    console.log(`Check answer:`);
    humnItem.value = 3099532691300;
    console.log(resolveValue('root', dataset));
    
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