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
        let numbers = line.match(/-?\d+/g).map(a => Number(a));
        let object = { location: [numbers[0], numbers[1]], beacon: [numbers[2], numbers[3]] };
        object.dist = manDist(object.location, object.beacon);
        dataset.push(object);
    }

    // console.log(dataset.slice(0, 5));
    return dataset;
}

function manDist(a, b){
    return Math.abs(a[0]-b[0]) + Math.abs(a[1]-b[1]);
}
function getIntervals(dataset, row, verbose){
    let intervals = [];
    for(sensor of dataset){
        // Is the sensor in range? 
        //eg. sensor at 3 with dist 3 is in range iff heigh - dist < row && height + dist > row, 0 < row < 6
        if(sensor.location[1] - sensor.dist < row && sensor.location[1] + sensor.dist > row){
            let IntervalWidth = sensor.dist - Math.abs(sensor.location[1] - row);
            let OverlapInterval = [sensor.location[0] - IntervalWidth, sensor.location[0] + IntervalWidth];
            verbose && console.log(`${sensor.location} (${sensor.dist}) reaches ${row} in interval ${OverlapInterval} (width: ${IntervalWidth})`);
            intervals.push(OverlapInterval);
        }
    }
    return intervals;
}

function executePart1(dataset) {
    let verbose = true;
    let spots = [];
    for (sensor of dataset) {
        spots.push(sensor.location);
        spots.push(sensor.beacon);
    }
    let maxX = Math.max(...spots.map(a => a[0]));
    let minX = Math.min(...spots.map(a => a[0]));
    let maxY = Math.max(...spots.map(a => a[1]));
    let minY = Math.min(...spots.map(a => a[1]));

    console.log(`Box is ${minX} - ${maxX} by ${minY} - ${maxY}`);
    let rowToCheck = dataset.length == 14?11:2000000; //if testdata, 10 else 20k.
    let intervals = getIntervals(dataset, rowToCheck, verbose);

    //We count all numbers from min(intervals) to max(intervals) if they are in an interval.
    let count = 0;
    let beaconCount = 0;
    let locationCount = 0;
    let min = Math.min(...intervals.flat());
    let max = Math.max(...intervals.flat());
    for(let i = min; i <= max; i++){
        for(interval of intervals){
            if(i >= interval[0] && i <= interval [1]){
                count++;
                if(dataset.some(a => a.beacon[0] == i && a.beacon[1] == rowToCheck)){
                    beaconCount++;
                }
                if(dataset.some(a => a.location[0] == i && a.location[1] == rowToCheck)){
                    locationCount++;
                }
                break;//break one loop, i is in an interval.
            }
        }
    }
    console.log(`${count} points, ${beaconCount} beacons, ${locationCount} locations`);
    return count - beaconCount;
}
//Attempt2 for part2
reduceInterval

function executePart2(dataset) {
    let verbose = true;
    let frequency = -1;
    let range = dataset.length == 14?20:4000000; //if testdata, 10 else 20k.
    for(let row = 0; row < range; row++){
        row % 100000 == 0 && console.log(`${row}`);
        let string = '';
        let intervals = getIntervals(dataset, row, false);
        for(let column = 0; column <= range; column++){
            let ColumnInAnInterval = false;
            for(interval of intervals){
                if(column >= interval[0] && column <= interval [1]){
                    ColumnInAnInterval = true;
                    i = interval[1];//Skip to end of interval;
                    break;//break one loop, i is in an interval.
                }
            }
            //No overlapping interval was found...
            if(!ColumnInAnInterval){
                frequency = 4000000 * column + row;
                console.log(`Found point ${[column,row]} frequency ${frequency}`);
            }
        }
        // verbose && console.log(string);
    }
    return frequency;
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