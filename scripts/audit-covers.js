const fs = require("fs");
const src = fs.readFileSync("src/lib/data.ts", "utf8");

// Parse track lines
const rows = [];
for (const line of src.split("\n")) {
  const id    = line.match(/id:\s*"(\d+)"/);
  const title = line.match(/title:\s*"([^"]+)"/);
  const artist= line.match(/artist:\s*"([^"]+)"/);
  const cover = line.match(/coverUrl:\s*"([^"]+)"/);
  if (id && title && artist && cover) {
    const photo = (cover[1].match(/photo-([a-f0-9]+)\?/) || [])[1];
    rows.push({ id: id[1], title: title[1], artist: artist[1], cover: cover[1], photo });
  }
}

// Find duplicates
const seen = {};
const dups = [];
for (const r of rows) {
  if (!r.photo) continue;
  if (seen[r.photo]) {
    dups.push(`DUPE photo-${r.photo}: "${r.title}" by ${r.artist} (id ${r.id})  vs  "${seen[r.photo].title}" by ${seen[r.photo].artist} (id ${seen[r.photo].id})`);
  } else {
    seen[r.photo] = r;
  }
}

console.log(`Total tracks: ${rows.length}`);
console.log(`Duplicate covers: ${dups.length}`);
dups.forEach(d => console.log(" ", d));
