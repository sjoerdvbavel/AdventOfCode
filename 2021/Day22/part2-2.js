//Attempt 2, make squares that do not overlap?
// There is a bug somewhere, and I just realized I don't need 
//to make non-overlapping boxes, just calculate the overlap and correct.

const { Console, assert } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

function _volumeCube(cube) {
    return Math.abs(cube.x[1] - cube.x[0] + 1)
        * Math.abs(cube.y[1] - cube.y[0] + 1)
        * Math.abs(cube.z[1] - cube.z[0] + 1);
}

function countActiveCubes(cuboidlist) {
    if (Array.isArray(cuboidlist)) {
        let count = 0;
        for (let a of cuboidlist) {
            count += _volumeCube(a);
        }
        return count;
    } else {
        return _volumeCube(cuboidlist);
    }
}

function _doIntervalsOverlap(interval1, interval2) {
    if (interval1[1] < interval2[0]) {
        return false;
    }
    if (interval1[0] > interval2[1]) {
        return false;
    }
    return true;
}

function doCuboidsOverlap(cuboid1, cuboid2) {
    return _doIntervalsOverlap(cuboid1.x, cuboid2.x) &&
        _doIntervalsOverlap(cuboid1.y, cuboid2.y) &&
        _doIntervalsOverlap(cuboid1.z, cuboid2.z);
}

//We trim pieces of cuboidtoreduce until a list returns of cuboids not overlapping with fixedcuboid.
function makeCuboidsNotOverlap(fixedcuboid, cuboidtoreduce) {
    let startingsize = countActiveCubes(cuboidtoreduce);
    let startingcuboidtoreduce = JSON.parse(JSON.stringify(cuboidtoreduce));
    let engulf = cuboidtoreduce.x[0] > fixedcuboid.x[0] &&
        cuboidtoreduce.x[1] < fixedcuboid.x[1] &&
        cuboidtoreduce.y[0] > fixedcuboid.y[0] &&
        cuboidtoreduce.y[1] < fixedcuboid.y[1] &&
        cuboidtoreduce.z[0] > fixedcuboid.z[0] &&
        cuboidtoreduce.z[1] < fixedcuboid.z[1];//Does fixedcuboid overlap cuboidtoreduce in all directions?
    if (engulf) {
        return [];
    };
    let cuboidlist = [];

    if (cuboidtoreduce.z[1] > fixedcuboid.z[1]) {
        cuboidlist.push({ x: cuboidtoreduce.x.slice(), y: cuboidtoreduce.y.slice(), z: [fixedcuboid.z[1] + 1, cuboidtoreduce.z[1]] });
        cuboidtoreduce.z[1] = fixedcuboid.z[1];
    }
    if (cuboidtoreduce.z[0] < fixedcuboid.z[0]) {
        cuboidlist.push({ x: cuboidtoreduce.x.slice(), y: cuboidtoreduce.y.slice(), z: [cuboidtoreduce.z[0], fixedcuboid.z[0] - 1] });
        cuboidtoreduce.z[0] = fixedcuboid.z[0];
    }
    if (cuboidtoreduce.y[1] > fixedcuboid.y[1]) {
        cuboidlist.push({ x: cuboidtoreduce.x.slice(), y: [fixedcuboid.y[1] + 1, cuboidtoreduce.y[1]], z: cuboidtoreduce.z.slice() });
        cuboidtoreduce.y[1] = fixedcuboid.y[1];
    }
    if (cuboidtoreduce.y[0] < fixedcuboid.y[0]) {
        cuboidlist.push({ x: cuboidtoreduce.x.slice(), y: [cuboidtoreduce.y[0], fixedcuboid.y[0] - 1], z: cuboidtoreduce.z.slice() });
        cuboidtoreduce.y[0] = fixedcuboid.y[0];
    }
    if (cuboidtoreduce.x[1] > fixedcuboid.x[1]) {
        cuboidlist.push({ x: [fixedcuboid.x[1] + 1, cuboidtoreduce.x[1]], y: cuboidtoreduce.y.slice(), z: cuboidtoreduce.z.slice() });
        cuboidtoreduce.x[1] = fixedcuboid.x[1];
    }
    if (cuboidtoreduce.x[0] < fixedcuboid.x[0]) {
        cuboidlist.push({ x: [cuboidtoreduce.x[0], fixedcuboid.x[0] - 1], y: cuboidtoreduce.y.slice(), z: cuboidtoreduce.z.slice() });
        cuboidtoreduce.x[0] = fixedcuboid.x[0];
    }
    return cuboidlist;
}

function printCube(cube) {
    let string = '';
    for (x = cube.x[0]; x <= cube.x[1]; x++) {
        for (y = cube.y[0]; y <= cube.y[1]; y++) {
            for (z = cube.z[0]; z <= cube.z[1]; z++) {
                string += x.toString() + ',' + y.toString() + ',' + z.toString() + ' ';
            }
        }
    }
    console.log(string);
    console.log('');
}

function printCubes(cubeslist) {
    for (cube of cubeslist) {
        printCube(cube);
    }
}

rawboxes = [];
for (instructionindex in dataset) {
    var keyword = dataset[instructionindex].split(' ')[0];
    var numbers = dataset[instructionindex].match(/(\-*\d+)/g).map(x => parseInt(x, 10));
    var newbox = { id: instructionindex, x: [numbers[0], numbers[1]], y: [numbers[2], numbers[3]], z: [numbers[4], numbers[5]], action: keyword };
    rawboxes.push(newbox);
}

var finalboxeslist = [rawboxes[0]];
console.log(`Executed step action: ${finalboxeslist[0].action}, ${countActiveCubes(finalboxeslist)} boxes active`);

for (rawbox of rawboxes.slice(1)) {
    let boxesnotoverlappinglist = [];
    for (boxindex in finalboxeslist) {
        if (doCuboidsOverlap(rawbox, finalboxeslist[boxindex])) {
            //Get one or more boxes that no longer overlap with finalboxeslist[boxindex].
            let newboxeslist = makeCuboidsNotOverlap(rawbox, finalboxeslist[boxindex]);
            boxesnotoverlappinglist = boxesnotoverlappinglist.concat(newboxeslist);
        } else{
            boxesnotoverlappinglist.push(finalboxeslist[boxindex]);
        }
    }
    //So at this point we have a list of square cubes that do not overlap with rawbox.
    if (rawbox.action == 'on') {
        boxesnotoverlappinglist.push(rawbox);
    }
    finalboxeslist = boxesnotoverlappinglist;
    console.log(`Executed step action: ${rawbox.action}, ${countActiveCubes(finalboxeslist)} boxes active`)
    // for (box of finalboxeslist) {
    //     console.log(`box x=${box.x.join(',')}  y=${box.y.join(',')} z=${box.z.join(',')} size=${_volumeCube(box)}`);
    //     printCube(box);
    // }
    //Turning boxes off has already happened because they are pushed from the remaining list.
}


console.log(`Actieve cuboids: ${countActiveCubes(finalboxeslist)}`);