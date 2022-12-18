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

    let dataset = [];
    for (monkey of rawDataSet) {
        let lines = monkey.split('\r\n');
        dataset.push({
            id: Number(lines[0].match(/[\d]+/)[0]),
            items: lines[1].split(': ')[1].split(', ').map(a => Number(a)),
            operation: lines[2].split(': ')[1],
            test: Number(lines[3].match(/[\d]+/)[0]),
            ifTrue: Number(lines[4].match(/[\d]+/)[0]),
            ifFalse: Number(lines[5].match(/[\d]+/)[0]),
            inspections: 0
        });
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}

function applyOperation(operation, initiallevel) {
    let terms = operation.split(' ');
    let value = terms[4] == 'old' ? initiallevel : Number(terms[4]);
    if (terms[3] == '*') {
        return initiallevel * value;
    } else if (terms[3] == '+') {
        return initiallevel + value;
    }
}
unitTest(applyOperation('new = old + 3', 3), '6');
unitTest(applyOperation('new = old * old', 3), '9');
unitTest(applyOperation('new = old * 19', 79), '1501');


function executePart1(dataset) {
    for (let round = 1; round <= 20; round++) {
        for (monkey of dataset) {
            // console.log(`Monkey ${monkey.id}`);
            for (item of monkey.items) {
                let newWorry = Math.floor(applyOperation(monkey.operation, item) / 3);
                let testOutcome = newWorry % monkey.test == 0
                if (testOutcome) {
                    let targetIfTrue = dataset.find(a => a.id == monkey.ifTrue)
                    targetIfTrue.items.push(newWorry);
                    // console.log(`Items with worry ${newWorry} is passed to ${targetIfTrue.id}`);
                } else {
                    let targetIfFalse = dataset.find(a => a.id == monkey.ifFalse)
                    targetIfFalse.items.push(newWorry);
                    // console.log(`Items with worry ${newWorry} is passed to ${targetIfFalse.id}`);
                }
                monkey.inspections++;
            }
            monkey.items = [];
        }
        // console.log(`After round ${round}`);
        // for(monkey of dataset) console.log(`Monkey ${monkey.id}: ${monkey.items}`);
    }


    let finalinpections = dataset.map(a => a.inspections).sort((a, b) => b - a);
    // console.log(finalinpections);
    return finalinpections[0] * finalinpections[1];
}

function UpdateSmartitems(operation, smartItem) {
    let terms = operation.split(' ');
    let newSmartItem = {}
    for (key of Object.keys(smartItem)){
        let value = terms[4] == 'old' ? smartItem[key] : Number(terms[4]);
        if (terms[3] == '*') {
            newSmartItem[key] = (smartItem[key] * value) % Number(key);
        } else if (terms[3] == '+') {
            newSmartItem[key] = (smartItem[key] + value) % Number(key);
        }
    }
    // console.log(`${JSON.stringify(smartItem)} ${operation} ${JSON.stringify(newSmartItem)}`);
    return newSmartItem;
}

function executePart2(dataset) {
    let tests = dataset.map(a => a.test);

    for (monkey of dataset) {
        let smartItems = [];
        for (item of monkey.items) {
            let smartitem = {};
            for (testvalue of tests) {
                smartitem[String(testvalue)] = item % testvalue;
            }
            // console.log(JSON.stringify(smartitem));
            smartItems.push(smartitem);
        }
        monkey.smartItems = smartItems;
    }

    for (let round = 1; round <= 10000; round++) {
        for (monkey of dataset) {
            // console.log(`Monkey ${monkey.id}`);
            for (let smartItem of monkey.smartItems) {
                let newSmartItem = UpdateSmartitems(monkey.operation, smartItem);
                let testOutcome = newSmartItem[monkey.test] == 0
                if (testOutcome) {
                    let targetIfTrue = dataset.find(a => a.id == monkey.ifTrue)
                    targetIfTrue.smartItems.push(newSmartItem);
                    // console.log(`Items with worry ${newWorry} is passed to ${targetIfTrue.id}`);
                } else {
                    let targetIfFalse = dataset.find(a => a.id == monkey.ifFalse)
                    targetIfFalse.smartItems.push(newSmartItem);
                    // console.log(`Items with worry ${newWorry} is passed to ${targetIfFalse.id}`);
                }
                monkey.inspections++;
            }
            monkey.smartItems = [];
        }

        // if ([1, 20, 1000, 2000].some(a => a == round)) {
        //     console.log(`After round ${round}`);
        //     for (monkey of dataset) console.log(`Monkey ${monkey.id}: ${monkey.inspections}`);
        //     for (monkey of dataset) console.log(`Monkey ${monkey.id}: ${monkey.smartItems.length}`);
        // }
    }


    let finalinpections = dataset.map(a => a.inspections).sort((a, b) => b - a);
    // console.log(finalinpections);
    return finalinpections[0] * finalinpections[1];
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