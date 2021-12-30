const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');



var range = 51;
var xoffset = range;
var yoffset = range;
var zoffset = range;

var xdist = 2 * range;
var ydist = 2 * range;
var zdist = 2 * range;


//Generate an empty field with size xdist,ydist,zdist.
function newCuboid() {
    let newCuboid = [];
    //Setup an empty field
    for (let i = 0; i < zdist; i++) {
        plate = []
        for (let j = 0; j < ydist; j++) {
            plate.push(new Array(xdist).fill(false));
        }
        newCuboid.push(plate);
    }
    return newCuboid;
}

var cuboid = newCuboid();
for (instruction of dataset) {
    var keyword = instruction.split(' ')[0];
    var numbers = instruction.match(/(\-*\d+)/g).map(x=>parseInt(x,10));
    if (numbers[0] > -range, numbers[2] > -range, numbers[4] > -range,
        numbers[1] < range, numbers[3] < range, numbers[5] < range) {
        var xrange = [numbers[0], numbers[1]];
        var yrange = [numbers[2], numbers[3]];
        var zrange = [numbers[4], numbers[5]];
        for (z = zrange[0]; z <= zrange[1]; z++) {
            for (y = yrange[0]; y <= yrange[1]; y++) {
                for (x = xrange[0]; x <= xrange[1]; x++) {
                    cuboid[z + zoffset][y + yoffset][x + xoffset] = keyword == 'on';
                }
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