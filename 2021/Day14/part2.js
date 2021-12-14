var fs = require('fs');
var path = require('path');
const { off } = require('process');
var filePath = path.join(__dirname, 'data.txt');
var datasets = fs.readFileSync(filePath).toString().split('\r\n\r\n');

var template = datasets[0];

function parseRule(rulestring) {
    let ruleparts = rulestring.split(' -> ');
    let output = [ruleparts[0][0] + ruleparts[1], ruleparts[1] + ruleparts[0][1]];
    return { input: ruleparts[0], output: output };
}


function getOccurances(string, substring) {
    let searchindex = 0;
    let returnlist = [];
    while (string.indexOf(substring, searchindex) != -1) {
        returnlist.push(string.indexOf(substring, searchindex));
        searchindex = string.indexOf(substring, searchindex) + 1;
    }
    return returnlist;
}

//Turn the input into an object of pairs.
function parseTemplate(string) {
    let returnobject = {};
    for (let i = 0; i < string.length - 1; i++) {
        substring = string.substring(i, i + 2);
        returnobject[substring] ? returnobject[substring]++ : returnobject[substring] = 1;
    }
    return returnobject;
}

//Generate the next generation.
function polymerize(pairobject, ruleset) {
    let newPairObject = {};
    for (rule of ruleset) {
        if (pairobject[rule.input]) {
            let occurances = pairobject[rule.input];
            for (output of rule.output) {
                newPairObject[output] ? newPairObject[output] += occurances : newPairObject[output] = occurances;
            }
        }else{

        }
    }
    return newPairObject;
}

function getResultcount(object, startingstring) {
    let total = {};
    for (let pair in object) {
        let beginletter = pair[0];
        total[beginletter] ? total[beginletter] += object[pair] : total[beginletter] = object[pair];
    }
    //Add in the last letter (only one not in a pair):
    let lastletter = startingstring[startingstring.length-1];
    total[lastletter] ? total[lastletter]++ : total[lastletter] = 1;


    let min = Number.MAX_VALUE;
    let max = -1;

    for (k in total) {
        if (total[k] < min) {
            min = total[k];
        }
        if (total[k] > max) {
            max = total[k];
        }
    }
    return max - min;
}

let polymerobject = parseTemplate(template);
var rules = datasets[1].split('\r\n').map(parseRule);

//Call the actual polymarization 40 times:
console.log(`Template: ${template}`);
for (let i = 1; i <= 40; i++) {
    polymerobject = polymerize(polymerobject, rules);
    console.log(`After step ${i}:`);
    console.log(`Length ${Object.values(polymerobject).reduce((a, b) => a + b)+1}, answer: ${getResultcount(polymerobject, template)}`);
}