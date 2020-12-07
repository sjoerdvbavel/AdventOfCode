var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

function getBagNames(string) {
    return bagnames = string.match(/\d\s\w+\s\w+\sbag/g);
}

function FindBagline(string) {
    return BagsContaining = array.find(n => n.indexOf(string) == 0);
}

function FindAllChildrenRecursive(bagname) {
    var bagline = FindBagline(bagname)

    bagchildren = getBagNames(bagline);

    var count = 1;
    if (!bagchildren) {
        return count;
    } else {
        for (child of bagchildren) {
            var number = child.substring(0, 1)
            var bagname = child.substring(2, child.length);
            var bagsperchild = FindAllChildrenRecursive(bagname);
            count += number * bagsperchild;
            //console.log(bagname + " totaling " + count +" bags");
        }
    }
    return count;
}

var target = "shiny gold bag";
var output = FindAllChildrenRecursive(target)-1; //minus one because we count the gold bag which should not be counted.
console.log(target + " contains " + output + " bags")
