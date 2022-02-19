function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

    let rules = [];
    for (line of rawDataSet[0].split("\r\n")) {
        let splits = line.split(' => ');
        // rules.push({replace:splits[0].toLowerCase(), by: splits[1].toLowerCase() });
        rules.push({replace:splits[0], by: splits[1] });
    }

    return [rules, rawDataSet[1]];
}

function executePart1(dataset) {
    let rules = dataset[0];
    let startingMol = dataset[1];
    let newMols = new Set();

    for(rule of rules){
        finds = [...startingMol.matchAll(new RegExp(rule.replace, 'gi'))].map(a => a.index)
        for(find of finds){
            let pre = startingMol.substring(0, find);
            let post = startingMol.substring(find + rule.replace.length, startingMol.length);
            let beforelength = newMols.size;
            newMols.add((pre + rule.by + post).toLowerCase());

            if(beforelength != newMols.size){
                console.log(`Replaced ${rule.replace} with ${rule.by} at ${find} result was new.`)
            } else{
                console.log(`Replaced ${rule.replace} with ${rule.by} at ${find} result was old.`)
            } 
            if(startingMol.length - rule.replace.length + rule.by.length != (pre + rule.by + post).length){
                console.log(`Error, lengths don't match. ${startingMol.length - rule.replace.length + rule.by.length} != ${(pre + rule.by + post).length}`);
            }
        }
    }
    console.log(JSON.stringify(Array.from(newMols).slice(0,5)));
    return newMols.size;
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