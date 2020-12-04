var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n\r");


function HasRequiredFields(string) {
    return (string.includes("byr:") && string.includes("iyr:") && string.includes("eyr:") && string.includes("hgt:") && string.includes("hcl:") && string.includes("ecl:") && string.includes("pid:"))
}

function IsValidPassword(string) {
    if (!HasRequiredFields(string)) {
        return false;
    }
    console.log("testing password: " + string.replace(/(\r\n|\n|\r)/gm, " "))
    var elements = string.split(/\s+/);
    for (field of elements) {
        if (field.includes("byr:")) {
            var byr = field.split(":")[1];
            if (byr < 1920 || byr > 2002) {
                console.log("Invalid, wrong byr " + field);
                return false;
            }
        } else if (field.includes("iyr:")) {
            var iyr = field.split(":")[1];
            if (iyr < 2010 || iyr > 2020) {
                console.log("Invalid, wrong iyr " + field);
                return false;
            }
        } else if (field.includes("eyr:")) {
            var eyr = field.split(":")[1];
            if (eyr < 2020 || eyr > 2030) {
                console.log("Invalid, wrong eyr " + field);
                return false;
            }
        } else if (field.includes("hgt:")) {
            var hgt = field.split(":")[1];
            var nmbr = hgt.substring(0, hgt.length - 2);
            if (hgt.includes('in')) {
                if (nmbr < 59 || nmbr > 76) {
                    console.log("Invalid, wrong hgt in in" + nmbr);
                    return false;
                }
            } else if (hgt.includes('cm')) {
                if (nmbr < 150 || nmbr > 193) {
                    console.log("Invalid, wrong hgt in cm" + nmbr);
                    return false;
                }
            } else { //hgt doesn't include 'in' or 'cm'
                console.log("Invalid, wrong hgt " + hgt);
                return false;
            }

        } else if (field.includes("hcl:")) {
            var pattern = new RegExp("#[0-9a-f]{6}");
            var hcl = field.split(":")[1];
            if (!hcl.match(pattern)) {
                console.log("Invalid, wrong hcl " + field);
                return false;
            }

        } else if (field.includes("ecl:")) {
            var ecl = field.split(":")[1];
            if (!(ecl == "amb" || ecl == "blu" || ecl == "brn" || ecl == "grn" || ecl == "gry" || ecl == "hzl" || ecl == "oth")) {
                console.log("Invalid, wrong ecl " + field);
                return false;
            }
        } else if (field.includes("pid:")) {
            var pattern = new RegExp("^[0-9]{9}$");
            var pid = field.split(":")[1];
            if (!(pid.match(pattern))) {
                console.log("Invalid, wrong pid " + field);
                return false;
            }
        }
    }
    console.log("Valid");
    return true;
}

var valid = array.map(str => IsValidPassword(str) ? 1 : 0);

var sum = valid.reduce(function (a, b) {
    return a + b;
}, 0);

console.log("Number of valid passwords: " + sum);