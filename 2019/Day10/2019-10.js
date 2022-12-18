const { get } = require('http');
const { BlockList } = require('net');
const { normalize } = require('path');

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

    let xlim = rawDataSet[0].length;
    let ylim = rawDataSet.length;
    let meteors = [];
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            if (rawDataSet[y][x] == '#') {
                meteors.push([x, y]);
            }
        }
    }
    return meteors;
}

function gcd(x, y) {
    x = Math.abs(x);
    y = Math.abs(y);
    while (y) {
        var t = y;
        y = x % y;
        x = t;
    }
    return x;
}

//Normalize a-meteor so components are coprime and the first number is positive.
//Assume a and meteor are different
function Normalize(origin, meteor) {
    let vector = [meteor[0] - origin[0], meteor[1] - origin[1]];
    // console.log(meteor);
    if (vector[0] == 0 && vector[1] == 0) console.log(`Error, a=meteor ${a}`);
    if (vector[0] == 0) return [0, vector[1] >= 0 ? 1 : -1];
    if (vector[1] == 0) return [vector[0] >= 0 ? 1 : -1, 0];
    let vectorGcd = gcd(vector[0], vector[1]);
    // let sign = vector[0] / Math.abs(vector[0]);
    return [vector[0] / vectorGcd, vector[1] / vectorGcd];
}


unitTest(Normalize([10, 10], [15, 15]), '[1,1]');
unitTest(Normalize([10, 10], [10, 5]), '[0,-1]');
unitTest(Normalize([13, 16], [10, 10]), '[-1,-2]');

function executePart1(meteors) {
    // console.log(JSON.stringify(meteors));
    let counts = {};
    let max = 0;
    let maxMeteor = [];

    //Count the meteors visible from every space.
    for (meteorIndex in meteors) {
        let meteor = meteors[meteorIndex];
        let otherMeteors = meteors.slice(0, meteorIndex).concat(meteors.slice(Number(meteorIndex) + 1, meteors.length));
        let normalizedOtherMeteors = otherMeteors.map(a => Normalize(a, meteor).join(','));
        // console.log(`${meteor} Size:${new Set(normalizedOtherMeteors).size} Normalized other meteors:${normalizedOtherMeteors.join(' / ')}`);
        let countUnique = new Set(normalizedOtherMeteors).size;
        if (countUnique > max) {
            max = countUnique;
            maxMeteor = meteor;
        }
    }
    console.log(`Max ${max} at [${maxMeteor}]`);
    return max;
}

function getAngle(vector) {
    let angle = Math.atan2(vector[0], vector[1]) * 180 / Math.PI;
    if (angle >= 0) {
        return angle;
    } else {
        return 360 + angle
    }
}
unitTest(getAngle([0, 1]), 0);
unitTest(getAngle([1, 0]), 90);
unitTest(getAngle([0, -1]), 180);
unitTest(getAngle([-1, 0]), 270);

//Get the squared distance because #boeisjeans
function getDistance(vector) {
    return vector[0] * vector[0] + vector[1] * vector[1];
}

function executePart2(meteors) {
    let origin = [19, 14];
    let adjustedMeteors = [];
    console.log(meteors.length);
    for (meteorindex in meteors) {
        let meteor = meteors[meteorIndex];
        if (!(meteor[0] == origin[0] && meteor[1] == origin[1])) {
            let adjustedVector = [meteor[0] - origin[0], meteor[0] - origin[0]];
            adjustedMeteors.push({ meteor: meteor, angle: getAngle(adjustedVector), dist: getDistance(adjustedVector) });
        }
    }
    let angleCannon = -1;
    adjustedMeteors.sort((a, b) => b.angle == a.angle ? b.angle - a.angle : b.dist - a.dist);
    console.log(adjustedMeteors.slice(0,5));
    //Find next
    let destroyedCount = 0;
    let destroyedmeteors = [];
    while (adjustedMeteors.length != 0) {
        for (meteorIndex in adjustedMeteors) {
            let nextMeteor = adjustedMeteors[meteorIndex];
            if (nextMeteor.angle != angleCannon) {
                //Remove the destroyed meteor
                console.log(`${nextMeteor.meteor} ${nextMeteor.angle} ${nextMeteor.dist}`);
                destroyedmeteors.push(adjustedMeteors.splice(meteorIndex));
                destroyedCount++;
                angleCannon = nextMeteor.angle;
            }
        }
        angleCannon = -1;
    }
    console.log(adjustedMeteors.length);
    console.log(destroyedmeteors.length);
    let TwohundredMeteor = destroyedmeteors[200 - 1];
    return TwohundredMeteor.meteor[0] * 100 + TwohundredMeteor.meteor[1];
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