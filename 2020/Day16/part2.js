var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

let unparsedrules = dataSet[0].split("\r\n");
var myticket = dataSet[1].split("\r\n")[1].split(',').map(x => parseInt(x, 10));
let nearbytickets = dataSet[2].split("\r\n").slice(1).map(x => x.split(',').map(x => parseInt(x, 10)));

//parse a rule '1-3' becomes {start:1, end: 3}
function Parserule(line, rulename) {
    let splitline = line.split('-').map(n => parseInt(n));
    return { name: rulename, start: splitline[0], end: splitline[1] };
}

//parse the rules
var rules = [];
var ruleNames = []
for (ruleline of unparsedrules) {
    let ruleName = ruleline.split(': ')[0];
    let splitline = ruleline.split(': ')[1].split(' ');
    rules.push(Parserule(splitline[0], ruleName));
    rules.push(Parserule(splitline[2], ruleName));
    ruleNames.push(ruleName);
}
// console.log(rules);
console.log(ruleNames);


console.log(myticket);
// console.log(nearbytickets);

//Returns whether valuetocheck is between start and end of the rule.
function CheckRule(valuetocheck, rule) {
    return valuetocheck >= rule.start && valuetocheck <= rule.end;
}

//Find the error rates:
var validTickets = [];

for (ticket of nearbytickets) {
    let validTicket = true;
    for (value of ticket) {
        let validSomewhere = false;
        for (rule of rules) {
            if (CheckRule(value, rule)) {
                validSomewhere = true;
                break;
            }
        }
        if (!validSomewhere) {
            // console.log(value + ' was invalid for all rules.');
            validTicket = false;
            break;
        }
    }
    if (validTicket) {
        validTickets.push(ticket);
    }
}
//Returns whether valuetocheck is valid for one or more rules.
function CheckRules(valuetocheck, rule) {
    return (valuetocheck >= rule.start1 && valuetocheck <= rule.end1)
        || (valuetocheck >= rule.start2 && valuetocheck <= rule.end2);
}


console.log('Number of valid tickets: ' + validTickets.length);

//Returns all indices for could match this rule for the valid tickets.
function checkRuleWithIndices(rule, unsolvedIndices, validTickets) {
    let rulesToCheck = rules.slice().filter(obj => obj.name == rule.name);
    let possibleIndices = [];

    for (indice of unsolvedIndices) {
        let isIndiceValid = true;
        for (ticket of validTickets) {
            if (!CheckRules(ticket[indice], rulesToCheck)) {
                isIndiceValid = false;
            }
        }
        if (isIndiceValid) {
            possibleIndices.push(indice);
        }
    }
    return possibleIndices;
}
function AlternativeParseRule(string) {
    let sections = string.split(':');
    let name = sections[0];
    let numbers = sections[1].split(' ');
    let range1 = numbers[1].split('-');
    let range2 = numbers[3].split('-');
    return { name: name, start1: range1[0], end1: range1[1], start2: range2[0], end2: range2[1] }
}
var unsolvedRules = unparsedrules.map(x => AlternativeParseRule(x));
var unsolvedIndices = [];
for (var i = 0; i < myticket.length; i++) {
    unsolvedIndices.push(i);
}

//Return all rules that could be connect to the indice given the tickets.
function CheckIndiceWithRules(indice, rules, tickets) {
    returnrules = [];
    for (let rule of rules) {
        let couldbevalidRule = true;
        for (let ticket of tickets) {
            if (!CheckRules(ticket[indice], rule)) {
                couldbevalidRule = false;
                break;
            }
        }
        if (couldbevalidRule) {
            returnrules.push(rule);
        }
    }
    return returnrules;
}

//Return all indices that could be connect to the rule given the tickets.
function CheckRuleWithIndices(rule, indices, tickets) {
    let returnindices = [];
    for (let indice of indices) {
        let couldbevalidIndice = true;
        for (ticket of tickets) {
            if (!CheckRules(ticket[indice], rule)) {
                couldbevalidIndice = false;
                break;
            }
        }
        if (couldbevalidIndice) {
            returnindices.push(indice);
        }
    }
    return returnindices;
}
var solves = [];
while (unsolvedIndices.length != 0) {
    let nochange = true;
    for (let indice of unsolvedIndices) {
        let optionalRules = CheckIndiceWithRules(indice, unsolvedRules, validTickets);
        if (optionalRules.length == 1) {
            let solvedrule = optionalRules[0];
            solves.push({ rulename: solvedrule.name, value: myticket[indice] });
            unsolvedRules = unsolvedRules.filter(x => x.name != solvedrule.name);
            unsolvedIndices = unsolvedIndices.filter(x => x != indice);
            console.log('Matched rule ' + solvedrule.name + ' with indice ' + indice);
            nochange = false;
            break;
        }
    }
    for (let rule of unsolvedRules) {
        let optionalIndices = CheckRuleWithIndices(rule, unsolvedIndices, validTickets);
        if (optionalIndices.length == 1) {
            let solvedIndice = optionalIndices[0];
            solves.push({ rulename: rule.name, value: myticket[solvedIndice] });
            unsolvedRules = unsolvedRules.filter(x => x.name != rule.name);
            unsolvedIndices = unsolvedIndices.filter(x => x != solvedIndice);
            console.log('Matched indice ' + solvedIndice + ' with rule ' + rule.name);
            nochange = false;
            break;
        }
    }
    if (nochange) {
        console.log('No change occured for a loop');
        break;
    }
}

console.log(solves);
console.log(solves.filter(x => x.rulename.includes('departure ')).reduce((a, b) => a * b.value, 1));
// while(unsolvedRules){
//     for(rule of unsolvedRules){
//         let optionalIndices = checkRuleWithIndices(rule, unsolvedIndices, validTickets);
//         if(optionalIndices.length == 1){
//             let solvedindex = optionalIndices[0];
//             solvedRules.push({rulename:rule.name, value:myticket[solvedindex]});
//             unsolvedRules = unparsedrules.filter(x => x.name != rule.name);
//             unsolvedIndices.splice(unsolvedIndices.indexOf(solvedindex),1);
//             console.log('Matched rule ' + rule.name + ' with indice '+ solvedindex);
//             break;
//         }
//     }
// }

// console.log(solvedRules);