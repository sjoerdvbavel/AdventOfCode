function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n\r\n");

    let rules = [];
    for (line of rawDataSet[0].split("\r\n")) {
        let splits = line.split(' => ');
        // rules.push({replace:splits[0].toLowerCase(), by: splits[1].toLowerCase() });
        rules.push({ replace: splits[0], by: splits[1] });
    }

    return [rules, rawDataSet[1]];
}

dataset = parseData('jeroendata.txt');

string = dataset[1];
rules = dataset[0];
inputs = rules.map(x => x.replace);
outputs = rules.map(x => x.by);

function getMatchesObject(string) {
    matches = string.match(/[A-Z][a-z]?/g);
    let object = {};

    for (match of matches) {
        if (object[match]) {
            object[match]++;
        } else {
            object[match] = 1;
        }
    }
    return object;
}

stringobject = getMatchesObject(string);
console.log(JSON.stringify(stringobject));

console.log(`Final result: ${matches.length} Ar: ${stringobject['Ar']} Y: ${stringobject['Y']} Length: ${matches.length - (2 * stringobject['Ar']) - (2 * stringobject['Y'])}`)

function atomsInString(string) {
    return string.match(/[eA-Z][a-z]?/g)?.length
}

allinputs = inputs.join('')
alloutputs = outputs.join('')
allrules = allinputs + alloutputs;

for (rule in rules) {
    console.log(`${inputs[rule]} (${atomsInString(inputs[rule])}) => ${outputs[rule]} (${atomsInString(outputs[rule])})`)
}

inputobject = getMatchesObject(allinputs);
outputobject = getMatchesObject(alloutputs);
allrulesobject = getMatchesObject(allrules);
console.log(`inputs ${JSON.stringify(getMatchesObject(allinputs))}`);
console.log(`outputs ${JSON.stringify(getMatchesObject(alloutputs))}`);
console.log(`both ${JSON.stringify(getMatchesObject(allrules))}`);

console.log(`Ar rules ----`)
//Find rules with Ar in the output.
for (rule of rules.filter(x => (x.by.search('Ar') != -1 && x.by.search('C') == -1))) {
    console.log(`${rule.replace} (${atomsInString(rule.replace)}) => ${rule.by} (${atomsInString(rule.by)})`)
}

console.log(`Y rules ----`)
//Find rules with Ar in the output.
for (rule of rules.filter(x => x.by.search('Y') != -1 && x.by.search('C') == -1)) {
    console.log(`${rule.replace} (${atomsInString(rule.replace)}) => ${rule.by} (${atomsInString(rule.by)})`)
}

console.log(`Atom occurances ----`)

for(atom of Object.keys(allrulesobject)){
    console.log(`${atom} ${inputobject[atom]} ${outputobject[atom]} ${allrulesobject[atom]} ${stringobject[atom]}`);
}

console.log(`Rn rules ----`)
//Find rules with Ar in the output.
for (rule of rules.filter(x => x.by.search('Rn') != -1 && x.by.search('C') == -1)) {
    console.log(`${rule.replace} (${atomsInString(rule.replace)}) => ${rule.by} (${atomsInString(rule.by)})`)
}


function calcPrediction(string){
    matches = string.match(/[eA-Z][a-z]?/g);
    let object = {};

    for (match of matches) {
        if (object[match]) {
            object[match]++;
        } else {
            object[match] = 1;
        }
    }    
    let Prediction = matches.length - (2 * object['Ar']?object['Ar']:0) - (2 * object['Y']?object['Y']:0);

    console.log(`${string.slice(0, 5)} Final result: ${Prediction} Ar: ${object['Ar']} Rn: ${object['Ar']} Y: ${object['Y']} Length: ${matches.length}`);
    return Prediction;
}

calcPrediction('HOH');
calcPrediction('HOHOHO');
calcPrediction(dataset[1]);
