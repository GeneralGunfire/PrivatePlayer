const fs = require("fs");
const s = fs.readFileSync("src/lib/data.ts", "utf8");
const lines = s.split("\n");
console.log("lines:", lines.length);
const l = lines.find(x => x.includes('id: "1"'));
console.log("sample:", l ? l.substring(0, 120) : "NOT FOUND");
// Test regex
const re = new RegExp('(id:\\s*"1"[^\\n]*?coverUrl:\\s*")([^"]+)(")');
console.log("regex matches:", re.test(s));
