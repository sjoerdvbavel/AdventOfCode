var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var depths = fs.readFileSync(filePath).toString().split("\r\n").map(x=>parseInt(x));

let counter = 0;

//loop skips the first element
for(let i = 1; i < depths.length;i++){
    let prevdepth = depths[i-1];
    let depth = depths[i];
    if(depth > prevdepth){
        counter++;
        // console.log(prevdepth + ' ' + depth +  ' true');
    } else if(depth == prevdepth){
        console.log(depth + ' equals ' + prevdepth + '.')
    } else {
        // console.log(prevdepth + ' ' + depth +  ' false');
    }
}
console.log('Times increased: ' + counter);
