var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var dataset = fs.readFileSync(filePath).toString().split('\r\n');

function getErrorValue(char) {
    if (char == ')') {
        return 3;
    } else if (char == ']') {
        return 57;
    } else if (char == '}') {
        return 1197;
    } else if (char == '>') {
        return 25137;
    }
}

function getErrorRate(string) {
    let newstring =  removeValidBrackets(string);
    let firstError = /([\}\)\]\>])/.exec(newstring);
    if(firstError != null){
        return getErrorValue(firstError[0]);
    }
    return 0;
}

function iterateRemoval(string){
    let returnstring = string;
    returnstring = returnstring.replace(/\(\)/g, '');
    returnstring = returnstring.replace(/\{\}/g, '');
    returnstring = returnstring.replace(/\[\]/g, '');
    returnstring = returnstring.replace(/\<\>/g, '');
    return returnstring;
}

function removeValidBrackets(string){
    let oldlength = string.length;
    let newstring = iterateRemoval(string);
    while (newstring.length < oldlength){
        oldlength = newstring.length
        newstring = iterateRemoval(newstring);
    }
    return newstring;
}

console.log(dataset.map(x => `${x} ${getErrorRate(x)}`));
var errorrates = dataset.map(getErrorRate);
console.log(`Total error: ${errorrates.reduce((a,b)=> a+b)}`);
