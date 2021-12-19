var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var rawedges = dataset.map(x => x.split('-'));
var caves = [];
var smallcaves = [];

function isSmallCave(string) {
    return string.match(/([a-z]+)/g);
}

for (edge of rawedges) {
    //Update of add one end of the edge.
    let caveindex1 = caves.findIndex(a => a.id == edge[0]);
    if (caveindex1 != -1) {
        caves[caveindex1].edges.push(edge[1])
    } else {
        caves.push({ id: edge[0], edges: [edge[1]] });
        if (isSmallCave(edge[0])) {
            smallcaves.push(edge[0]);
        }
    }
    //Update the other edge of the cave.
    let caveindex2 = caves.findIndex(a => a.id == edge[1]);
    if (caveindex2 != -1) {
        caves[caveindex2].edges.push(edge[0])
    } else {
        caves.push({ id: edge[1], edges: [edge[0]] });
        if (isSmallCave(edge[1])) {
            smallcaves.push(edge[1]);
        }
    }

}
function getVisitableCaves(edges, visitedcaves) {
    let canStillVisitSmallCaveTwice = true;
    let counts = {};
    for (const smallcave of visitedcaves) {
        if (isSmallCave(smallcave)) {
            if (counts[smallcave]) {
                canStillVisitSmallCaveTwice = false;
                break;
            } else {
                counts[smallcave] = 1;
            }
        }
    }
    if (canStillVisitSmallCaveTwice) {
        return edges.filter(x => x != 'start');
    } else {
        let visitedSmallCaves = visitedcaves.filter(isSmallCave);
        return edges.filter(x => !visitedSmallCaves.includes(x));

    }
}

function countPaths(currentlocation, visitedcaves) {
    if (currentlocation.id == 'end') {
        console.log(visitedcaves.join(','));
        return 1;
    }

    let visitableCaves = getVisitableCaves(currentlocation.edges, visitedcaves);
    if (visitableCaves.length == 0) {
        return 0;
    }
    let total = 0;
    for (let CaveToVisitID of visitableCaves) {
        let CaveToVisit = caves.find(x => x.id == CaveToVisitID);
        let newvisitedsmallcaves = visitedcaves.concat(CaveToVisitID);
        total += countPaths(CaveToVisit, newvisitedsmallcaves);
    }
    return total;
}

//Execute
var startcave = caves.find(x => x.id == 'start');

var totalpaths = countPaths(startcave, [startcave.id]);

console.log(`found ${totalpaths} paths from start to end.`);