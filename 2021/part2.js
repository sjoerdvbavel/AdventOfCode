var fs = require('fs');
var path = require('path');
var filePath = path.join(__dirname, 'data.txt');
var array = fs.readFileSync(filePath).toString().split("\r\n")
let setsize = array.length;
let len = array[0].length;
let counters = new Array(len).fill(0);

function getMajorityAtIndex(data, index){
    let count = 0;
    for(let i=0;i<data.length;i++){
        if(data[i][index] == '1'){
            count++;
        }
    }

    return count >= data.length/2
}

function getMinorityAtIndex(data, index){
    let count = 0;
    for(let i=0;i<data.length;i++){
        if(data[i][index] == '1'){
            count++;
        }
    }

    return count < data.length/2
}

let list = array.slice();
let listindex = 0;
while(list.length > 1){
    let highestbit = getMajorityAtIndex(list, listindex);
    list = list.filter(x=>x[listindex] == highestbit);
    listindex++;
}
let ogr = parseInt(list[0],2)

let list2 = array.slice();
let listindex2 = 0;
while(list2.length > 1){
    let lowestbit = getMinorityAtIndex(list2, listindex2);
    list2 = list2.filter(x=>x[listindex2] == lowestbit);
    listindex2++;
}
let csr = parseInt(list2[0],2)

console.log('Ogr '+ ogr + ' Csr ' + csr);
console.log('Ogr times csr is ' + ogr * csr);