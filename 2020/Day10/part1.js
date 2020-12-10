var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n");

var numbers = array.map(str => parseInt(str, 10)).sort(function(a, b) {
    return a - b;
  });
console.log(numbers);

var diffone = 1;
var diffthree = 1;
for(var i = 1; i<numbers.length;i++){
    var diff = numbers[i] - numbers[i-1];
    console.log(diff);
    if(diff == 1){
        diffone++;
    } else if(diff == 3){
        diffthree++;
    }
}
console.log(diffone +" "+ diffthree + " Answer " + diffone * diffthree)