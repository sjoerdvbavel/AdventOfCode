var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var datasets = fs.readFileSync(filePath).toString().split('\r\n\r\n');

var template = datasets[0];

function parseRule(rulestring) {
    let ruleparts = rulestring.split(' -> ');
    return { input: ruleparts[0], output: ruleparts[1] };
}
var rules = datasets[1].split('\r\n').map(parseRule);


function getOccurances(string, substring) {
    let searchindex = 0;
    let returnlist = [];
    while (string.indexOf(substring, searchindex) != -1) {
        returnlist.push(string.indexOf(substring, searchindex));
        searchindex = string.indexOf(substring, searchindex) + 1;
    }
    return returnlist;
}

//We assume all outputs are length 1.
function polymerize(string, ruleset) {
    let insertlist = [];
    for (rule of ruleset) {
        let results = getOccurances(string, rule.input);
        for (result of results) {
            insertlist.push([result, rule.output]);
        }
    }
    let offset = 0;
    let outputstring = string;

    let sortedInsertList = insertlist.sort((a, b) => a[0] - b[0]);

    for (insertion of sortedInsertList) {
        let position = insertion[0] + offset;
        outputstring = outputstring.substring(0, position+1) + insertion[1] + outputstring.substring(position+1);
        offset++;
    }
    return outputstring;
}
function getResultcount(string){
    let counter = string.split('').reduce((total, letter) => {
          total[letter] ? total[letter]++ : total[letter] = 1;
          return total;
        }, {});
    
    let min = 1000;
    let max = -1;
    
    for(k in counter){
        if(counter[k] < min){
            min = counter[k];
        }
        if(counter[k] > max){
            max = counter[k];
        } 
    }
    return max - min;
}

//Call the actual polymarization 10 times:
let workingPolymer = template;
console.log(`Template: ${workingPolymer}`);
for (let i = 1; i <= 10; i++) {
    workingPolymer = polymerize(workingPolymer, rules);
    console.log(`After step ${i}: ${workingPolymer.substring(0,100)}`);
    console.log(`Length ${workingPolymer.length}, answer: ${getResultcount(workingPolymer)}`);
}