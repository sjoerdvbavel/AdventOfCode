var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'testdata.txt');
var rawscanners = fs.readFileSync(filePath).toString().split('\n');
// Parse scanners
var scanners = [];

for (rawscanner of rawscanners) {
    let lines = rawscanner.split('\n');
    let beacons = lines.slice(1).map(x => x.split(',').map(y => parseInt(y, 10)));
    let id = lines.split(' ')[2];
    scanners.push({ id: id, beacons: beacons });
}

var range = 1000;
var dir = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0,], [0, 0, 1], [0, 0, -1]];

function _checkRange(spot, location, range) {
    return spot[0] >= location[0] - range && spot[0] < location[0]
        && spot[1] >= location[1] - range && spot[1] < location[1]
        && spot[2] >= location[2] - range && spot[2] < location[2];
}


function _Adjust(spot, location, direction, rotation) {
    let returnobject = spot.slice();
    //Move the location
    returnobject = [returnobject[0] - location[0], returnobject[1] - location[1], returnobject[2] - location[2]]
    //Move to the right direction.
    if (direction[0] == 1) {
        //[x,y,z], x-direction
        //Do nothing
        //returnobject = [returnobject[0], returnobject[1], returnobject[2]];
    } else if (direction[0] = -1) {
        //[y,x,z], x-direction reversed.
        returnobject = [returnobject[0], returnobject[1], returnobject[2]];
    } else if (direction[1] == 1) {
        //[-y, x, z], y-direction
        returnobject = [-returnobject[1], returnobject[0], returnobject[2]];
    } else if (direction[1] = -1) {
        //[y, -x, -z], y-direction reversed.
        returnobject = [returnobject[1], -returnobject[0], -returnobject[2]];
    } else if (direction[2] == 1) {
        //[x,y,z], z-direction
        returnobject = [-returnobject[2], returnobject[1], returnobject[0]];
    } else if (direction[2] = -1) {
        //[y,x,z], z-direction reversed.
        returnobject = [returnobject[2], -returnobject[1], -returnobject[0]];
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
    return returnobject;
}

//Return whether scanner1 and scanner2 overlap
function checkoverlap(scanner1, scanner2, direction, location, rotation) {
    //Adjust all beacons from scanner2 to the new situation.
    let Adjustedbeacons = scanner2.map(y => _adjust(y, location, direction, rotation));

    //Overlap adjustedbeacons and beacons1
    overlappingbeacons = Adjustedbeacons.filter(function(n) {
        return scanner1.beacons.indexOf(n) !== -1;
    });
    //Count the result.
    return overlappingbeacons.length >= 12;
}

function findOrientation(scanner1, scanner2){
    for(let z = -range; z <= range; z++){
        for(let y = -range; y <= range; y++){
            for(let x = -range; x <= range; x++){
                for(direction of dir){
                    for(let rotation = 0; rotation < 4; rotation++){
                        if(checkoverlap(scanner1, scanner2, direction, [x,y,z], rotation)){
                            return [true, direction, [x,y,z], rotation];
                        }
                    }
                }
            }
        }
    }
    return [false];
}