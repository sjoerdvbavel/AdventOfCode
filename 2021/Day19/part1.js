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

var range = 500;
var dir = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0,], [0, 0, 1], [0, 0, -1]];

function _checkRange(spot, location , range){
    return spot[0] >= location[0]-range && spot[0] < location[0]
    && spot[1] >= location[1]-range && spot[1] < location[1]
    && spot[2] >= location[2]-range && spot[2] < location[2];
}


function _Adjust(spot, location , direction){
    if(direction[0] !=0){
        //[x,y,z], natural direction
        return [direction[0]*(spot[0]-location[0]),
        direction[0]*(spot[1]-location[1]),
        direction[0]*(spot[2]-location[2])];
    } else if(direction[1] !=0){
        //[y,x,z]
    } else if(direction[2] !=0){
        //[y,x,z]
    } 
    return spot[0] >= location[0]-range && spot[0] < location[0]
    && spot[1] >= location[1]-range && spot[1] < location[1]
    && spot[2] >= location[2]-range && spot[2] < location[2];
}

//Return whether scanner1 and scanner2 overlap
function checkoverlap(scanner1, scanner2, direction, location){

    let beaconsInOverlapArea = scanner1.beacons.filter(x =>_checkRange(x, location, range));
    let Adjustedbeacons.map(y => _adjust(y, location, direction));

}