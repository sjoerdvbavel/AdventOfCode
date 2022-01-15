function RotateX(x, y, z, rotx) {
    return [
        x,
        Math.round(y * Math.cos(rotx) - z * Math.sin(rotx)),
        Math.round(y * Math.sin(rotx) + z * Math.cos(rotx))
    ];
}

function RotateY(x, y, z, roty) {
    return [
        Math.round(x * Math.cos(roty) + z * Math.sin(roty)),
        y,
        Math.round(-1 * x * Math.sin(roty) + z * Math.cos(roty))
    ];
}
function RotateZ(x, y, z, rotz) {
    return [
        Math.round(x * Math.cos(rotz) - y * Math.sin(rotz)),
        Math.round(x * Math.sin(rotz) + y * Math.cos(rotz)),
        z
    ];
}




function _Adjust(spot, location, rotx, roty, rotz) {
    let returnvector = spot.slice();

    //Rotates the x,y,z vector radian steps in every direction. 
    // This produces some overlapping results but it should get all 24 rotations.
    returnvector = RotateX(...returnvector, Math.PI * rotx / 2);
    returnvector = RotateY(...returnvector, Math.PI * roty / 2);
    returnvector = RotateZ(...returnvector, Math.PI * rotz / 2);

    //Move the location

    returnvector = [returnvector[0] - location[0], returnvector[1] - location[1], returnvector[2] - location[2]]

    return returnvector;
}

function _getLocationFromBeacons(beacon1, beacon2, rotx, roty, rotz) {
    //Revert the rotation on beacon2.
    let adjustedBeacon2 = _InvertAdjust(beacon2, rotx, roty, rotz);

    //Return the difference between the 2 beacons
    return [-1 * (adjustedBeacon2[0] - beacon1[0]),
    -1 * (adjustedBeacon2[1] - beacon1[1]),
    -1 * (adjustedBeacon2[2] - beacon1[2])];
}

function _InvertAdjust(vector, rotx, roty, rotz) {
    //Rotates the x,y,z vector radian steps in every direction. 
    // This produces some overlapping results but it should get all 24 rotations.
    let returnvector = RotateZ(...vector, - Math.PI * rotz / 2);
    returnvector = RotateY(...returnvector, - Math.PI * roty / 2);
    returnvector = RotateX(...returnvector, - Math.PI * rotx / 2);
    return returnvector;
}

vector = [-618, -824, -621];

let results = []
for (let rotx = 0; rotx < 4; rotx++) {
    for (let roty = 0; roty < 4; roty++) {
        for (let rotz = 0; rotz < 4; rotz++) {
            var trans = _Adjust(vector, [68,-1246,-43], rotx, roty, rotz);
            results.push(`[${rotx}, ${roty},${rotz}] ` + JSON.stringify(trans));
        }
    }
}
var set = [... new Set(results)].sort();
console.log(set.length);
for (res of set) {
    console.log(res);
}


function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

unitTest(_getLocationFromBeacons([-618, -824, -621], [686, 422, 578], ...[2, 0, 0]), '[68,-1246,-43]');