var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n");

var startingField = dataSet.map(str => str.split(''));

var w = startingField[0].length;
var h = startingField.length;

//For this we create a field of the maximal size that can be reached. The starting field and a border of 6 around it.
//Oriented as: field[z][y][x]
//Origin of the starting field is: (n, n, n) to (n+w, n+h, n)

let n = 6;
let xdist = w + 2 * n;
let ydist = h + 2 * n;
let zdist = 1 + 2 * n;


//Check whether a cell is occupied.
function IsActive(str) {
    return str == '#';
}


function GetActive(xvalue, yvalue, zvalue, cube) {
    // console.log("x "+ xvalue +" y " + yvalue);
    let neighbours = 0;
    let range = [-1, 0, 1];
    for (let zcursor of range) {
        for (let ycursor of range) {
            for (let xcursor of range) {
                let x = xvalue + xcursor;
                let y = yvalue + ycursor;
                let z = zvalue + zcursor;
                let fieldtoCheck = (xcursor != 0 || ycursor != 0 || zcursor != 0)
                    && (x >= 0 && y >= 0 && z >= 0)
                    && (x < xdist && y < ydist && z < zdist);
                if (fieldtoCheck) {
                    if (IsActive(cube[z][y][x])) {
                        neighbours++;
                        if (neighbours > 3) {
                            return (4);
                        }
                    }
                }
            }
        }
    }
    return neighbours;
}

//Generate an empty field with size xdist,ydist,zdist.
function NewField() {
    let newfield = []
    //Setup an empty field
    for (let i = 0; i < zdist; i++) {
        plate = []
        for (let j = 0; j < ydist; j++) {
            plate.push(new Array(xdist).fill('.'));
        }
        newfield.push(plate);
    }
    return newfield;
}

//Generate an empty field and enter the starting state.
function GenerateField(startingfield) {
    let newfield = NewField();

    for (let k = 0; k < startingfield.length; k++) {
        for (let l = 0; l < startingfield[0].length; l++) {
            newfield[n][n + k][n + l] = startingfield[k][l];
        }
    }
    return newfield;
}

//Console log the new field.
function printField(field) {
    for (let k = 0; k < field.length; k++) {
        if (JSON.stringify(field[k]).includes('#')) {
            console.log('z = ' + (k));
            console.log('  123456789012345');
            for (let l = 0; l < field[0].length; l++) {
                console.log((l % 10) + ' ' + field[k][l].join(''));
            }
        }
    }
}



//Console log the counts of a field (capped at 4).
function printCounts(field) {
    let newfield = NewField();

    for (var a = 0; a < xdist; a++) {
        for (var b = 0; b < ydist; b++) {
            for (var c = 0; c < zdist; c++) {
                let numberactive = GetActive(a, b, c, field);
                newfield[c][b][a] = numberactive.toString();

            }
        }
    }
    for (let k = 0; k < newfield.length; k++) {
        if (JSON.stringify(newfield[k]).includes('1')) {
            console.log('z = ' + (k));
            console.log('  123456789012345');
            for (let l = 0; l < newfield[0].length; l++) {
                console.log((l % 10) + ' ' + newfield[k][l].join(''));
            }
        }
    }
}


//generate a new iteration of the field.
function GetNewField(field) {
    var newfield = NewField();
    for (var a = 0; a < xdist; a++) {
        for (var b = 0; b < ydist; b++) {
            for (var c = 0; c < zdist; c++) {
                let numberactive = GetActive(a, b, c, field);

                if (numberactive == 3) {
                    newfield[c][b][a] = '#';
                } else if (numberactive == 2 && field[c][b][a] == '#') {
                    newfield[c][b][a] = '#';
                }
            }
        }
    }
    return newfield;
}


function countLiveCells(field) {
    let count = 0;
    for (a in field) {
        for (b in field[a]) {
            for (c in field[a][b]) {
                if (field[a][b][c] == '#') {
                    count++;
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

for(i = 0; i < 6; i++){
field = GetNewField(field);
}
console.log(countLiveCells(field));



// while (!areFieldsEqual(field, newfield)) {
//     field = newfield;
//     newfield = GetNewField(field);
// }
// console.log("finalfield");
// printField(newfield)
// console.log("Occupied seats: " + countOccupiedSeats(newfield));