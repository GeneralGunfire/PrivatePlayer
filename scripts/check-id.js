const fs = require("fs");
const src = fs.readFileSync("src/lib/data.ts", "utf8");
const line = src.split("\n").find(l => l.includes('id: "247"'));
console.log(line ? line.substring(0,300) : "not found");

// Count how many lines have coverUrl
const withCover = src.split("\n").filter(l => l.includes("coverUrl:"));
console.log("Lines with coverUrl:", withCover.length);

// Test regex on id 247
const re = new RegExp('(id:\\s*"247"[^\\n]*?coverUrl:\\s*")([^"]+)(")');
console.log("Regex match:", re.test(src));
