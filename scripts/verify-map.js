const fs = require("fs");

const mapSrc = fs.readFileSync("src/lib/track-src-map.ts", "utf8");
const entries = [];

// Parse entries from the map file
for (const line of mapSrc.split("\n")) {
  const m = line.match(/"(\d+)":\s*"([^"]+)"/);
  if (m) entries.push({ id: m[1], url: m[2] });
}

const musicDir = "public/music/";
let ok = 0, missing = 0;
const missingList = [];

for (const e of entries) {
  const filename = decodeURIComponent(e.url.replace("/music/", ""));
  const exists = fs.existsSync(musicDir + filename);
  if (exists) ok++;
  else { missing++; missingList.push(`id ${e.id}: ${filename}`); }
}

console.log(`\nOK: ${ok} / Missing: ${missing} / Total: ${entries.length}`);
if (missingList.length) {
  console.log("\nMissing files:");
  missingList.forEach(x => console.log("  " + x));
}
