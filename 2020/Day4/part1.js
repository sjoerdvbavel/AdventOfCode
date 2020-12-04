var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n\r");


function HasRequiredFields(string){
    return(string.includes("byr:") && string.includes("iyr:") && string.includes("eyr:") && string.includes("hgt:") && string.includes("hcl:") && string.includes("ecl:") && string.includes("pid:"))
}

var valid = array.map(str => HasRequiredFields(str)?1:0);

var sum = valid.reduce(function(a, b){
    return a + b;
}, 0);

console.log("Number of valid passwords: " + sum);