//Third way of writing the rotation and rotation inversion.

const { Console } = require('console');
var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var rawscanners = fs.readFileSync(filePath).toString().split('\r\n\r\n');
// Parse scanners
var scanners = [];

for (rawscanner of rawscanners) {
    let lines = rawscanner.split('\r\n');
    let beacons = lines.slice(1).map(x => x.split(',').map(y => parseInt(y, 10)));
    let id = lines[0].split(' ')[2];
    scanners.push({ id: id, beacons: beacons });
}

function _checkRange(spot, location, range) {
    return spot[0] >= location[0] - range && spot[0] < location[0]
        && spot[1] >= location[1] - range && spot[1] < location[1]
        && spot[2] >= location[2] - range && spot[2] < location[2];
}

function invertrotation(vector, rotation) {
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
function rotateCoordinates(vector, rotation) {
    // let returnvector = vector;
    // for (i = 0; i < 11; i++) {
    //     returnvector = invertrotation(returnvector, rotation);
    // }
    // return returnvector;
    let a = vector[0];
    let b = vector[1];
    let c = vector[2];
    if (rotation == 0) {
        return [a, b, c];
    } else if (rotation == 1) {
        return [a, -b, -c]
    } else if (rotation == 2) {
        return [a, c, -b];
    } else if (rotation == 3) {
        return [a, -c, b];
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
        return [b, -a, c];
    } else if (rotation == 10) {
        return [b, c, a];
    } else if (rotation == 11) {
        return [b, -c, -a];
    } else if (rotation == 12) {
        return [-b, a, c];
    } else if (rotation == 13) {
        return [-b, -a, -c];
    } else if (rotation == 14) {
        return [-b, c, -a];
    } else if (rotation == 15) {
        return [-b, -c, a];
    } else if (rotation == 16) {
        return [c, a, -b];
    } else if (rotation == 17) {
        return [c, -a, b];
    } else if (rotation == 18) {
        return [c, b, -a];
    } else if (rotation == 19) {
        return [c, -b, a];
    } else if (rotation == 20) {
        return [-c, a, -b];
    } else if (rotation == 21) {
        return [-c, -a, b];
    } else if (rotation == 22) {
        return [-c, b, a];
    } else if (rotation == 23) {
        return [-c, -b, -a];
    }
}

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    } else { }
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


//This transforms coordinates from one perspective to the next...
function adjustCoordinates(vector, location, direction) {
    let l0 = vector[0] - location[0];
    let l1 = vector[1] - location[1];
    let l2 = vector[2] - location[2];
    return rotateCoordinates([l0, l1, l2], direction);
}
//This inverts the previous cooridnation
function deadjustCoordinates(vector, location, direction) {
    let invertedvector = invertrotation(vector, direction);
    let l0 = invertedvector[0] + location[0];
    let l1 = invertedvector[1] + location[1];
    let l2 = invertedvector[2] + location[2];
    return [l0, l1, l2];
}
let testlocation = [68, -1246, -43];
for (let i = 0; i < 24; i++) {
    unitTest(deadjustCoordinates(adjustCoordinates(testvector, testlocation, i), testlocation, i), "[1,2,3]");
    unitTest(adjustCoordinates(deadjustCoordinates(testvector, testlocation, i), testlocation, i), "[1,2,3]");
}

unitTest(getLocation([-618, -824, -621], [686, 422, 578], 4), "[68,-1246,-43]");
unitTest(adjustCoordinates([-618, -824, -621], [68, -1246, -43], 4), "[686,422,578]");
unitTest(deadjustCoordinates([686, 422, 578], [68, -1246, -43], 4), "[-618,-824,-621]");

//Return all elements both in array1 and array2
function OverlapArrays(array1, array2) {
    let returnarray = [];
    for (element1 of array1) {
        for (element2 of array2) {
            if (JSON.stringify(element1) == JSON.stringify(element2)) {
                returnarray.push(element1);
            }
        }
    }
    return returnarray;
}

function doScannersOverlap(scanner1, scanner2) {
    for (beacon1 of scanner1.beacons.slice(11)) {
        for (beacon2 of scanner2.beacons.slice(11)) {
            for (let direction = 0; direction < 24; direction++) {
                //Get the location between beacon1 and beacon2 with the given direction.
                let location = getLocation(beacon1, beacon2, direction);

                //Adjust all beacons from scanner2 to the new situation.
                let Adjustedbeacons = scanner2.beacons.map(y => deadjustCoordinates(y, location, direction));

                //Overlap adjustedbeacons and beacons1
                let overlappingbeacons = OverlapArrays(Adjustedbeacons, scanner1.beacons);

                if (overlappingbeacons.length >= 12) {
                    return [true, Adjustedbeacons, direction, location,];
                }
            }
        }
    }
    return [false];
}

//Generate an empty matrix

let dim = scanners.length;
let matrix = [];
for (let i = 0; i < dim; i++) {
    matrix.push(new Array(dim).fill(0));
}

// // Test the overlapfunction
for (scannerindex1 in scanners) {
    let scanner1 = scanners[scannerindex1];
    for (scannerindex2 in scanners) {
        let scanner2 = scanners[scannerindex2];
        let results = doScannersOverlap(scanner1, scanner2);
        if (results[0]) {
            matrix[scannerindex1][scannerindex2] = 1;
        } else {
            matrix[scannerindex1][scannerindex2] = 0;
        }
    }
    console.log(`finished row ${scannerindex1}`);
}

for (row in matrix) {
    console.log(`${row} ${matrix[row].join('')}`);
}