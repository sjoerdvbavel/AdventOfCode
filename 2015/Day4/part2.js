var input = 'iwrupvqb';

var md5 = require("blueimp-md5");

console.log(md5(input));
var counter = 0;
var solutionfound = false;
while(!solutionfound){
    counter++;
    var md5hash = md5(input+counter);
    if(md5hash.startsWith('000000')){
        solutionfound = true;
        console.log('solution ' + counter + ' hash: ' + md5hash);
    }
    if(counter % 10000 == 0){
        console.log(counter);
    }
}
