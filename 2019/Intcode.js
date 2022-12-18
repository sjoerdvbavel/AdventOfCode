export function intcode(program){
    var program = array[position];
    console.log(array);
    while(array[position] != 99){

        var program = array[position],
            numberone = array[position + 1],
            numbertwo = array[position + 2],
            spot2change = array[position + 3];
        switch(program){
            case 1:
                array[spot2change] = array[numberone] + array[numbertwo];
                break;
            case 2:
                array[spot2change] = array[numberone] * array[numbertwo];
                break;
            
        }

        } else if(program == 2){
            //console.log("Position " + spot2change + " was set to " + array[spot2change] + " ("  + array[numberone] + "*" + array[numbertwo]+") by program " + program);
        } else {
            console.log("Error " + program);
        }
        position += 4;
        //console.log(array);
    }
    return array;
}