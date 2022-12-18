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
    for (line of rawDataSet) {
        let splits = line.split("\r\n");

        dataset.push([JSON.parse(splits[0]), JSON.parse(splits[1])]);
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}
//Outcomes:
//1 Right order
//0 wrong order
//-1 undecided (right order if complete array)
function checkPair(left, right, verbose) {
    verbose && console.log(`Parsing ${JSON.stringify(left)} ${JSON.stringify(right)}`);
    while (right.length != 0) {
        let NextLeft = left.shift();
        let NextRight = right.shift();
        if (NextLeft == undefined) {
            return 1;
        } if (typeof NextLeft == 'number' && typeof NextRight == 'number') {
            if (NextLeft != NextRight) {
                verbose && console.log(`returned ${NextLeft < NextRight} cos ${NextLeft} < ${NextRight}`);
                return NextLeft < NextRight;
            }
        } else {
            let leftArray = typeof NextLeft == 'number' ? [NextLeft] : NextLeft;
            let rightArray = typeof NextRight == 'number' ? [NextRight] : NextRight;
            let outcome = checkPair(leftArray, rightArray, verbose);
            if (outcome != -1) {
                return outcome;
            }
        }
    }
    //right is empty, if left is empty:
    //    0 just false, right is empty, left isnt
    //    else -1, good if everything after is good

    verbose && console.log(`returned ${left.length == 0 ? -1 : 0} cos left: ${left.length} items`);
    return left.length == 0 ? -1 : 0;
}

function executePart1(dataset) {
    let indices = [];
    let verbose = false;
    for (let i = 0; i < dataset.length; i++) {
        verbose && console.log(`Test ${i + 1}`);
        if (Math.abs(checkPair(dataset[i][0], dataset[i][1], verbose))) {
            indices.push(i + 1);//Indices in exercise start at 1
        }
    }
    // console.log(indices);
    return indices.reduce((a, b) => a + b, 0);
}
function sortPair(a, b, verbose){
    return Math.abs(checkPair(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b)), verbose))?-1:1;
}

unitTest(sortPair([[[]]],[[]]), '1');
unitTest(sortPair([[]],[[[]]], true), '-1');
unitTest(sortPair([3],[]), '1');
unitTest(sortPair([],[3]), '-1');

function executePart2(dataset) {
    let flatDataset = dataset.flat()
    let twoArray = [[2]];
    let sixArray = [[6]];
    flatDataset.push(twoArray);
    flatDataset.push(sixArray);
    flatDataset.sort((a, b) => sortPair(a,b));

    for(array of flatDataset.slice(0,14)){
        console.log(JSON.stringify(array));
    }

    //Find the indexes: 
    let indexTwo = flatDataset.findIndex(a => a == twoArray);
    let indexSix = flatDataset.findIndex(a => a == sixArray);
    console.log(`${indexTwo + 1} ${indexSix + 1}`)
    return (indexTwo + 1) * (indexSix + 1);
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