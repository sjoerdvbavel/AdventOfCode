var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

var unparsedrules = dataSet[0].split("\r\n");
var parsedrules = new Map();
for (let unparsedrule of unparsedrules) {
    let a = unparsedrule.split(': ');
    if (a[1].includes('"')) {
        parsedrules.set(a[0], { type: 'quote', letter: a[1][1] });
    } else if (a[1].includes('|')) {
        parsedrules.set(a[0], { type: 'pipe', rules: a[1].split(' | ').map(x => x.split(' ')) });
    } else {
        parsedrules.set(a[0], { type: 'regular', rules: a[1].split(' ') });
    }

}
var messages = dataSet[1].split("\r\n");

//change rule 8 and 11:
parsedrules.set('8', { type: 'pipe', rules: [['42'], ['42', '8']] });
parsedrules.set('11', { type: 'pipe', rules: [['42', '31'], ['42', '11', '31']] });
console.log(parsedrules);


function checkRules(rules, string) {
    // console.log(`checkrules called with ${rules} and ${string}`);
    if(rules.length == 0){
        return string.length == 0;
    }
    if(string.length == 0){
        return false;
    }
    let rule = parsedrules.get(rules[0]);

    if (rule.type == 'quote') {
        if (rule.letter == string[0]) {
            return checkRules(rules.slice(1), string.substring(1));
        } else {
            return false;
        }
    } else if (rule.type == 'regular') {
        return checkRules(rule.rules.concat(rules.slice(1)), string);
    } else if (rule.type == 'pipe') {
        let leftrules = checkRules(rule.rules[0].concat(rules.slice(1)), string);
        let rightrules = checkRules(rule.rules[1].concat(rules.slice(1)), string);
        return (leftrules || rightrules);
    }
}

let unhandledRules = parsedrules.get('0').rules;
console.log(unhandledRules);
results = messages.filter(x=> checkRules(unhandledRules, x));
console.log(results.length);
console.log(results);