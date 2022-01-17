function parseData(filename) {
    var fs = require('fs');
    var path = require('path');
    var filePath = path.join(__dirname, filename);
    var rawDataSet = fs.readFileSync(filePath).toString().split("\r\n");

    let dataset = [];
    for (line of rawDataSet) {

        let parts = line.split(' (contains ');
        let foods = parts[0].split(' ');
        let ingredients = parts[1].substring(0, parts[1].length - 1).split(', ');
        dataset.push({ foods: foods, ingredients: ingredients });
    }

    return dataset;
}

function intersectArray(array1, array2) {
    return array1.filter(value => array2.includes(value));
}

function matchIngredients(dataset) {
    let allIngredients = new Set();
    dataset.forEach(element => element.ingredients.forEach(x => allIngredients.add(x)));
    let allFoods = new Set();
    dataset.forEach(element => element.foods.forEach(x => allFoods.add(x)));
    let dangerousingredientslist = [];
    let newdataset = 1;
    while (JSON.stringify(newdataset) != JSON.stringify(dataset)) {
        //Clone the dataset
        newdataset = dataset.map(x => JSON.parse(JSON.stringify(x)));
        for (ingredient of allIngredients) {
            let menuwithIngredient = dataset.filter(x => x.ingredients.includes(ingredient));
            //If a food is to be this ingredient it has to be on all menu's.
            let allUnsureIngredients = menuwithIngredient.map(x => x.foods).reduce(intersectArray, [...allFoods]);

            if (allUnsureIngredients.length == 1) {
                let matchedFood = allUnsureIngredients[0];
                //We remove the food and ingredient from all menu's.
                for (menuindex in dataset) {
                    let menu = dataset[menuindex];
                    const foodIndex = dataset[menuindex].foods.indexOf(matchedFood);
                    if (foodIndex > -1) {
                        dataset[menuindex].foods.splice(foodIndex, 1);
                    }
                    const ingedientIndex = dataset[menuindex].ingredients.indexOf(ingredient);
                    if (ingedientIndex > -1) {
                        dataset[menuindex].ingredients.splice(ingedientIndex, 1);
                    }
                }
                console.log(`${matchedFood} matches with ${ingredient}`);
                dangerousingredientslist.push([matchedFood, ingredient]);
            }
        }
    }
    //sort the list for part 2:
    let sortedlist = dangerousingredientslist.sort((a, b) => a[1] > b[1] ? 1 : -1)
    let sortedstring = sortedlist.reduce((a,b)=> a + ',' + b[0], '');
    dataset.cdil = sortedstring.substring(1, sortedstring.length);
    return dataset;
}

function executePart1(dataset) {
    let results = matchIngredients(dataset);

    return results.reduce((a, b) => a + b.foods.length, 0);
}

function executePart2(dataset) {
    let results = matchIngredients(dataset);
    return results.cdil;
}

function execute() {
    let testdata1 = parseData('testdata.txt');
    let testresult1 = executePart1(testdata1);
    if (testresult1) {
        console.log(`testdata part1: ${testresult1}`);
    }
    let testdata2 = parseData('testdata.txt');
    let testresult2 = executePart2(testdata2);
    if (testresult2) {
        console.log(`testdata part2: ${testresult2}`);
    }
    let realdata1 = parseData('data.txt');
    let result1 = executePart1(realdata1);
    if (result1) {
        console.log(`part1: ${result1}`);
    }
    let realdata2 = parseData('data.txt');
    let result2 = executePart2(realdata2);
    if (testresult2) {
        console.log(`part2: ${result2}`);
    }
}

execute();