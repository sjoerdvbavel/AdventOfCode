var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var dataSet = fs.readFileSync(filePath).toString().split("\r\n");

function SolveMath(mathstring) {
    while (mathstring.includes('(')){
        let bracketsStuff = mathstring.match(/\([^\(\)]+\)/g);
        for (substring of bracketsStuff) {
            mathstring = mathstring.replace(substring, SolveMath(substring.substring(1, substring.length-1)).toString()).trim();
        }
    }

    //Parse the string with no brackets left. 
    let termslist = mathstring.split(' ');

    // First we Replace the plusses:
    for (let i = 1; i < termslist.length; i += 2) {
        if (termslist[i] == '+') {
            termslist[i-1] = parseInt(termslist[i-1], 10) + parseInt(termslist[i + 1]);
            termslist.splice(i, 2);
            i -= 2; //reduce iterator so next operator is checked.
        }
    }

    //Finally parse the string with just the products left.
    let result = parseInt(termslist[0], 10);
    //We increment by 2 so we jump from operator to operator.
    for (let i = 1; i < termslist.length; i += 2) {
            result *= parseInt(termslist[i + 1]);
    }
    return result;
}

let results = dataSet.map(SolveMath);
console.log(results);
console.log(results.reduce((a,b)=>a+b));