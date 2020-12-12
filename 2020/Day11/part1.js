var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var completearray = array.map(str => str.split(''));
var h = completearray.length;
var w = completearray[0].length;
console.log(h + " " + w);

//Check whether a seat is occupied.
function IsOccupiedSeat(str) {
    return str == '#';
}

//return how many occupied neighbours a given seat in a field has. 
function GetNeighbours(xvalue, yvalue, neighbourfield) {
    // console.log("x "+ xvalue +" y " + yvalue);
    let occupiedseats = 0;
    if (xvalue > 0 && yvalue > 0 && IsOccupiedSeat(neighbourfield[xvalue - 1][yvalue - 1])) {
        occupiedseats++;
    }
    if (xvalue > 0 && IsOccupiedSeat(neighbourfield[xvalue - 1][yvalue])) {
        occupiedseats++;
    }

    if (xvalue > 0 && yvalue < w - 1 && IsOccupiedSeat(neighbourfield[xvalue - 1][yvalue + 1])) {
        occupiedseats++;
    }
    if (yvalue > 0 && IsOccupiedSeat(neighbourfield[xvalue][yvalue - 1])) {
        occupiedseats++;
    }
    if (yvalue < w - 1 && IsOccupiedSeat(neighbourfield[xvalue][yvalue + 1])) {
        occupiedseats++;
    }
    if (xvalue < h - 1 && yvalue > 0 && IsOccupiedSeat(neighbourfield[xvalue + 1][yvalue - 1])) {
        occupiedseats++;
    }
    if (xvalue < h - 1 && IsOccupiedSeat(neighbourfield[xvalue + 1][yvalue])) {
        occupiedseats++;
    }
    if (xvalue < h - 1 && yvalue < w - 1 && IsOccupiedSeat(neighbourfield[xvalue + 1][yvalue + 1])) {
        occupiedseats++;
    }
    return occupiedseats;
}

//Console log the new field.
function printField(field) {
    for (line of field) {
        console.log(line.join(''));
    }
}

//Create a new unrelated field
function sliceField(field) {
    let newfield = []
    for (a in field) {
        newfield[a] = field[a].slice();
    }
    console.assert(areFieldsEqual(field, newfield));
    return newfield;
}

//generate a new iteration of the field.
function GetNewField(field) {
    var newfield = sliceField(field);
    for (var a = 0; a < h; a++) {
        for (var b = 0; b < w; b++) {
            let neighbours = GetNeighbours(a, b, field);
            if (neighbours == 0 && field[a][b] == 'L') {
                newfield[a][b] = '#';
            } else if (neighbours >= 4 && field[a][b] == '#') {
                newfield[a][b] = 'L';
            }
        }
    }
    return newfield;
}

//check whether two fields are the same.
function areFieldsEqual(field1, field2) {
    return JSON.stringify(field1) === JSON.stringify(field2); //given by stackexchange, not very efficient.
}

function countOccupiedSeats(field) {
    let count = 0;
    for (a in field) {
        for (b in field[a]) {
            if (field[a][b] == '#') {
                count++;
            }
        }
    }
    return count;
}

var field = completearray;
console.log("Field");
printField(field);

var newfield = GetNewField(field);



while (!areFieldsEqual(field, newfield)) {
    field = newfield;
    newfield = GetNewField(field);
    
}
console.log("finalfield");
printField(newfield)
console.log("Occupied seats: " + countOccupiedSeats(newfield));