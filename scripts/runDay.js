// scripts/runDay.js
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const [,, year, day] = process.argv;

if (!year || !day) {
  console.error("Usage: npm run run-day <year> <day>");
  process.exit(1);
}
const dirPath = path.join(year, day);
const targetFile = path.join(dirPath, `${year}-${day}.js`);

console.log(`Run ${targetFile}`);

exec(`node ${targetFile}`, (error, stdout, stderr) => {
  if (error) console.error(error);
  console.log(stdout);
});
