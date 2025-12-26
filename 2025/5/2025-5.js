function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\n\n");
    let ranges = rawDataSet[0].split('\n').map(x => {
        let numbers = x.split('-');
        return {start: Number(numbers[0]), end: Number(numbers[1])};
    });

    let indexes = rawDataSet[1].split('\n').map(x => Number(x));

    // console.log(ranges.slice(0,5));
    // console.log(indexes.slice(0,5));
    return {ranges, indexes};
}
function checkRange(range, element){
    // console.log(`Checking ${element} in ${range.start+','+range.end}`)
    return element >= range.start &&  element <= range.end;
}

function executePart1(dataset) {
    let unspoiled = [];
    for(ingredient of dataset.indexes){
        for(range of dataset.ranges){
            if(checkRange(range, ingredient)){
                unspoiled.push(ingredient);
                break;
            }
        }
    }
    // console.log(`unspoiled ingredients: ${unspoiled.join(', ')}`)
    return unspoiled.length;
}
// [10, 18], [16,20]
function doRangesOverlapOrTouch(range1, range2){
    if(range1.end <= range2.start - 1){
        return false;
    }
    if(range1.start >= range2.end + 1 ){
        return false;
    }
    return true;
}

function checkRangeList(range, rangelist){
    for(rangeIterator of rangelist){
        if(doRangesOverlapOrTouch(range, rangeIterator)){
            return true;
        }
    }
    return false;
}

function combineOverlappingRanges(range1, range2){
    return {start: Math.min(range1.start, range2.start), end: Math.max(range1.end, range2.end)};
}

function getMaxRange(range, rangeList){
    let maxrange = {start:-1, end: -1};
    while(range.start != maxrange.start || range.end != maxrange.end){
        // console.log(`iterating maxrange from ${JSON.stringify(range)}`);
        maxrange = range
        for(let rangeIterator of rangeList){
            if(doRangesOverlapOrTouch(range, rangeIterator)){
                range = combineOverlappingRanges(range, rangeIterator);
            }
        }
    }
    // console.log(`Made maxrange: ${JSON.stringify(range)} with ${JSON.stringify(rangeList)}`);
    return range;
}

function executePart2(dataset) {
    let ranges = dataset.ranges
    let nonOverlappingranges = [getMaxRange(ranges[0], ranges)];
    for(range of ranges){
        if(!checkRangeList(range, nonOverlappingranges)){
            nonOverlappingranges.push(getMaxRange(range, ranges));
        }
    }
    // console.log(JSON.stringify(nonOverlappingranges));
    return nonOverlappingranges.map(x => x.end - x.start + 1).reduce((a,b)=> a + b, 0);
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