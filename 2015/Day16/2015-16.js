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
        //Sue 2: akitas: 10, perfumes: 10, children: 5
        //Remove ':' and ','
        cleanline = line.split(',').join('').split(':').join('');
        //Split and parse
        splits = cleanline.split(' ').map(y => isNaN(y) ? y : parseInt(y, 10));
        let newobject = { 'sue': splits[1] }
        newobject[splits[2]] = splits[3];
        newobject[splits[4]] = splits[5];
        newobject[splits[6]] = splits[7];
        dataset.push(newobject);
    }

    return dataset;
}
function executePart1(dataset) {
    attributes = ['children', 'cats', 'samoyeds', 'pomeranians', 'akitas', 'vizslas', 'goldfish', 'trees', 'cars', 'perfumes'];
    realsue = { 'children': 3, 'cats': 7, 'samoyeds': 2, 'pomeranians': 3, 'akitas': 0, 'vizslas': 0, 'goldfish': 5, 'trees': 3, 'cars': 2, 'perfumes': 1 };
    filteredSues = dataset;
    for (attribute of Object.keys(realsue)) {
        let sueValue = realsue[attribute];
        filteredSues = filteredSues.filter(x => x[attribute] == undefined ||  x[attribute] == sueValue);

        console.log(`Filtered on ${attribute}: ${filteredSues.length} sues left.`);
    }

    return filteredSues[0].sue;
}

function executePart2(dataset) {
    attributes = ['children', 'cats', 'samoyeds', 'pomeranians', 'akitas', 'vizslas', 'goldfish', 'trees', 'cars', 'perfumes'];
    realsue = { 'children': 3, 'cats': 7, 'samoyeds': 2, 'pomeranians': 3, 'akitas': 0, 'vizslas': 0, 'goldfish': 5, 'trees': 3, 'cars': 2, 'perfumes': 1 };
    filteredSues = dataset;
    for (attribute of Object.keys(realsue)) {
        let sueValue = realsue[attribute];
        if (attribute == 'cats' || attribute == 'trees') {
            filteredSues = filteredSues.filter(x => x[attribute] == undefined || x[attribute] > sueValue);
        } else if (attribute == 'pomeranians' || attribute == 'goldfish') {
            filteredSues = filteredSues.filter(x => x[attribute] == undefined || x[attribute] < sueValue);
        } else {
            filteredSues = filteredSues.filter(x => x[attribute] == undefined || x[attribute] == sueValue);
        }

        console.log(`Filtered on ${attribute}: ${filteredSues.length} sues left.`);
    }
    console.log(JSON.stringify(filteredSues));
    return filteredSues[0].sue;
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