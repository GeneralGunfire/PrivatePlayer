const fs = require("fs");
let src = fs.readFileSync("src/lib/track-src-map.ts", "utf8");

// Fix id 29 - Tell Me Why Supermode (not downloaded yet)
src = src.replace(
  /"29": "\/music\/[^"]+", \/\/ Astrality[^\n]+/,
  '"29": "/music/Tell%20Me%20Why%20(James%20Carter%20Remix)%20-%20Supermode.mp3", // Not yet downloaded - will silently skip'
);

// Fix id 39 - Here We Go (correct)
// Already correctly matched if score was 1 — verify
const line39 = src.split("\n").find(l => l.includes('"39":'));
console.log("id 39:", line39 ? line39.trim() : "not found");

// Fix id 55 - O Meri Laila (correct match)
const line55 = src.split("\n").find(l => l.includes('"55":'));
console.log("id 55:", line55 ? line55.trim() : "not found");

// Fix id 120 - I Don't Want to Miss a Thing (not downloaded)
src = src.replace(
  /"120": "\/music\/[^"]+", \/\/ all things[^\n]+/,
  '"120": "/music/I%20Don%27t%20Want%20to%20Miss%20a%20Thing%20-%20Aerosmith.mp3", // Not yet downloaded'
);

fs.writeFileSync("src/lib/track-src-map.ts", src, "utf8");
console.log("Done");
