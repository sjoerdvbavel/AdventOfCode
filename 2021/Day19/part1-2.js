//Third way of writing the rotation and rotation inversion.

var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'testdata.txt');
var rawscanners = fs.readFileSync(filePath).toString().split('\r\n\r\n');
// Parse scanners
var scanners = [];

for (rawscanner of rawscanners) {
    let lines = rawscanner.split('\r\n');
    let beacons = lines.slice(1).map(x => x.split(',').map(y => parseInt(y, 10)));
    let id = lines[0].split(' ')[2];
    scanners.push({ id: id, beacons: beacons });
}

var range = 1000;
var dir = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0,], [0, 0, 1], [0, 0, -1]];

function _checkRange(spot, location, range) {
    return spot[0] >= location[0] - range && spot[0] < location[0]
        && spot[1] >= location[1] - range && spot[1] < location[1]
        && spot[2] >= location[2] - range && spot[2] < location[2];
}

function rotateCoordinates(vector, rotation) {
    let a = vector[0];
    let b = vector[1];
    let c = vector[2];
    if (rotation == 0) {
        return [a, b, c];
    } else if (rotation == 1) {
        return [a, -b, -c]
    } else if (rotation == 2) {
        return [a, -c, b];
    } else if (rotation == 3) {
        return [a, c, -b];
    } else if (rotation == 4) {
        return [-a, b, -c];
    } else if (rotation == 5) {
        return [-a, -b, c];
    } else if (rotation == 6) {
        return [-a, c, b];
    } else if (rotation == 7) {
        return [-a, -c, -b];
    } else if (rotation == 8) {
        return [b, a, -c];
    } else if (rotation == 9) {
        return [-b, a, c];
    } else if (rotation == 10) {
        return [c, a, b];
    } else if (rotation == 11) {
        return [-c, a, -b];
    } else if (rotation == 12) {
        return [b, -a, c];
    } else if (rotation == 13) {
        return [-b, -a, -c];
    } else if (rotation == 14) {
        return [-c, -a, b];
    } else if (rotation == 15) {
        return [c, -a, -b];
    } else if (rotation == 16) {
        return [b, -c, a];
    } else if (rotation == 17) {
        return [-b, c, a];
    } else if (rotation == 18) {
        return [-c, b, a];
    } else if (rotation == 19) {
        return [c, -b, a];
    } else if (rotation == 20) {
        return [b, -c, -a];
    } else if (rotation == 21) {
        return [-b, c, -a];
    } else if (rotation == 22) {
        return [c, b, -a];
    } else if (rotation == 23) {
        return [-c, -b, -a];
    }
}
// We invert the rotation just by applying it 11 more times.
//  Quite inefficient but boeisjeans...
function invertrotation(vector, rotation) {
    let returnvector = vector;
    for (i = 0; i < 11; i++) {
        returnvector = rotateCoordinates(returnvector, rotation);
    }
    return returnvector;
}

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }else {}
}

let testvector = [1, 2, 3];
for (let i = 0; i < 24; i++) {
    unitTest(rotateCoordinates(invertrotation(testvector, i), i), "[1,2,3]");
    unitTest(invertrotation(rotateCoordinates(testvector, i), i), "[1,2,3]");
}

function getLocation(vector1, vector2, rotation) {
    let invertedVector2 = invertrotation(vector2, rotation);
    let l0 = vector1[0] - invertedVector2[0];
    let l1 = vector1[1] - invertedVector2[1];
    let l2 = vector1[2] - invertedVector2[2];
    return [l0, l1, l2];
}

for (let i = 0; i < 24; i++) {
    var attempt1 = JSON.stringify(getLocation([-618,-824,-621], [686,422,578], i));
    if(attempt1 != "[68,-1246,-43]"){
        console.log(`${i} ${attempt1}`);
    }
}



//Return whether scanner1 and scanner2 overlap
function checkoverlap(scanner1, scanner2, direction, location) {
    //Adjust all beacons from scanner2 to the new situation.
    let Adjustedbeacons = scanner2.map(y => rotateCoordinates(y, location, direction));

    //Overlap adjustedbeacons and beacons1
    overlappingbeacons = Adjustedbeacons.filter(function (n) {
        return scanner1.beacons.indexOf(n) !== -1;
    });
    //Count the result.
    return [overlappingbeacons.length >= 12, Adjustedbeacons];
}

function findOrientation(scanner1, scanner2) {
    for (let direction = 0; direction < 24; direction++) {
        let location = getLocation(vector1, vector2, direction)
        if (checkoverlap(scanner1, scanner2, direction, location)) {
            return [true, direction, location];
        }
    }
    return [false];
}