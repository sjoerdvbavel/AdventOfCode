var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var completearray = array.map(str => str.split(''));
var h = completearray.length;
var w = completearray[0].length;
// console.log(h + " " + w);

//Check whether an occupied seat is seen in the given direction.
function SeesOccupiedSeat(xspot, yspot, xdir, ydir, field) {
    let xloc = xspot + xdir;
    let yloc = yspot + ydir;
    while(xloc < h && xloc >= 0 && yloc < w && yloc >= 0){
        if(field[xloc][yloc] == '#'){
            return true
        } else if(field[xloc][yloc] == 'L'){
            return false
        }
        yloc += ydir;
        xloc += xdir;
    }
    return false;
}

//return how many occupied neighbours a given seat in a field sees. 
function GetNeighbours(xvalue, yvalue, neigbourfield) {
    // console.log("x "+ xvalue +" y " + yvalue);
    let occupiedseats = 0;
    if (SeesOccupiedSeat(xvalue, yvalue, 0, 1 ,neigbourfield)) {
        occupiedseats++;
    }
    if (SeesOccupiedSeat(xvalue, yvalue, 1, 1 ,neigbourfield)) {
        occupiedseats++;
    }

    if (SeesOccupiedSeat(xvalue, yvalue, 1, 0 ,neigbourfield)) {
        occupiedseats++;
    }
    if (SeesOccupiedSeat(xvalue, yvalue, 1, -1 ,neigbourfield)) {
        occupiedseats++;
    }
    if (SeesOccupiedSeat(xvalue, yvalue, 0, -1 ,neigbourfield)) {
        occupiedseats++;
    }
    if (SeesOccupiedSeat(xvalue, yvalue, -1, -1 ,neigbourfield)) {
        occupiedseats++;
    }
    if (SeesOccupiedSeat(xvalue, yvalue, -1, 0 ,neigbourfield)) {
        occupiedseats++;
    }
    if (SeesOccupiedSeat(xvalue, yvalue, -1, 1 ,neigbourfield)) {
        occupiedseats++;
    }
    return occupiedseats;
}

//Console log the field.
function printField(field) {
    for (line of field) {
        console.log(line.join(''));
    }
}

//Slice a field
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
            } else if (neighbours >= 5 && field[a][b] == '#') {
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

//Count how many occupied seats are in the given field.
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
// console.log("newField");
// printField(newfield);

// console.log(GetNeighbours(0, 3, newnewfield));
while (!areFieldsEqual(field, newfield)) {
    field = newfield;
    newfield = GetNewField(field);
}
console.log("finalfield");
printField(newfield)
console.log("Occupied seats: " + countOccupiedSeats(newfield));