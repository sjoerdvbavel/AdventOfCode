const { assert, Console } = require('console');
const path = require('path');

function unitTest(array, stringvalue) {
    if (JSON.stringify(array) != stringvalue) {
        console.log(`Test failed ${JSON.stringify(array)} != ${stringvalue}`);
    }
}

function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n");

    //Turn the lines into 
    let dataset = [];
    for (line of rawDataSet) {
        let splits = line.split(' ');

        dataset.push({ from: splits[0], to: splits[2], dist: parseInt(splits[4], 10) });
    }
    //Get all towns
    let allTownsSet = new Set();
    for (obj of dataset) {
        allTownsSet.add(obj.from);
        allTownsSet.add(obj.to);
    }
    var allTowns = Array.from(allTownsSet);

    //Build a dist grid
    var grid = {};
    for (town of allTowns) {
        grid[town] = {};
    }
    for (pathway of dataset) {
        grid[pathway.from][pathway.to] = pathway.dist;
        grid[pathway.to][pathway.from] = pathway.dist;
    }
    return [grid, allTowns];
}
//Return a copy of the array without element.
function SliceElement(array, element) {
    index = array.findIndex(x => x == element);
    if (index != -1) {
        return array.slice(0, index).concat(array.slice(index + 1, array.length));
    } else {
        return array.slice();
    }
}
unitTest(SliceElement(['a', 'b'], 'b'), '["a"]');

function shortestPath(loc, restList, grid) {
    let startloc = loc;
    if (restList.length == 0) {
        return [0, startloc];
    }
    let min = [Infinity, ''];
    let pathstring = 'bust';
    for (let item of restList) {
        let otherTownsList = SliceElement(restList, item);
        let nmin = shortestPath(item, otherTownsList, grid);
        nmin[0] += grid[startloc][item];
        if (nmin[0] < min[0]) {
            min = nmin.slice();
            pathstring = `${startloc}(${grid[startloc][item]}) -> ${nmin[1]}`;
            // console.log(`${currItem} ${JSON.stringify(otherTownsList)} ${pathstring}`)
        }
    }
    return [min[0], pathstring];
}

function longestPath(loc, restList, grid) {
    let startloc = loc;
    if (restList.length == 0) {
        return [0, startloc];
    }
    let max = [-1 , ''];
    let pathstring = 'bust';
    for (let item of restList) {
        let otherTownsList = SliceElement(restList, item);
        let nmax = longestPath(item, otherTownsList, grid);
        nmax[0] += grid[startloc][item];
        if (nmax[0] > max[0]) {
            max = nmax.slice();
            pathstring = `${startloc}(${grid[startloc][item]}) -> ${nmax[1]}`;
            // console.log(`${currItem} ${JSON.stringify(otherTownsList)} ${pathstring}`)
        }
    }
    // console.log(`Found shortest path from ${startloc} through ${JSON.stringify(restList)} dist:${min[0]} Path: ${pathstring}`);
    return [max[0], pathstring];
}

function executePart1(dataset) {
    grid = dataset[0];
    allTowns = dataset[1];

    min = [Infinity, 'start'];
    for (let town of allTowns) {
        let allOtherTowns = SliceElement(allTowns, town);
        assert(allOtherTowns.length == allTowns.length - 1)
        nmin = shortestPath(town, allOtherTowns, grid);
        if(nmin[0] < min[0]){
            min = nmin
        }
    }
    console.log(min[1] + ' = ' + min[0]);
    return min[0];
}

function executePart2(dataset) {
    grid = dataset[0];
    allTowns = dataset[1];
    max = [-1, 'start'];
    for (let town of allTowns) {
        let allOtherTowns = SliceElement(allTowns, town);
        assert(allOtherTowns.length == allTowns.length - 1)
        nmax = longestPath(town, allOtherTowns, grid);
        if(nmax[0] > max[0]){
            max = nmax
        }
    }
    console.log(max[1] + ' = ' + max[0]);
    return max[0];
}

function execute() {
    let testdata1 = parseData('testdata.txt');
    let testresult1 = executePart1(testdata1);
    if (testresult1) {
        console.log(`testdata part1: ${testresult1}`);
    }
    let testdata2 = parseData('testdata.txt');
    let testresult2 = executePart2(testdata2);
    if (testresult2) {
        console.log(`testdata part2: ${testresult2}`);
    }
    let realdata1 = parseData('data.txt');
    let result1 = executePart1(realdata1);
    if (result1) {
        console.log(`part1: ${result1}`);
    }
    let realdata2 = parseData('data.txt');
    let result2 = executePart2(realdata2);
    if (testresult2) {
        console.log(`part2: ${result2}`);
    }
}

execute();