var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'testdata.txt');
var rawscanners = fs.readFileSync(filePath).toString().split('\r\n\r\n');
// Parse scanners
var scanners = [];

for (rawscanner of rawscanners) {
    let lines = rawscanner.split('\n');
    let beacons = lines.slice(1).map(x => x.split(',').map(y => parseInt(y, 10)));
    let beaconstrings = beacons.map(x => JSON.stringify(x));
    let id = lines[0].split(' ')[2];
    scanners.push({ id: id, beacons: beacons, beaconstrings: beaconstrings });
}

var range = 1000;
var minOverlap = 12;
var dir = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0,], [0, 0, 1], [0, 0, -1]];

function _checkRange(spot, location, range) {
    return spot[0] >= location[0] - range && spot[0] < location[0]
        && spot[1] >= location[1] - range && spot[1] < location[1]
        && spot[2] >= location[2] - range && spot[2] < location[2];
}
function _getLocationFromBeacons(beacon1, beacon2, direction, rotation) {
    let returnobject = JSON.parse(JSON.stringify(beacon2));
    //Invert the orientation.
    if (rotation == 0) {
        //Do nothing
    } else if (rotation == 1) {
        returnobject = [returnobject[0], -returnobject[2], returnobject[1]];
    } else if (rotation == 2) {
        returnobject = [returnobject[0], -returnobject[1], -returnobject[2]];
    } else if (rotation == 3) {
        returnobject = [returnobject[0], returnobject[2], -returnobject[1]];
    }

    //Invert the change in direction.
    if (direction[0] == 1) {
        //[x,y,z], x-direction
        //Do nothing
        //returnobject = [returnobject[0], returnobject[1], returnobject[2]];
    } else if (direction[0] = -1) {
        //[y,x,z], x-direction reversed.
        returnobject = [-returnobject[0], returnobject[1], -returnobject[2]];
    } else if (direction[1] == -1) {
        //[-y, x, z], y-direction
        returnobject = [-returnobject[1], returnobject[0], returnobject[2]];
    } else if (direction[1] = 1) {
        //[y, -x, -z], y-direction reversed.
        returnobject = [returnobject[1], -returnobject[0], returnobject[2]];
    } else if (direction[2] == -1) {
        //[x,y,z], z-direction
        returnobject = [-returnobject[2], returnobject[1], returnobject[0]];
    } else if (direction[2] = 1) {
        //[y,x,z], z-direction reversed.
        returnobject = [returnobject[2], returnobject[1], -returnobject[0]];
    }

    return [-1 * (returnobject[0] - beacon1[0]),
    -1 * (returnobject[1] - beacon1[1]),
    -1 * (returnobject[2] - beacon1[2])];
}
function _isInRange(location, range) {
    let isInRange = true;
    for (a of [0, 1, 2]) {
        isInRange = isInRange && Math.abs(location[a]) <= range;
    }
    return isInRange;
}

function _Adjust(spot, location, direction, rotation) {
    let returnobject = spot.slice();

    //Move to the right direction.
    if (direction[0] == 1) {
        //[x,y,z], x-direction
        //Do nothing
        //returnobject = [returnobject[0], returnobject[1], returnobject[2]];
    } else if (direction[0] = -1) {
        //[y,x,z], x-direction reversed.
        returnobject = [-returnobject[0], returnobject[1], -returnobject[2]];
    } else if (direction[1] == 1) {
        //[-y, x, z], y-direction
        returnobject = [-returnobject[1], returnobject[0], returnobject[2]];
    } else if (direction[1] = -1) {
        //[y, -x, -z], y-direction reversed.
        returnobject = [returnobject[1], -returnobject[0], returnobject[2]];
    } else if (direction[2] == 1) {
        //[x,y,z], z-direction
        returnobject = [-returnobject[2], returnobject[1], returnobject[0]];
    } else if (direction[2] = -1) {
        //[y,x,z], z-direction reversed.
        returnobject = [returnobject[2], returnobject[1], -returnobject[0]];
    }
    //Apply the orientation.
    if (rotation == 0) {
        //Do nothing
    } else if (rotation == 1) {
        returnobject = [returnobject[0], returnobject[2], -returnobject[1]];
    } else if (rotation == 2) {
        returnobject = [returnobject[0], -returnobject[1], -returnobject[2]];
    } else if (rotation == 3) {
        returnobject = [returnobject[0], -returnobject[2], returnobject[1]];
    }

    //Move the location
    returnobject = [returnobject[0] + location[0], returnobject[1] + location[1], returnobject[2] + location[2]]

    return returnobject;
}

//Return whether scanner1 and scanner2 overlap
function checkoverlap(scanner1, scanner2, direction, location, rotation) {
    //Adjust all beacons from scanner2 to the new situation.
    let Adjustedbeacons = scanner2.beacons.map(y => _Adjust(y, location, direction, rotation));

    //Overlap adjustedbeacons and beacons1
    let overlappingbeacons = Adjustedbeacons.filter(function (n) {
        return scanner1.beaconstrings.indexOf(JSON.stringify(n)) !== -1;
    });
    //Count the result.
    return [overlappingbeacons.length >= 12, Adjustedbeacons];
}

function findOrientation(scanner1, scanner2) {
    // for (let z = -range; z <= range; z++) {
    //     for (let y = -range; y <= range; y++) {
    //         for (let x = -range; x <= range; x++) {
    //             for (direction of dir) {
    //                 for (let rotation = 0; rotation < 4; rotation++) {
    //                     let result = checkoverlap(scanner1, scanner2, direction, [x, y, z], rotation);
    //                     if (result[0]) {
    //                         return [true, direction, [x, y, z], rotation, result[1]];
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }
    //New plan: look at spots where at least 2 camera's overlap.
    for (let beacon1 of scanner1.beacons) {
        for (let beacon2 of scanner2.beacons) {
            for (let direction of dir) {
                for (let rotation = 0; rotation < 4; rotation++) {
                    let location = _getLocationFromBeacons(beacon1, beacon2, direction, rotation);
                    // if (_isInRange(location, 2 * range)) {
                        let result = checkoverlap(scanner1, scanner2, direction, location, rotation);
                        if (result[0]) {
                            return [true, direction, location, rotation, result[1]];
                        }
                    // }
                }
            }
        }
    }
    return [false];
}


//Do the actual search.

//Scanners connected but not explored.
var unexploredscannerlist = [scanners[0]];
//Scanners to be connected
var undiscoveredscannerlist = scanners.slice(1);

//Beaconlist
var beaconlist = scanners[0].beaconstrings.slice();
while (unexploredscannerlist.length != 0) {
    let scannertoexplore = unexploredscannerlist.pop();
    let newundiscoveredscannerlist = [];
    for (scannerindex in undiscoveredscannerlist) {
        let newscanner = undiscoveredscannerlist[scannerindex];
        let result = findOrientation(scannertoexplore, newscanner);
        if (result[0]) {
            newscanner.direction = result[1];
            newscanner.location = result[2];
            newscanner.rotation = result[3];
            newscanner.beacons = result[4]; //beacons are now in the new coordinates
            newscanner.beaconstrings = result[4].map(x=>JSON.stringify(x));
            unexploredscannerlist.push(newscanner);
            //We add beacons that are not already on the list.
            let newbeaconlist = newscanner.beaconstrings.filter(x => beaconlist.indexOf(x) == -1);
            console.log(`Scanner ${scannertoexplore.id} overlaps with scanner ${newscanner.id}. Added ${newbeaconlist.length} beacons`);
            for(beaconstring of newbeaconlist){
                console.log(beaconstring);
            }
            beaconlist = beaconlist.concat(newbeaconlist);
        } else{
            //If a scanner is not linked to the current scanner we check it again later.
            newundiscoveredscannerlist.push(newscanner);
            console.log(`Scanner ${scannertoexplore.id} does not overlap with scanner ${newscanner.id}.`);

        }
    }
    undiscoveredscannerlist = newundiscoveredscannerlist;
}
function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

unitTest(_Adjust([686, 422, 578], [68, -1246, -43], [-1, 0, 0], 0), '[-618,-824,-621]')

unitTest(_getLocationFromBeacons([-618, -824, -621], [686, 422, 578], [-1, 0, 0], 0), '[68,-1246,-43]');


console.log(`Finished exploring, unlinked scanners: ${undiscoveredscannerlist.length}. Total beacons: ${beaconlist.length}`);