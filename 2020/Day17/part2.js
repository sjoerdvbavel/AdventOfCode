var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n");

var startingField = dataSet.map(str => str.split(''));

var w = startingField[0].length;
var h = startingField.length;

//For this we create a field of the maximal size that can be reached. The starting field and a border of 6 around it.
//Oriented as: field[w][z][y][x]
//Origin of the starting field is: (n, n, n, n) to (n+w, n+h, n, n)

let n = 6;
let xdist = w + 2 * n;
let ydist = h + 2 * n;
let zdist = 1 + 2 * n;
let wdist = 1 + 2 * n;

//Generate an empty field with size xdist,ydist,zdist,wdist.
function NewField() {
    let newfield = []
    //Setup an empty field
    for (let i = 0; i < wdist; i++) {
        cube = []
        for (let j = 0; j < zdist; j++) {
            plate = []
            for (let k = 0; k < ydist; k++) {
                plate.push(new Array(xdist).fill('.'));
            }
            cube.push(plate);
        }
        newfield.push(cube);
    }
    return newfield;
}

//Generate an empty field and enter the starting state.
function GenerateField(startingfield) {
    let newfield = NewField();

    for (let k = 0; k < startingfield.length; k++) {
        for (let l = 0; l < startingfield[0].length; l++) {
            newfield[n][n][n + k][n + l] = startingfield[k][l];
        }
    }
    return newfield;
}

//generate a new iteration of the field.
function GetNewField(field) {
    var newfield = NewField();
    for (var a = 0; a < xdist; a++) {
        for (var b = 0; b < ydist; b++) {
            for (var c = 0; c < zdist; c++) {
                for (var d = 0; d < wdist; d++) {
                    let numberactive = GetActive(a, b, c, d, field);

                    if (numberactive == 3) {
                        newfield[d][c][b][a] = '#';
                    } else if (numberactive == 2 && field[d][c][b][a] == '#') {
                        newfield[d][c][b][a] = '#';
                    }
                }
            }
        }
    }
    return newfield;
}

//Check whether a cell is occupied.
function IsActive(str) {
    return str == '#';
}


function GetActive(xvalue, yvalue, zvalue, wvalue, cube) {
    // console.log("x "+ xvalue +" y " + yvalue);
    let neighbours = 0;
    let range = [-1, 0, 1];
    for (let wcursor of range) {
        let w = wvalue + wcursor;
        for (let zcursor of range) {
            let z = zvalue + zcursor;
            for (let ycursor of range) {
                let y = yvalue + ycursor;
                for (let xcursor of range) {
                    let x = xvalue + xcursor;
                    let fieldtoCheck = (xcursor != 0 || ycursor != 0 || zcursor != 0 || wcursor != 0)
                        && (x >= 0 && y >= 0 && z >= 0 && w >= 0)
                        && (x < xdist && y < ydist && z < zdist && w < wdist);
                    if (fieldtoCheck) {
                        if (IsActive(cube[w][z][y][x])) {
                            neighbours++;
                            if (neighbours > 3) {
                                return (4);
                            }
                        }
                    }
                }
            }
        }
    }
    return neighbours;
}

//Console log the new field.
function printField(field) {
    for (let k = 0; k < field.length; k++) {
        if (JSON.stringify(field[k]).includes('#')) {
            for (let l = 0; l < field[k].length; l++) {
                if (JSON.stringify(field[k][l]).includes('#')) {
                    console.log('z = ' + l + ', w=' + k);
                    console.log('  123456789012345');
                    for (let m = 0; m < field[0][0].length; m++) {
                        console.log((m % 10) + ' ' + field[k][l][m].join(''));
                    }
                }
            }
        }
    }
}


//Console log the counts of a field (counts are capped at 4).
function printCounts(field) {
    let newfield = NewField();

    for (var a = 0; a < xdist; a++) {
        for (var b = 0; b < ydist; b++) {
            for (var c = 0; c < zdist; c++) {
                for (var d = 0; d < wdist; d++) {
                    let numberactive = GetActive(a, b, c, d, field);
                    newfield[d][c][b][a] = numberactive.toString();
                }
            }
        }
    }

    for (let k = 0; k < newfield.length; k++) {
        if (JSON.stringify(newfield[k]).includes('1')) {
            for (let l = 0; l < newfield.length; l++) {
                if (JSON.stringify(newfield[l]).includes('1')) {
                    console.log('z = ' + l + ', w=' + k);
                    console.log('  123456789012345');
                    for (let m = 0; m < newfield[0].length; m++) {
                        console.log((m % 10) + ' ' + newfield[k][l][m].join(''));
                    }
                }
            }
        }
    }
}

function countLiveCells(field) {
    let count = 0;
    for (a in field) {
        for (b in field[a]) {
            for (c in field[a][b]) {
                for (d in field[a][b][c]) {
                    if (field[a][b][c][d] == '#') {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

var field = GenerateField(dataSet);
printField(field);
// printCounts(field);
// field = GetNewField(field);
// printField(field);

for (i = 0; i < 6; i++) {
    field = GetNewField(field);
}
console.log(countLiveCells(field));