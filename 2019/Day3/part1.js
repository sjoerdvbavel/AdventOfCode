var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\n");

function ExecuteStep(array, position){
    var program = array[position];
    console.log(array);
    while(array[position] != 99){

        var program = array[position],
            numberone = array[position + 1],
            numbertwo = array[position + 2],
            spot2change = array[position + 3];
        if(program == 1){

            array[spot2change] = array[numberone] + array[numbertwo];
            //console.log("Position " + spot2change + " was set to " + array[spot2change] + " ("  + array[numberone] + "+" + array[numbertwo]+") by program " + program);
        } else if(program == 2){
            array[spot2change] = array[numberone] * array[numbertwo];
            //console.log("Position " + spot2change + " was set to " + array[spot2change] + " ("  + array[numberone] + "*" + array[numbertwo]+") by program " + program);
        } else {
            console.log("Error " + program);
        }
        position += 4;
        //console.log(array);
    }
    return array;
}

var program1 = [1,0,0,0,99];
var output = ExecuteStep(program1, 0);
console.log("Answer: " + output[0]);
var program2 = [2,3,0,3,99];
var output = ExecuteStep(program2, 0);
console.log("Answer: " + output[0]);
var program3 = [2,4,4,5,99,0];
var output = ExecuteStep(program3, 0);
console.log("Answer: " + output[0]);
var program4 = [1,9,10,3,2,3,11,0,99,30,40,50];
var output = ExecuteStep(program4, 0);
console.log("Answer: " + output[0]);
var program5 = [1,1,1,4,99,5,6,0,99];
var output = ExecuteStep(program5, 0);
console.log("Answer: " + output[0]);

var output = ExecuteStep(input, 0);
console.log("Answer: " + output[0]);