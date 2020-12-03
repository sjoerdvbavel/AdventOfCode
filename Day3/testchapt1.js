let data = ["..##.......", "#...#...#..", ".#....#..#.", "..#.#...#.#", ".#...##..#.", "..#.##.....", ".#.#.#....#", ".#........#", "#.##...#...", "#...##....#", ".#..#...#.#"];

let count = 0
let ydist = 1
let width = data[0].length;
for(a of data){
    
    if(a.charAt((ydist - 1) % width) == '#'){
        count++;
    } 
    console.log(a + " " + ydist  + " " + ydist % width + " " + a.charAt(ydist % width));
    ydist += 3;
}
console.log("Number of trees: " + count); 