let data = ["..##.......", "#...#...#..", ".#....#..#.", "..#.#...#.#", ".#...##..#.", "..#.##.....", ".#.#.#....#", ".#........#", "#.##...#...", "#...##....#", ".#..#...#.#"];

let count = 0
let ydist = 1
let width = data[0].length;

function NumOfTreesInDirection(dataset, xstep, ystep){
    let count = 0
    let ydist = 1
    let width = dataset[0].length;

    let i = 0;
    for(a of dataset){
        if(i % ystep == 0){
            if(a.charAt((ydist - 1) % width) == '#'){
                count++;
            } 
            //console.log(a + " " + ydist  + " " + ydist % width + " " + a.charAt(ydist % width));
            ydist += xstep;
        }
        i++;
    }
    return count;
}
let c1 = NumOfTreesInDirection(data, 1, 1);
console.log("Number of trees: " + c1); 
let c2 = NumOfTreesInDirection(data, 3, 1);
console.log("Number of trees: " + c2); 
let c3 = NumOfTreesInDirection(data, 5, 1);
console.log("Number of trees: " + c3);
let c4 = NumOfTreesInDirection(data, 7, 1);
console.log("Number of trees: " + c4);
let c5 = NumOfTreesInDirection(data, 1, 2);
console.log("Number of trees: " + c5);   
console.log("Product: " + c1 * c2 * c3 * c4 * c5);