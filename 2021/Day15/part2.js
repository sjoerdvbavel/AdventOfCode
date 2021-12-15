var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var matrix = dataset.map(a => a.split('').map(x => parseInt(x, 10)));
var matrixrow = matrix.slice();

function incrementNumber(originalnumber, numbertoincrementwith) {
    return ((originalnumber - 1 + numbertoincrementwith) % 9) + 1;
}

//Create a row of 5 matrices back to back.
// Turn M into [M M M M M]
for (let j = 0; j < matrix.length; j++) {
    let row = matrix[j];
    for (let i = 1; i < 5; i++) {
        row = row.concat(matrix[j].map(n => incrementNumber(n, i)))
    }
    matrixrow[j] = row;
}

//Connect 5 row below each other:
var bigmatrix = matrixrow.slice();
for (let k = 1; k < 5; k++) {
    let newrow = matrixrow.slice().map(x => x.map(y => incrementNumber(y, k)));
    bigmatrix = bigmatrix.concat(newrow);
}

var ydist = bigmatrix.length;
var xdist = bigmatrix[0].length;

var firstpoint = { x: 0, y: 0, dist: 0 };
//The list of all points we have a path to.
var allPoints = [firstpoint];
//The list of all points we still have to explore (we found a path 2 them but haven't checked it's neighbours).
var UnVisitedpoints = [firstpoint];

function getPoint(xcor, ycor) {
    return allPoints.find(par => par.x == xcor && par.y == ycor);
}
function getIndex(xcor, ycor) {
    return allPoints.findIndex(a => a.x == xcor && a.y == ycor);
}

function visitPoint(point) {
    for (let dir of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        let xcor = point.x + dir[0];
        let ycor = point.y + dir[1];
        if (xcor < xdist && ycor < ydist && xcor >= 0 && ycor >= 0) {
            let value = bigmatrix[ycor][xcor] + point.dist;
            let neighbourindex = getIndex(xcor, ycor);//O(n)
            if (neighbourindex != -1) {
                if (value < neighbourindex.dist) {
                    allPoints[neighbourindex].dist = value;
                    let unvisitedindex = UnVisitedpoints.findIndex(a => a.x == xcor && a.y == ycor);//O(n)
                    if (unvisitedindex != -1) {
                        UnVisitedpoints[unvisitedindex].dist = value;
                    } else {
                        unvisitedindex.push(allPoints[neighbourindex]);
                    }
                }
            } else {
                let newpoint = { x: xcor, y: ycor, dist: value };
                allPoints.push(newpoint);
                UnVisitedpoints.push(newpoint);
            }
        }
    }
}
let xfinish = xdist - 1;
let yfinish = ydist - 1;

let counter = 0;
while (getPoint(xfinish, yfinish) == undefined) {//O(n)
    //Get the element with the lowest dist.
    UnVisitedpoints = UnVisitedpoints.sort((a, b) => a.dist - b.dist)//O(nlogn)
    let shortestUnvisitedPoint = UnVisitedpoints.shift();//O(n)
    visitPoint(shortestUnvisitedPoint);

    counter++;
    if (counter % 1000 == 0) {
        console.log(`explored: ${shortestUnvisitedPoint.x}, ${shortestUnvisitedPoint.y}`);
    }
}
console.log(getPoint(xfinish, yfinish).dist);