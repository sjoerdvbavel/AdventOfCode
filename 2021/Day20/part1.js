const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n\r\n');

var algorithm = dataset[0].split('');

//Parse the image and add 4 rows of '.'
var n = 50;
var startrow = new Array(n).fill('.');
var image = dataset[1].split('\r\n').map(x => (startrow.slice().concat(x.split('')).concat(startrow.slice())));
var emptyrow = new Array(image[0].length).fill('.');
var startblock = new Array(n).fill('').map(x=>emptyrow.slice());
image = startblock.slice().concat(image).concat(startblock.slice());

var globalpixel = '.';

var xlim = image[0].length;
var ylim = image.length;

function _getValue(field, x, y) {
    let array = [
        x <= 1 || y <= 0 ? globalpixel : field[y - 1][x - 1],
        y <= 0 ? globalpixel : field[y - 1][x],
        x >= xlim - 1 || y <= 0 ? globalpixel : field[y - 1][x + 1],
        x <= 1 ? globalpixel : field[y][x - 1],
        field[y][x],
        x >= xlim - 1 ? globalpixel : field[y][x + 1],
        x <= 1 || y >= ylim - 1 ? globalpixel : field[y + 1][x - 1],
        y >= ylim - 1 ? globalpixel : field[y + 1][x],
        x >= xlim - 1 || y >= ylim - 1 ? globalpixel : field[y + 1][x + 1],
    ];
    let arraystring = array.reduce((a, b) => a + (b == '#' ? 1 : 0), '');
    let value = parseInt(arraystring, 2);
    return algorithm[value];
}


function applyAlgorithm(image) {
    let newimagerow = new Array(xlim).fill('.');
    let newimage = new Array(ylim).fill('.').map(x => newimagerow.slice());
    let litspots = 0;
    for (let x = 0; x < image[0].length; x++) {
        for (let y = 0; y < image.length; y++) {
            let newpixel = _getValue(image, x, y);
            if (newpixel == "#") {
                litspots++;
            }
            newimage[y][x] = newpixel;
        }
    }
    if (globalpixel == '#') {
        globalpixel = algorithm[512];
    } else {
        globalpixel = algorithm[0];
    }

    return [newimage, litspots];
}


function printimage(printimage) {
    for (row of printimage) {
        console.log(row.join(''));
    }
    console.log('');
}

console.log('start');

printimage(image);
let result = [image, '.'];
for(let i =0; i<50;i++){
result = applyAlgorithm(result[0]);
}
console.log(`litspots = ${result[1]}`);