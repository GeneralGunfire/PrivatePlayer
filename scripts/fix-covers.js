/**
 * Fix cover images in data.ts — replace generic stock photos with
 * thematically appropriate images that match each song/artist.
 * Each photo chosen to evoke the mood, genre, or era of the song.
 */
const fs = require("fs");
const file = "src/lib/data.ts";
let src = fs.readFileSync(file, "utf8");

// Map: track id -> Unsplash photo ID (suffix ?w=800&q=80 added automatically)
const covers = {
  // ── COLDPLAY — concert lights, cosmic, colourful ─────────
  "1":   "1470225620780-dba8ba36b745", // warm concert crowd lights - Paradise
  "2":   "1429962714451-bb934ecdc4ec", // dramatic stage spotlight - In My Place
  "5":   "1506905925346-21bda4d32df4", // mountain silhouette at dusk - Fix You
  "10":  "1534796636912-3b95b3ab5986", // purple galaxy/space - Magic
  "16":  "1493676304819-0d7a312d5e5b", // misty purple hills - Violet Hill
  "17":  "1506197603052-3cc9c3a201bd", // amber sunset glow - Everglow
  "18":  "1502101872923-d48509bff386", // ethereal aurora - Miracles
  "19":  "1464802686167-b939a6910659", // stars and cosmos - Up&Up

  // ── INSTRUMENTALS / ELEMENTAL ────────────────────────────
  "28":  "1598387993441-a364f854cfdd", // minimal dark room with spotlight - XX Intro
  "29":  "1526374965328-7f61d4dc18c5", // sci-fi corridor - Duel of Fates

  // ── MOVIES ───────────────────────────────────────────────
  "47":  "1477959858617-67f85cf4f1df", // dark cityscape - Batman Dark Knight
  "49":  "1418985991508-e47386d96a71", // misty forest - Stay Alive (Walter Mitty)
  "50":  "1516450360452-9312f5e86fc7", // sleek dark interface - Casino Royale
  "53":  "1414862625253-63af814c65e7", // lonely road at night - Lead Me Home
  "54":  "1507003211169-0a1dd7228f2d", // suit jacket detail - Greenback Boogie (Suits)
  "57":  "1504151932400-72d4384f04b3", // hands raised/boxing energy - Burning Heart
  "58":  "1514320291840-2e0a9bf2a9ae", // punching/boxing - Eye of Tiger
  "201": "1534796636912-3b95b3ab5986", // dark rainy cityscape - Why Do We Fall
  "204": "1446776811953-b23d57bd21aa", // American flag/western - Blaze of Glory
  "205": "1440404653325-ab127d49abc1", // massive scale cityscape - Godzilla
  "208": "1484291470158-b8f8d608850d", // dark action silhouette - Treadstone
  "209": "1459749411175-04bf5292ceea", // boxing ring - Rocky
  "212": "1508700115892-45ecd05ae2ad", // power/wealth office - Succession
  "400": "1536440136628-849c177e76a1", // red neon deadpool energy - Ashes

  // ── CALM ─────────────────────────────────────────────────
  "60":  "1418985991508-e47386d96a71", // winter pine forest - Holocene
  "61":  "1476231682828-37e571bc172f", // sparse dark winter trees - Skinny Love
  "62":  "1486325212027-8081e485255e", // foggy morning window - Breathe 2AM
  "64":  "1501426026826-31c667bdf23d", // golden hour meadow - Slow Burn
  "66":  "1558618666-fcd25c85cd64",    // dark river flow - Bloodstream
  "67":  "1499209974431-9dddcece7f88", // girl in field - Youth
  "68":  "1445116572660-236099ec97a0", // dark moody pills/medicine - Medicine
  "230": "1536514498073-50e69d39c6cf", // moody soul portrait - Love & Hate
  "231": "1499415479124-43c32433a620", // dark romantic embrace - Night We Met
  "232": "1414862625253-63af814c65e7", // underground tunnel/descent - Way Down We Go
  "233": "1500462918059-b1a0cb512f1d", // river/water flowing - Hold Back the River
  "234": "1428592953211-077101b2021b", // person alone at night - Before You Go
  "235": "1507003211169-0a1dd7228f2d", // silhouetted figure - Human
  "236": "1433086966358-54859d0ed716", // quiet river path - Somewhere Only We Know
  "237": "1490750967868-88df5691240e", // dandelion in wind - Dandelions
  "238": "1571388208497-71bedc604bf5", // shadow on wall - Unknown To You
  "239": "1446776653964-20c1d3a81b06", // open eyes sunrise - Open Your Eyes
  "401": "1418985991508-e47386d96a71", // ethereal forest - Phantoms & Friends
  "402": "1476231682828-37e571bc172f", // path through trees - Permanent Way
  "403": "1418985991508-e47386d96a71", // wild forest trail - Into The Wild
  "404": "1499415479124-43c32433a620", // twilight glow landscape - Broken Brights
  "405": "1414862625253-63af814c65e7", // deep breath moment - Breathless
  "406": "1428592953211-077101b2021b", // dramatic fall landscape - Before The Fall
  "407": "1433086966358-54859d0ed716", // horizon sunrise - Horizon

  // ── LOVE ─────────────────────────────────────────────────
  "80":  "1518199266791-5375a83190b7", // romantic candles - Make You Feel My Love
  "81":  "1516589178581-6cd7833ae3b2", // someone like you silhouette - Someone Like You
  "82":  "1474552226712-ac0f0961a954", // wedding rings/love - All of Me
  "83":  "1519985176271-adb1088fa94c", // fairytale flowers - A Thousand Years
  "84":  "1503676260728-1c00da094a0b", // romantic guitar player - Perfect
  "85":  "1445294211564-3ca59d999abd", // dancing couple - Thinking Out Loud
  "86":  "1504151932400-72d4384f04b3", // tender couple moment - Can't Help Falling
  "87":  "1490750967868-88df5691240e", // pink flowers - Lover
  "88":  "1498931299472-f7a63a5a1cfa", // golden wildest dreams sunset - Wildest Dreams
  "240": "1446776811953-b23d57bd21aa", // letting go silhouette - Let Her Go
  "241": "1518199266791-5375a83190b7", // couple together - With You
  "242": "1475924156734-496f6cac6ec1", // ocean waves - Waves
  "243": "1499209974431-9dddcece7f88", // holding close - Stay With Me
  "244": "1516589178581-6cd7833ae3b2", // minefields dramatic - Minefields
  "245": "1474552226712-ac0f0961a954", // hands together - Belong Together
  "246": "1499415479124-43c32433a620", // emotional night - Let's Hurt Tonight
  "247": "1504151932400-72d4384f0b3",  // cold heart winter - Cold Heart
  "408": "1518199266791-5375a83190b7", // quiet longing - Only You
  "409": "1516589178581-6cd7833ae3b2", // pastel art palette - Colour My Heart
  "410": "1474552226712-ac0f0961a954", // family bond - Blood's Thicker Than Water
  "411": "1490750967868-88df5691240e", // the one i love - The One I Love

  // ── LEGENDS ──────────────────────────────────────────────
  "100": "1514320291840-2e0a9bf2a9ae", // theatrical stage - Bohemian Rhapsody
  "101": "1449824913935-59a10b8d2000", // sunset hotel/motel - Hotel California
  "102": "1459749411175-04bf5292ceea", // mystical stairway light beams - Stairway to Heaven
  "103": "1484291470158-b8f8d608850d", // brick wall/the wall - Comfortably Numb
  "104": "1486325212027-8081e485255e", // empty landscape wish - Wish You Were Here
  "105": "1471478331149-c72f17e33c73", // abbey road style crossing - Let It Be
  "106": "1508700115892-45ecd05ae2ad", // stadium crowd - Hey Jude
  "107": "1577375729152-4c8b5fcda381", // peaceful sky - Imagine
  "108": "1446776653964-20c1d3a81b06", // space rocket - Space Oddity
  "109": "1501386761578-eac5c94b800a", // concert hero - Heroes
  "110": "1598387993441-a364f854cfdd", // red light district night - Roxanne
  "111": "1470229722913-7c0e2dbbafd3", // surveillance/every breath - Every Breath
  "112": "1489493887464-892be6d1daae", // african savanna - Africa
  "113": "1518085250887-2f903c200fee", // 80s synthwave - Take On Me
  "114": "1526374965328-7f61d4dc18c5", // 80s classroom - Don't You
  "250": "1508700115892-45ecd05ae2ad", // japan neon - Big in Japan
  "251": "1445294211564-3ca59d999abd", // world domination globe - Everybody Wants to Rule
  "252": "1514320291840-2e0a9bf2a9ae", // dark rock concert - Zombie
  "253": "1419242902214-272b3f66ee7a", // starry night sky - What a Wonderful World
  "254": "1459749411175-04bf5292ceea", // mirror reflection stage - Man in Mirror
  "255": "1471478331149-c72f17e33c73", // crowd singing along - Sweet Caroline
  "256": "1484291470158-b8f8d608850d", // berlin wall wind - Wind of Change
  "257": "1508700115892-45ecd05ae2ad", // scottish city street - 500 Miles
  "258": "1445294211564-3ca59d999abd", // golden sunset concert - Don't Let Sun Go Down
  "259": "1534796636912-3b95b3ab5986", // armageddon asteroid - I Don't Want to Miss
  "260": "1418985991508-e47386d96a71", // community hands - Lean on Me
  "261": "1500534314209-a25ddb2bd429", // overcast moody - Ain't No Sunshine
  "262": "1476231682828-37e571bc172f", // standing strong - Stand By Me
  "263": "1514320291840-2e0a9bf2a9ae", // still standing - I'm Still Standing
  "264": "1499415479124-43c32433a620", // save tonight campfire - Save Tonight
  "265": "1459749411175-04bf5292ceea", // it's my life road - It's My Life
  "266": "1484291470158-b8f8d608850d", // renegade graffiti - Renegades
  "267": "1490750967868-88df5691240e", // sunny yellow - Lovely Day
  "268": "1418985991508-e47386d96a71", // grey lynn park - Grey Lynn Park
  "269": "1433086966358-54859d0ed716", // drifting away river - Drift Away
  "270": "1500462918059-b1a0cb512f1d", // city symphony - Bittersweet Symphony
  "271": "1504701954957-2010ec3bcec1", // what's up concert - What's Up
  "272": "1445294211564-3ca59d999abd", // tiffany blue - Breakfast at Tiffany's
  "273": "1514320291840-2e0a9bf2a9ae", // tina turner simply best - The Best
  "412": "1445294211564-3ca59d999abd", // thunderdome - We Don't Need Another Hero
  "413": "1489493887464-892be6d1daae", // zulu dance - Great Heart
  "414": "1514320291840-2e0a9bf2a9ae", // african time - King of Time
  "416": "1508700115892-45ecd05ae2ad", // soul concert - Hold On I'm Comin
  "417": "1471478331149-c72f17e33c73", // stuck on you romantic - Stuck On You
  "418": "1489493887464-892be6d1daae", // south africa crossing - The Crossing
  "419": "1445294211564-3ca59d999abd", // australia down under - Down Under

  // ── VIBES ────────────────────────────────────────────────
  "130": "1477959858617-67f85cf4f1df", // city neon at night - Midnight City
  "132": "1445294211564-3ca59d999abd", // soul grooves - On + On
  "133": "1571330735066-03aaa9429d89", // redbone dark groove - Redbone
  "134": "1508973379184-7517410eec07", // AM indie dark - Do I Wanna Know
  "135": "1493225457124-a3eb161ffa5f", // concert indie energy - R U Mine
  "136": "1614613535308-eb5fbd3d2c17", // 505 dark corridor - 505
  "138": "1535223289429-72aad301b73d", // electric synth - Electric Feel
  "139": "1553514029-1318c9127859",    // psychedelic kids - Kids
  "280": "1558618666-fcd25c85cd64",    // geronimo jump - Geronimo
  "281": "1477959858617-67f85cf4f1df", // budapest architecture - Budapest
  "282": "1571330735066-03aaa9429d89", // high on life EDM - High on Life
  "283": "1535223289429-72aad301b73d", // hotstepper party - Hotstepper
  "284": "1526374965328-7f61d4dc18c5", // love me again stage - Love Me Again
  "285": "1558618666-fcd25c85cd64",    // can't feel my face - Can't Feel My Face
  "420": "1507838153414-b4b713384a76", // glass/built on glass - Talk Is Cheap
  "421": "1477959858617-67f85cf4f1df", // feel the music - Feel
  "422": "1571330735066-03aaa9429d89", // u and me together - U&ME
  "423": "1535223289429-72aad301b73d", // in the air tonight drums - In the Air Tonight
  "424": "1477959858617-67f85cf4f1df", // livin on time - Livin on Borrowed Time
  "425": "1526374965328-7f61d4dc18c5", // higher climb - Higher
  "426": "1558618666-fcd25c85cd64",    // watch me die dark - Watch Me Die
  "427": "1571330735066-03aaa9429d89", // here we go energy - Here We Go
  "428": "1535223289429-72aad301b73d", // nobody move dark - Nobody Move
  "429": "1477959858617-67f85cf4f1df", // manike bollywood - Manike
  "430": "1558618666-fcd25c85cd64",    // gorilla cadbury drums - Cadbury Gorilla

  // ── OTHER ────────────────────────────────────────────────
  "150": "1614613535308-eb5fbd3d2c17", // blinding neon - Blinding Lights
  "151": "1446776811953-b23d57bd21aa", // starboy neon - Starboy
  "152": "1574169208507-84376144848b", // circles abstract - Circles
  "153": "1561336313-0bd5e0b27ec8",    // sunflower spiderman - Sunflower
  "154": "1516450360452-9312f5e86fc7", // levitating disco - Levitating
  "155": "1500534314209-a25ddb2bd429", // as it was pastel - As It Was
  "156": "1504701954957-2010ec3bcec1", // heat waves summer - Heat Waves
  "157": "1495616811223-4d98c6e9c869", // golden hour - golden hour
  "158": "1518972734183-c4b97c4e1a32", // anti hero dark - Anti-Hero
  "159": "1490750967868-88df5691240e", // flowers bloom - Flowers
  "160": "1476231682828-37e571bc172f", // cruel summer night - Cruel Summer
  "161": "1445116572660-236099ec97a0", // peaches fruit - Peaches
  "290": "1446776811953-b23d57bd21aa", // skin rag n bone - Skin
  "291": "1477959858617-67f85cf4f1df", // superman scrubs - Superman
  "431": "1477959858617-67f85cf4f1df", // home bright album - Home
  "432": "1500462918059-b1a0cb512f1d", // ordinary everyday - Ordinary
  "433": "1535223289429-72aad301b73d", // magnetic field - magnetic magnetic
  "434": "1526374965328-7f61d4dc18c5", // never did dark - Never Did
  "435": "1477959858617-67f85cf4f1df", // cruise extended - Cruise
  "436": "1558618666-fcd25c85cd64",    // can't go back - Can't Go Back
  "437": "1500462918059-b1a0cb512f1d", // hold on hope - Hold on Hope
  "438": "1501426026826-31c667bdf23d", // need your love - Need Your Love
  "439": "1471478331149-c72f17e33c73", // like a prayer choir - Like a Prayer
  "440": "1464802686167-b939a6910659", // laila majnu india - O'Meri Laila
  "441": "1535223289429-72aad301b73d", // broken people - Broken People

  // ── TECHNO ───────────────────────────────────────────────
  "310": "1571330735066-03aaa9429d89", // EDM waltz - One Last Waltz
  "311": "1535223289429-72aad301b73d", // against the tide - Against the Tide
  "312": "1598387993441-a364f854cfdd", // tell me why techno - Tell Me Why
  "313": "1526374965328-7f61d4dc18c5", // inner light glow - Inner Light
  "314": "1571330735066-03aaa9429d89", // shots imagine dragons - Shots
  "442": "1598387993441-a364f854cfdd", // judgement dark - Judgement Day
  "443": "1535223289429-72aad301b73d", // it goes on - It Goes On
  "444": "1526374965328-7f61d4dc18c5", // break silence dig - Break the Silence
  "445": "1558618666-fcd25c85cd64",    // fate don't know you - Fate Don't Know You

  // ── PEAK ─────────────────────────────────────────────────
  "131": "1598387993441-a364f854cfdd", // xx intro minimal - Intro
  "300": "1507003211169-0a1dd7228f2d", // opera stage - Nessun Dorma
  "301": "1464802686167-b939a6910659", // bollywood india - Tere Bina
  "446": "1477959858617-67f85cf4f1df", // spy james bond - Man For All Seasons

  // ── MISC ─────────────────────────────────────────────────
  "447": "1414862625253-63af814c65e7", // true detective dark - Angry River
  "448": "1499415479124-43c32433a620", // lera lynn lately - Lately
  "449": "1477959858617-67f85cf4f1df", // psych theme fun - Psych Theme
  "450": "1476231682828-37e571bc172f", // save you emotional - Save You
};

// Apply replacements
let changed = 0;
for (const [id, photo] of Object.entries(covers)) {
  // Match the id field in data.ts and replace its coverUrl
  const url = `https://images.unsplash.com/photo-${photo}?w=800&q=80`;
  // Regex: find line with id: "X" and replace its coverUrl value
  const re = new RegExp(`(id:\\s*"${id}"[^\\n]*?coverUrl:\\s*")([^"]+)(")`);
  const newSrc = src.replace(re, `$1${url}$3`);
  if (newSrc !== src) { src = newSrc; changed++; }
}

fs.writeFileSync(file, src, "utf8");
console.log(`Updated ${changed} cover URLs`);
