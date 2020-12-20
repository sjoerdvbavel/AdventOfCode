var data = [0, 3, 6];//testdata, answer should be 436
// var data = [1,12,0,20,8,16]// data


function MemoryGame(array) {
    let obj = {};
    //Initialise the starting numbers.
    for (let i = 0; i < array.length; i++) {
        obj[array[i]] = i + 1;
    }
    let lastnumber = 0;
    let numbercounter = array.length+1; 
    let nextnumber = lastnumber;
    while (numbercounter < 2020) {
        lastnumber = nextnumber
        nextnumber = obj[lastnumber] == undefined?0:numbercounter-obj[lastnumber];
        obj[lastnumber] = numbercounter;
        numbercounter++;
    }
    return nextnumber;
}

function TestCase(testarray, target){
    let outcome = MemoryGame(testarray);
    if(outcome != target){
        console.log("Case " + testarray + " is " + outcome + " should be " + target);
    } else{
        console.log("Case " + testarray + " correct");
    }
}
TestCase([0,3,6], 436);
TestCase([1,3,2], 1);
TestCase([2,1,3],10);
TestCase([1,2,3], 27);
TestCase([2,3,1], 78);
TestCase([3,2,1], 438);
TestCase([3,1,2], 1836);
console.log("Final case: " + MemoryGame([1,12,0,20,8,16]));