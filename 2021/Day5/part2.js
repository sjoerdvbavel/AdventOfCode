var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'testdata.txt');
var dataset = fs.readFileSync(filePath).toString().split("\r\n");

//Parse lines
let lines = [];
for (line of dataset) {
    let parsedline = line.split(' -> ').map(x => x.split(',').map(y => parseInt(y, 10)));
    lines.push({ x1: parsedline[0][0], y1: parsedline[0][1], x2: parsedline[1][0], y2: parsedline[1][1], })
}

//Determine field size;
let maxX = Math.max(...lines.map(line => line.x1), ...lines.map(line => line.x2));
let maxY = Math.max(...lines.map(line => line.y1), ...lines.map(line => line.y2));

var field = []
for (let i = 0; i <= maxY; i++) {
    field.push(new Array(maxX + 1).fill(0));
}

for (line of lines) {
    if (line.x1 == line.x2) {//horizontal line
        let start = Math.min(line.y1, line.y2);
        let end = Math.max(line.y1, line.y2);
        for (let y = start; y <= end; y++) {
            field[y][line.x1]++;
        }
    } else if (line.y1 == line.y2) { //vertical line
        let start = Math.min(line.x1, line.x2);
        let end = Math.max(line.x1, line.x2);
        for (let x = start; x <= end; x++) {
            field[line.y1][x]++;
        }
    } else if (line.x1 > line.x2 && line.y1 > line.y2) {//diagonal
        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
            field[line.y1 - i][line.x1 - i]++;
        }
    } else if (line.x1 > line.x2 && line.y1 < line.y2) {//diagonal
        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
            field[line.y1 + i][line.x1 - i]++;
        }
    } else if (line.x1 < line.x2 && line.y1 > line.y2) {//diagonal
        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
            field[line.y1 - i][line.x1 + i]++;
        }
    } else if (line.x1 < line.x2 && line.y1 < line.y2) {//diagonal
        for (let i = 0; i <= Math.abs(line.x2 - line.x1); i++) {
            field[line.y1 + i][line.x1 + i]++;
        }
    } else {
        console.log(line);
    }

}

//print the field:
for (let row of field) {
    console.log(row.reduce((a, b) => a + b.toString(), '').replace(/0/g, '.'));
}

//Count the occurances of numbers > 1.
let count = [].concat.apply([], field).filter(a => a > 1).length;
console.log(count);
