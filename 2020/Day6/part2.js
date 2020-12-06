var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n\r");

function CountCommonUniqChars(persons) {
    var commonAnswers = persons.pop().split('');
    for (currentperson of persons) {
        var KeepAnswers = [];
        for (Answer of commonAnswers) {
            if (currentperson.includes(Answer)) {
                KeepAnswers.push(Answer);
            }
        }
        commonAnswers = KeepAnswers;
    }
    return commonAnswers.length;
}

function parseinputandexecute(string){
    var persons = string.split(/\s+/);
    persons.shift(); // remove the first 'empty' value 

    return CountCommonUniqChars(persons);
}

var counts = array.map(n => parseinputandexecute(n));

console.log(counts);

var sum = counts.reduce(function (a, b) {
    return a + b;
}, 0);

console.log("Total sum: " + sum);

