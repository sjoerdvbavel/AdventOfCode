var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'testdata.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

//parse a rule '1-3' becomes {start:1, end: 3}
function Parserule(line, rulename){
    let splitline = line.split('-').map(n => parseInt(n));
    return {name: rulename, start:splitline[0], end:splitline[1]};
}
//parse a line, '7,1,14' becomes [7, 1, 14];
function Parseline(line){
    return line.split(',').map(n => parseInt(n));
}

//parse the rules
var firstemptyline = array.indexOf("");
var rules = [];
var ruleNames = []
for(ruleline of array.slice(0, firstemptyline)){
    let splitline = ruleline.split(': ')[1].split(' ');
    let ruleName = ruleline.split(': ')[0];
    rules.push(Parserule(splitline[0], ruleName));
    rules.push(Parserule(splitline[2], ruleName));
    ruleNames.push(ruleName);
}
console.log(rules);
console.log(ruleNames);

//parse my ticket
var myline = array.indexOf("nearby tickets:");
var myticket = Parseline(array[myline + 1])
console.log(myticket);
//parse nearby tickets
var nearbyline = array.indexOf("nearby tickets:");
var nearbytickets = array.slice(nearbyline +1).map(m => Parseline(m));
console.log(nearbytickets);

//Returns whether valuetocheck is between start and end of the rule.
function CheckRule(valuetocheck, rule){
    return valuetocheck >= rule.start && valuetocheck <= rule.end;
}

//Find the error rates:
var validTickets = [];

for(ticket of nearbytickets){
    let validTicket = true;
    for(value of ticket){
        let validSomewhere = false;
        for(rule of rules){
            if(CheckRule(value, rule)){
                validSomewhere = true;
                break;
            }
        }
        if(!validSomewhere){
            console.log(value + ' was invalid for all rules.');
            validTicket = false;
            break;
        }
    }
    if(validTicket){
        validTickets.push(ticket);
    }
}


console.log(validTickets);

//determine if a ruleset
function checkRuleWithIndices(rule, unsolvedIndices, validTickets){
    let rulesToCheck = rules.filter(function(obj){return obj.name == rule;});
    let possibleIndives = [];

    for(indice of unsolvedIndices){
        let isIndiceValid = true;
        
    } 
}

var unsolvedRules = ruleNames.slice();
var unsolvedIndices = [];
var solvedRules = [];
for (var i = 0; i <= myticket.length; i++) {
    unsolvedIndices.push(i);
}

while(unsolvedRules){
    for(rule of unsolvedRules){
        let optionalIndices = checkRuleWithIndices(rule, unsolvedIndices, validTickets);
        if(optionalIndices.length == 1){
            let solvedindex = optionalIndices[0];
            solvedRules.push({rule:rule, solvedindex});
            unsolvedRules.splice(unsolvedRules.indexOf(rule), 1);
            unsolvedIndices.splice(unsolvedIndices.indexOf(solvedindex),1);
            break;
        }
    }
}