var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var matrix = dataset.map(a => a.split('').map(x => parseInt(x, 10)));
var ydist = matrix.length;
var xdist = matrix[0].length;

var firstpoint = { x: 0, y: 0, dist: 0 };
var allPoints = [firstpoint];
var UnVisitedpoints = [firstpoint];

function getPoint(xcor, ycor) {
    return allPoints.find(par => par.x == xcor && par.y == ycor)
}
function getIndex(xcor, ycor) {
    return allPoints.findIndex(a => a.x == xcor && a.y == ycor)
}

function getNeighbours(point) {
    for (let dir of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        let xcor = point.x + dir[0];
        let ycor = point.y + dir[1];
        if (xcor < xdist && ycor < ydist && xcor >= 0 && ycor >= 0) {
            let value = matrix[ycor][xcor] + point.dist;
            let neighbourindex = getIndex(xcor, ycor);
            if (neighbourindex != -1) {
                if (value < neighbourindex.dist) {
                    allPoints[neighbourindex].dist = value;
                    let unvisitedindex = UnVisitedpoints.findIndex(a => a.x == xcor && a.y == ycor);
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
while (getPoint(xfinish, yfinish) == undefined) {
    //Get the element with the lowest dist.
    UnVisitedpoints = UnVisitedpoints.sort((a, b) => a.dist - b.dist)
    let shortestUnvisitedPoint = UnVisitedpoints.shift();
    getNeighbours(shortestUnvisitedPoint);

}
console.log(getPoint(xfinish, yfinish).dist);