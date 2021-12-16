const { Console } = require('console');
var fs = require('fs');
const { parse } = require('path');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

var numbers = dataset.map(x => x.split('').map(y => parseInt(y, 10)));

var ylim = numbers.length;
var xlim = numbers[0].length;

function getValue(yval, xval) {
    if (xval >= 0 && yval >= 0 && xval < xlim && yval < ylim) {
        return numbers[yval][xval];
    } else {
        return 9;
    }

}

//return the risk of a set of coordinates, return -1 if it's not a low point.
function getRisk(xcor, ycor) {
    let spotvalue = numbers[ycor][xcor];
    let result = 0;
    for (dir of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        let neighbourvalue = getValue(ycor + dir[0], xcor + dir[1]);
        if (neighbourvalue <= spotvalue) return -1;
    }
    return spotvalue + 1;
}

let totalrisk = 0;
let lowpoints = [];
for (let y = 0; y < ylim; y++) {
    for (let x = 0; x < xlim; x++) {
        let riskval = getRisk(x, y);
        if (riskval != -1) {
            totalrisk += riskval;
            lowpoints.push([x, y]);
            console.log(`At ${x},${y} a risk of ${riskval} was found.`);
        }
    }
}

console.log(`Total risk: ${totalrisk}`);

//Begin part 2

//For every lowpoint we check the size of the bassin.
function getSizeBassin(x, y) {
    let bassin = generateEmptyArray();
    bassin[y][x] = true;
    let oldsize = countSizeBassin(bassin);
    bassin = checkEdgesBassin(bassin);
    let newsize = countSizeBassin(bassin);
    while (oldsize != newsize) {
        oldsize = newsize;
        bassin = checkEdgesBassin(bassin);
        newsize = countSizeBassin(bassin);
    }
    return newsize;
}

function generateEmptyArray() {
    let returnarray = []
    for (let i = 0; i < ylim; i++) {
        let newrow = new Array(xlim).fill(false)
        returnarray.push(newrow);
    }
    return returnarray;
}

function checkEdgesBassin(bassin) {
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            if (bassin[y][x]) {
                bassin = checkSinglePointBassin(x, y, bassin);
            }
        }
    }
    return bassin;
}

//Check the neighbours of a single coordinates.
function checkSinglePointBassin(x, y, bassin) {
    let pointvalue = numbers[y][x];
    for (let dir of [[1, 0], [0, 1], [-1, 0], [0, -1]]) {
        let yspot = y + dir[0];
        let xspot = x + dir[1];
        let neighbourvalue = getValue(yspot, xspot);
        if (neighbourvalue != 9 && neighbourvalue >= pointvalue){ 
            bassin[yspot][xspot] = true;
        }
    }
    return bassin;
}

function countSizeBassin(bassin){
    let value = 0;
    for (let y = 0; y < ylim; y++) {
        for (let x = 0; x < xlim; x++) {
            if (bassin[y][x]) {
                value++;
            }
        }
    }   
    return value;
}

//Call the functions
let bassinsizes = [];
for(spot of lowpoints){
    bassinsizes.push(getSizeBassin(spot[0],spot[1]));
}
let best3 = bassinsizes.sort((a,b)=> b-a).slice(0, 3);
console.log(`Best 3: ${best3} product: ${best3.reduce((a,b)=>a*b)}`);