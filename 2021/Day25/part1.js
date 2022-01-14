const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
const { off } = require('process');
const { start } = require('repl');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var startfield = dataset.map(x => x.split(''));
var xlim = dataset[0].length;
var ylim = dataset.length;


function emptyfield() {
    let returnfield = [];
    for (let y = 0; y < ylim; y++) {
        returnfield.push(new Array(xlim).fill('.'));
    }
    return returnfield;
}

function comparefield(field1, field2) {
    return JSON.stringify(field1) == JSON.stringify(field2);
}

function increaseStep(field) {
    let newfield = emptyfield();
    //Step the '>' seacumcumbers.
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            if (field[y][x] == '>') {
                let xplus = (x + 1) % xlim
                if (field[y][xplus] == '.') {
                    newfield[y][xplus] = '>';
                } else {
                    newfield[y][x] = '>';
                }
            } else if (field[y][x] == 'v') {
                newfield[y][x] = 'v';
            }
        }
    }
    let newfield2 = emptyfield();
    //Step the 'v' seacumcumbers.
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            if (newfield[y][x] == 'v') {
                let yplus = (y + 1) % ylim
                if (newfield[yplus][x] == '.') {
                    newfield2[yplus][x] = 'v';
                } else {
                    newfield2[y][x] = 'v';
                }
            } else if (newfield[y][x] == '>') {
                newfield2[y][x] = '>';
            }
        }
    }

    return newfield2;
}

function printfield(field) {
    for (row of field) {
        console.log(row.join(''));
    }
}




//Execute part1:

var counter = 0;
var oldfield = startfield;
var newfield = increaseStep(startfield);
console.log('Initial state:');
printfield(oldfield);
while (!comparefield(oldfield, newfield)) {
    oldfield = newfield;
    newfield = increaseStep(oldfield);
    counter++;

    if (counter < 5 || counter % 10 == 0) {
        console.log('');
        console.log(`After ${counter} steps:`);
        printfield(oldfield);
    }
}

printfield(newfield);
console.log(`Finished after ${counter+1} iterations.`)