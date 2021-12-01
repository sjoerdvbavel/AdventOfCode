var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
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
for(ruleline of array.slice(0, firstemptyline)){
    let splitline = ruleline.split(': ')[1].split(' ');
    rules.push(Parserule(splitline[0], ruleline.split(': ')[0]));
    rules.push(Parserule(splitline[2], ruleline.split(': ')[0]));
}
console.log(rules);


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
var totalerror = 0;

for(ticket of nearbytickets){
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
            totalerror += value;
        }
    }
}
console.log('Ticket scanning error rate: ' + totalerror);