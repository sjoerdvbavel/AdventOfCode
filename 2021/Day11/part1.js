const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n').map(x => x.split('').map(y => parseInt(y, 10)));

var xlim = dataset[0].length;
var ylim = dataset.length;

function _explodeOctopus(field, x, y) {
    //Increase all neighbours that haven't exploded yet.
    for (xdir of [-1, 0, 1]) {
        for (ydir of [-1, 0, 1]) {
            let xcor = x + xdir;
            let ycor = y + ydir;
            if (xcor >= 0 && xcor < xlim && ycor >= 0 && ycor < ylim) {
                if (field[ycor][xcor] != 0) {
                    field[ycor][xcor]++;
                }
            }
        }
    }
    //Reset the square itself.
    field[y][x] = 0;
    return field;
}

function increaseStep(field) {
    //Increase the field.
    for (let x = 0; x < field.length; x++) {
        for (let y = 0; y < field[0].length; y++) {
            field[y][x]++;
        }
    }

    //Explode the octopodes
    let flashes = 0;
    while (!field.flat().every(x => x <= 9)) {
        for (let x = 0; x < field[0].length; x++) {
            for (let y = 0; y < field.length; y++) {
                if (field[y][x] > 9) {
                    field = _explodeOctopus(field, x, y);
                    flashes++;
                }
            }
        }
    }
    return [field, flashes];
}

var testmode = true;
var nextfield = dataset;
var totalflashes = 0;
for (let i = 0; i < 100; i++) {
    let result = increaseStep(nextfield);
    nextfield = result[0];
    totalflashes += result[1];

    if (testmode) {
        if (i < 10 || (i + 1) % 10 == 0) {
            console.log(`After step ${i + 1}:`)
            for (row of nextfield) {
                console.log(row.join(''));
            }
            console.log('');
        }
    }
}
console.log(`Total flashes: ${totalflashes}`);

//Part2
var allflashed = false;
var stepcounter = 100;
while(!allflashed){
    let result = increaseStep(nextfield);
    nextfield = result[0];
    totalflashes += result[1];
    stepcounter++;
    if(stepcounter % 100 == 0){
        console.log(`No big flash yet at ${stepcounter}`);
    }
    if(result[1] == xlim * ylim){
        console.log(`All flashed at  ${stepcounter}`);
        allflashed = true;
    }
}