// scripts/createDay.js
const fs = require("fs");
const path = require("path");

const [,, year, day] = process.argv;

if (!year || !day) {
  console.error("Usage: npm run create-day <year> <day>");
  process.exit(1);
}

const dirPath = path.join(year, day);
const sourceFile = path.join("template.js");
const targetFile = path.join(dirPath, `${year}-${day}.js`);

// Create /year/day (recursive allows year to be created if missing)
fs.mkdirSync(dirPath, { recursive: true });

// Rename (move) template.js
fs.copyFileSync(sourceFile, targetFile);
fs.writeFileSync(path.join(dirPath, "data.txt"), "");
fs.writeFileSync(path.join(dirPath, "testdata.txt"), "");

console.log(`Created folder ${dirPath} and files ${targetFile}, ${dirPath}/data.txt and ${dirPath}/testdata.txt`);
