var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var datasets = fs.readFileSync(filePath).toString().split('\r\n\r\n');

var points = datasets[0].split('\r\n').map(x => x.split(',').map(y=>parseInt(y,10)));
var folds = datasets[1].split('\r\n');

function executeFold(pointlist, foldorientation, fold) {
    let newlist = pointlist.slice();

    for (pointindex in newlist) {
        let point = newlist[pointindex];
        if (foldorientation == 'x') {
            if (parseInt(newlist[pointindex][0],10) > fold) {
                newlist[pointindex][0] = fold - (parseInt(newlist[pointindex][0],10) - fold);
            }
        } else if (foldorientation == 'y') {
            if (parseInt(newlist[pointindex][1],10) > fold) {
                newlist[pointindex][1] = fold - (parseInt(newlist[pointindex][1],10) - fold);
            }
        }
    }
    return newlist;
}

function printField(pointslist) {
    let maxx = 0;
    let maxy = 0;
    for (point of pointslist) {
        if (point[0] > maxx) {
            maxx = point[0];
        }
        if (point[1] > maxy) {
            maxy = point[1];
        }
    }
    for (let y = 0; y <= maxy; y++) {
        let xrow = ''
        let xpoints = pointslist.filter(k => k[1] == y).map(l => l[0]);
        for (let x = 0; x <= maxx; x++) {
            if (xpoints.findIndex(a => a == x) == -1) {
                xrow += '.';
            } else {
                xrow += 'x';
            }
        }
        console.log(xrow);
    }
}

function countpoints(list) {
    let uniques = [];
    for (point of list) {
        let pointstring = point.join('-');
        if (uniques.findIndex(x => x == pointstring) == -1) {
            uniques.push(pointstring);
        }
    }
    return uniques.length;
}

// printField(points);
for (foldstring of folds) {
    items = foldstring.split(' ')[2].split('=');
    points = executeFold(points, items[0], parseInt(items[1],10));
    console.log(`Fold ${items[0]}=${items[1]} has count ${countpoints(points)}`);
}
printField(points);