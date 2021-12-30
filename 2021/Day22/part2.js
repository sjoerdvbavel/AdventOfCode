//Attempt 1, out of memory bound...

const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');



var range = 51;
var xrange = [0, 0];
var yrange = [0, 0];
var zrange = [0, 0];

for (instruction of dataset) {
    var keyword = instruction.split(' ')[0];
    var numbers = instruction.match(/(\-*\d+)/g).map(x => parseInt(x, 10));
    if (numbers[0] < xrange[0]) {
        xrange[0] = numbers[0];
    }
    if (numbers[1] > xrange[1]) {
        xrange[1] = numbers[1];
    }
    if (numbers[2] < yrange[0]) {
        yrange[0] = numbers[2];
    }
    if (numbers[4] > yrange[1]) {
        yrange[1] = numbers[1];
    }
    if (numbers[5] < zrange[0]) {
        zrange[0] = numbers[5];
    }
    if (numbers[5] > zrange[1]) {
        zrange[1] = numbers[5];
    }
}
var xoffset = xrange[0];
var yoffset = yrange[0];
var zoffset = zrange[0];


//Generate an empty field with size xdist,ydist,zdist.
function newCuboid() {
    let newCuboid = [];
    //Setup an empty field
    for (let i = zrange[0]; i < zrange[1]; i++) {
        plate = []
        for (let j = yrange[0]; j < yrange[1]; j++) {
            plate.push(new Array(xrange[1]-xrange[0]).fill(false));
        }
        newCuboid.push(plate);
    }
    return newCuboid;
}

var cuboid = newCuboid();
for (instruction of dataset) {
    var keyword = instruction.split(' ')[0];
    var numbers = instruction.match(/(\-*\d+)/g).map(x => parseInt(x, 10));

    var instructionxrange = [numbers[0], numbers[1]];
    var instructionyrange = [numbers[2], numbers[3]];
    var instructionzrange = [numbers[4], numbers[5]];
    for (z = instructionzrange[0]; z <= instructionzrange[1]; z++) {
        for (y = instructionyrange[0]; y <= instructionyrange[1]; y++) {
            for (x = instructionxrange[0]; x <= instructionxrange[1]; x++) {
                cuboid[z + zoffset][y + yoffset][x + xoffset] = keyword == 'on';
            }
        }
    }
}

function countActiveCubes(cuboid) {
    let count = 0;
    for (a in cuboid) {
        for (b in cuboid[a]) {
            for (c in cuboid[a][b]) {
                if (cuboid[a][b][c]) {
                    count++;
                }
            }
        }
    }
    return count;
}

console.log(`Actieve cuboids: ${countActiveCubes(cuboid)}`);