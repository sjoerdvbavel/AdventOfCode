var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

function includesButNotAtTheStart(wordToCompare) {
    return function(element) {
        return element.indexOf(wordToCompare) > 0;
    }
}

function getBagName(string){
    let bagname = string.split(' contain')[0];
    return bagname.substring(0, bagname.length-1);
}

function FindAllBagsContaining(string){
    var BagsContaining = array.filter(includesButNotAtTheStart(string));

    return BagsContaining.map(n=>getBagName(n));
}
function FindAllBagsRecursive(bagname){
    var bags2Search = FindAllBagsContaining(bagname),
        bags2return = bags2Search.slice();
    
    console.log(bags2return);
    while(bags2Search.length){
        //console.log(bags2Search);
        var searchon = bags2Search.shift();
        var newbags = FindAllBagsContaining(searchon);
        let difference = newbags.filter(x => !bags2return.includes(x));

        var bags2Search = bags2Search.concat(difference);
        var bags2return = bags2return.concat(difference);

    }
    return(bags2return);
}

var output = FindAllBagsRecursive("shiny gold bag");
console.log(output);
console.log("Found " + output.length + " bags")
