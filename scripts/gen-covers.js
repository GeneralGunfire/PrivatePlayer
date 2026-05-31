const fs = require("fs");

const COVERS = {
  "1":  "photo-1470225620780-dba8ba36b745",
  "2":  "photo-1429962714451-bb934ecdc4ec",
  "5":  "photo-1506905925346-21bda4d32df4",
  "10": "photo-1534796636912-3b95b3ab5986",
  "16": "photo-1493676304819-0d7a312d5e5b",
  "17": "photo-1506197603052-3cc9c3a201bd",
  "18": "photo-1419242902214-272b3f66ee7a",
  "19": "photo-1464802686167-b939a6910659",
  "20": "photo-1507838153414-b4b713384a76",
  "21": "photo-1558618666-fcd25c85cd64",
  "28": "photo-1598387993441-a364f854cfdd",
  "29": "photo-1571330735066-03aaa9429d89",
  "30": "photo-1535223289429-72aad301b73d",
  "31": "photo-1433086966358-54859d0ed716",
  "32": "photo-1477959858617-67f85cf4f1df",
  "33": "photo-1500462918059-b1a0cb512f1d",
  "34": "photo-1526374965328-7f61d4dc18c5",
  "35": "photo-1558618666-fcd25c85cd64",
  "36": "photo-1499415479124-43c32433a620",
  "37": "photo-1418985991508-e47386d96a71",
  "38": "photo-1446776811953-b23d57bd21aa",
  "39": "photo-1571388208497-71bedc604bf5",
  "40": "photo-1474552226712-ac0f0961a954",
  "41": "photo-1499209974431-9dddcece7f88",
  "42": "photo-1419242902214-272b3f66ee7a",
  "43": "photo-1446776653964-20c1d3a81b06",
  "44": "photo-1418985991508-e47386d96a71",
  "45": "photo-1514320291840-2e0a9bf2a9ae",
  "46": "photo-1476231682828-37e571bc172f",
  "47": "photo-1440404653325-ab127d49abc1",
  "48": "photo-1499415479124-43c32433a620",
  "49": "photo-1476231682828-37e571bc172f",
  "50": "photo-1508700115892-45ecd05ae2ad",
  "51": "photo-1507003211169-0a1dd7228f2d",
  "52": "photo-1536440136628-849c177e76a1",
  "53": "photo-1414862625253-63af814c65e7",
  "54": "photo-1507003211169-0a1dd7228f2d",
  "55": "photo-1464802686167-b939a6910659",
  "56": "photo-1433086966358-54859d0ed716",
  "57": "photo-1418985991508-e47386d96a71",
  "58": "photo-1504151932400-72d4384f04b3",
  "59": "photo-1476231682828-37e571bc172f",
  "60": "photo-1507838153414-b4b713384a76",
  "61": "photo-1558618666-fcd25c85cd64",
  "62": "photo-1508700115892-45ecd05ae2ad",
  "63": "photo-1490750967868-88df5691240e",
  "64": "photo-1475924156734-496f6cac6ec1",
  "65": "photo-1484291470158-b8f8d608850d",
  "66": "photo-1518199266791-5375a83190b7",
  "67": "photo-1507003211169-0a1dd7228f2d",
  "68": "photo-1499415479124-43c32433a620",
  "69": "photo-1598387993441-a364f854cfdd",
  "70": "photo-1446776811953-b23d57bd21aa",
  "71": "photo-1474552226712-ac0f0961a954",
  "72": "photo-1484291470158-b8f8d608850d",
  "73": "photo-1489493887464-892be6d1daae",
  "74": "photo-1418985991508-e47386d96a71",
  "75": "photo-1477959858617-67f85cf4f1df",
  "76": "photo-1535223289429-72aad301b73d",
  "77": "photo-1464802686167-b939a6910659",
  "78": "photo-1440404653325-ab127d49abc1",
  "79": "photo-1514320291840-2e0a9bf2a9ae",
  "80": "photo-1489493887464-892be6d1daae",
  "81": "photo-1507838153414-b4b713384a76",
  "82": "photo-1499415479124-43c32433a620",
  "83": "photo-1504151932400-72d4384f04b3",
  "84": "photo-1459749411175-04bf5292ceea",
  "85": "photo-1445294211564-3ca59d999abd",
  "86": "photo-1490750967868-88df5691240e",
  "87": "photo-1516450360452-9312f5e86fc7",
  "88": "photo-1471478331149-c72f17e33c73",
  "89": "photo-1418985991508-e47386d96a71",
  "90": "photo-1459749411175-04bf5292ceea",
  "91": "photo-1558618666-fcd25c85cd64",
  "92": "photo-1508700115892-45ecd05ae2ad",
  "93": "photo-1440404653325-ab127d49abc1",
  "94": "photo-1499209974431-9dddcece7f88",
  "95": "photo-1598387993441-a364f854cfdd",
  "96": "photo-1484291470158-b8f8d608850d",
  "97": "photo-1464802686167-b939a6910659",
  "98": "photo-1571388208497-71bedc604bf5",
  "99": "photo-1535223289429-72aad301b73d",
  "100": "photo-1571330735066-03aaa9429d89",
  "101": "photo-1477959858617-67f85cf4f1df",
  "102": "photo-1500462918059-b1a0cb512f1d",
  "103": "photo-1504701954957-2010ec3bcec1",
  "104": "photo-1471478331149-c72f17e33c73",
  "105": "photo-1433086966358-54859d0ed716",
  "106": "photo-1489493887464-892be6d1daae",
  "107": "photo-1504151932400-72d4384f04b3",
  "108": "photo-1571388208497-71bedc604bf5",
  "109": "photo-1428592953211-077101b2021b",
  "110": "photo-1414862625253-63af814c65e7",
  "111": "photo-1506905925346-21bda4d32df4",
  "112": "photo-1518199266791-5375a83190b7",
  "113": "photo-1445294211564-3ca59d999abd",
  "114": "photo-1414862625253-63af814c65e7",
  "115": "photo-1446776653964-20c1d3a81b06",
  "116": "photo-1490750967868-88df5691240e",
  "117": "photo-1440404653325-ab127d49abc1",
  "118": "photo-1475924156734-496f6cac6ec1",
  "119": "photo-1484291470158-b8f8d608850d",
  "120": "photo-1534796636912-3b95b3ab5986",
  "121": "photo-1558618666-fcd25c85cd64",
  "122": "photo-1484291470158-b8f8d608850d",
  "123": "photo-1499415479124-43c32433a620",
  "124": "photo-1418985991508-e47386d96a71",
  "125": "photo-1499209974431-9dddcece7f88",
  "126": "photo-1535223289429-72aad301b73d",
  "127": "photo-1446776811953-b23d57bd21aa",
  "128": "photo-1598387993441-a364f854cfdd",
  "129": "photo-1571330735066-03aaa9429d89",
  "130": "photo-1504701954957-2010ec3bcec1",
  "131": "photo-1477959858617-67f85cf4f1df",
  "132": "photo-1535223289429-72aad301b73d",
  "150": "photo-1516450360452-9312f5e86fc7",
  "151": "photo-1614613535308-eb5fbd3d2c17",
};

let src = fs.readFileSync("src/lib/data.ts", "utf8");
let count = 0;

// Process line by line — when we see an id line, replace coverUrl on same OR next line
const lines = src.split("\n");
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  // Check if this line has an id field
  const idMatch = lines[i].match(/id:\s*"(\d+)"/);
  if (idMatch) currentId = idMatch[1];

  // Check if this line (or same line as id) has a coverUrl
  if (currentId && COVERS[currentId] && lines[i].includes("coverUrl:")) {
    const newUrl = `https://images.unsplash.com/${COVERS[currentId]}?w=400&q=80`;
    const replaced = lines[i].replace(/coverUrl:\s*"[^"]*"/, `coverUrl: "${newUrl}"`);
    if (replaced !== lines[i]) {
      lines[i] = replaced;
      count++;
      currentId = null; // reset after replacing
    }
  }
}

fs.writeFileSync("src/lib/data.ts", lines.join("\n"), "utf8");
console.log(`Updated ${count} cover URLs`);
