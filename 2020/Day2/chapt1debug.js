function IsValidPass(password, character, min, max) {
    let number = password.split(character).length - 1;
    return (number <= max && number >= min);
}
function ParseData(datastring){
    const dataArray = datastring.split(" ");
    const numberarray = dataArray[0].split("-");
    return( IsValidPass(dataArray[2], dataArray[1].charAt(0), numberarray[0], numberarray[1]));
}

const testset = ["6-7 v: kfvlgvn", "16-17 f: ffffffffffffffffrf", "6-7 z: zzczzhfvnz", "1-4 f: fsfs", "6-7 b: pqbsmfsv", "2-3 n: nlbn", "4-5 b: bpbdbbbbnsbbbxb", "4-12 n: csgndnqnsjjvxn", "13-16 r: rrrrrrzrrrrrqrrrrrr", "13-15 t: ttttttttttttttqtt", "1-8 q: qqqtqtql", "6-10 t: ttttttttzwtttttt", "4-10 v: vvvsvvvvvqvvvv", "3-5 w: wwwtl", "3-8 z: qgkszmzkp", "4-6 w: wwwvwgww", "13-15 v: nvvvvvvvvdzvvvr", "10-11 v: gvmwdpgpvvb", "4-11 g: gggjgggvmgggg", "1-6 z: fzzzzzzzzz", "6-9 r: dmrrhxrrbrr", "1-2 t: tmttv", "5-13 d: jxvctbwmkpbqd", "6-8 w: wbwlhwdw", "17-18 x: qdzkpnhbdxcxsfsxkx", "3-5 w: wwwww", "2-3 n: xnjnl", "2-9 f: ffffxffff", "5-6 g: sgggjzg", "7-10 h: zlvnhhrhlz", "10-11 h: hhhhhhrhhhhhh", "6-7 k: kpvtkkkk", "9-17 b: vbbwhjntdzhbbhmbbq", "6-8 h: hlhhhhrdjncphc"];

for(a of testset){
    console.log(a);
    console.log(ParseData(a));
}