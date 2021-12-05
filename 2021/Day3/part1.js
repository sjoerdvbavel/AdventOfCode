var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n")
let setsize = array.length;
let len = array[0].length;
let counters = new Array(len).fill(0);

for(number of array){
    let charlist = number.split('');
    for(let i=0;i<len;i++){
        if(charlist[i] == '1'){
            counters[i]++;
        }
    }
}
let gammastring = counters.map(x=>x>setsize/2?'1': '0').join('')
let gamma = parseInt(gammastring,2)

let epsilonstring = counters.map(x=>x<setsize/2?'1': '0').join('')
let epsilon = parseInt(epsilonstring,2)

console.log('Gamma ' + gamma + ' Epsilon ' + epsilon);
console.log('Gamma times epsilon is ' + gamma * epsilon);