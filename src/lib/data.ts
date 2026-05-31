export interface Track { id: string; title: string; artist: string; album: string; coverUrl: string; duration: string; src: string; }
export interface Playlist { id: string; name: string; description?: string; coverUrl: string; tracks: Track[]; }

// Cover art: curated Unsplash photos matched to each song's mood, artist, and era.

export const ALL_TRACKS: Track[] = [
  // ── COLDPLAY ─────────────────────────────────────────────────────────────
  // Paradise — dreaming of Africa/elephants, bright optimistic
  { id: "1",  title: "Paradise",     artist: "Coldplay", album: "Mylo Xyloto",              duration: "4:39", src: "/music/Coldplay - Paradise (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80" },
  // In My Place — moody UK rock, rainy streets
  { id: "2",  title: "In My Place",  artist: "Coldplay", album: "A Rush of Blood to the Head", duration: "3:47", src: "/music/Coldplay - In My Place (Official 4K Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80" },
  // Fix You — candle in the dark, emotional, light at end of tunnel
  { id: "5",  title: "Fix You",      artist: "Coldplay", album: "X&Y",                      duration: "4:56", src: "/music/Coldplay - Fix You (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80" },
  // Magic — mysterious, dark sparkle, Ghost Stories
  { id: "10", title: "Magic",        artist: "Coldplay", album: "Ghost Stories",             duration: "4:46", src: "/music/Coldplay - Magic (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80" },
  // Violet Hill — dark, political, war imagery
  { id: "16", title: "Violet Hill",  artist: "Coldplay", album: "Viva la Vida",              duration: "3:43", src: "/music/Coldplay - Violet Hill (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80" },
  // Everglow — warm golden light, memory, loss
  { id: "17", title: "Everglow",     artist: "Coldplay", album: "A Head Full of Dreams",     duration: "4:43", src: "/music/Coldplay - Everglow [Single Version] - (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80" },
  // Miracles — space, stars, wonder
  { id: "18", title: "Miracles",     artist: "Coldplay", album: "Unbroken",                  duration: "3:56", src: "/music/Coldplay - Miracles (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },
  // Up&Up — soaring, sky, birds, surreal landscape
  { id: "19", title: "Up&Up",        artist: "Coldplay", album: "A Head Full of Dreams",     duration: "6:46", src: "/music/Coldplay - Up&Up (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },

  // ── CHET FAKER ───────────────────────────────────────────────────────────
  // Talk Is Cheap — moody indie electronic, Melbourne underground
  { id: "20", title: "Talk Is Cheap", artist: "Chet Faker", album: "Built on Glass",         duration: "3:39", src: "/music/Talk Is Cheap.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },

  // ── AVI SNOW ─────────────────────────────────────────────────────────────
  // Feel — dreamy, soft electronic
  { id: "21", title: "Feel",          artist: "Avi Snow", album: "Feel",                     duration: "2:48", src: "/music/Feel - Avi Snow, MVCA, Zeeba (AI Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },

  // ── ELEZO ─────────────────────────────────────────────────────────────────
  // The XX Intro remix — dark minimal, black and white
  { id: "28", title: "The XX Intro (ELEZO Remix)", artist: "ELEZO", album: "Remix",          duration: "2:42", src: "/music/The XX Intro - ELEZO remix ( Official video ).mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80" },

  // ── SUPERMODE ────────────────────────────────────────────────────────────
  // Tell Me Why — late 90s eurodance, neon
  { id: "29", title: "Tell Me Why (James Carter Remix)", artist: "Supermode", album: "Tell Me Why", duration: "2:59", src: "/music/Tell Me Why (James Carter Remix) - Supermode.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },

  // ── DEZKO & CERES ────────────────────────────────────────────────────────
  // U&ME — romantic, couple, warm lights
  { id: "30", title: "U&ME",          artist: "Dezko", album: "U&ME",                        duration: "3:16", src: "/music/Dezko & CERES - U&ME (Visualizer).mp3",
    coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" },

  // ── MARIUS BEAR ──────────────────────────────────────────────────────────
  // Horizon — wide open landscape, looking ahead
  { id: "31", title: "Horizon",       artist: "Marius Bear", album: "Horizon",               duration: "2:53", src: "/music/Marius Bear - Horizon (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },

  // ── JON HOWARD ───────────────────────────────────────────────────────────
  // In the Air Tonight — iconic drum fill, rain, atmosphere
  { id: "32", title: "In the Air Tonight", artist: "Jon Howard", album: "In the Air Tonight", duration: "2:54", src: "/music/In The Air Tonight-  Jon Howard (Official Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80" },

  // ── BREAKING RUST ─────────────────────────────────────────────────────────
  // Livin' on Borrowed Time — gritty, worn, clock/time
  { id: "33", title: "Livin' on Borrowed Time", artist: "Breaking Rust", album: "Livin' on Borrowed Time", duration: "3:25", src: "/music/Livin' on Borrowed Time.mp3",
    coverUrl: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&q=80" },

  // ── JAMIE N COMMONS ──────────────────────────────────────────────────────
  // Lead Me Home — Walking Dead, post-apocalyptic, lone figure
  { id: "53", title: "Lead Me Home",  artist: "Jamie N Commons", album: "The Walking Dead OST", duration: "1:58", src: "/music/Jamie N Commons - Lead Me Home (The Walking Dead).mp3",
    coverUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80" },

  // ── CROIXX ───────────────────────────────────────────────────────────────
  // Higher — uplifting, light rays, rising
  { id: "34", title: "Higher",        artist: "Croixx", album: "Higher",                     duration: "2:04", src: "/music/Croixx - Higher (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80" },

  // ── MARTIN WAVE ──────────────────────────────────────────────────────────
  // Watch Me Die — dark thriller, Terminal List, military tension
  { id: "35", title: "Watch Me Die",  artist: "Martin Wave", album: "Watch Me Die",          duration: "2:48", src: "/music/Martin Wave feat. ASHBY - Watch Me Die (From The Terminal List) [FULL SONG].mp3",
    coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80" },

  // ── ALEX WARREN ──────────────────────────────────────────────────────────
  // Ordinary — emotional pop, young male singer-songwriter
  { id: "36", title: "Ordinary",      artist: "Alex Warren", album: "You'll Be Alright, Kid", duration: "3:07", src: "/music/Alex Warren - Ordinary (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },

  // ── HANS ZIMMER — Batman ─────────────────────────────────────────────────
  // A Dark Knight — Gotham, dark city at night, brooding
  { id: "47", title: "A Dark Knight (Epic Version)", artist: "Hans Zimmer", album: "The Dark Knight OST", duration: "6:22", src: "/music/Hans Zimmer - A Dark Knight ｜ EPIC VERSION.mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── IMA ROBOT ────────────────────────────────────────────────────────────
  // Greenback Boogie — Suits, Wall Street, money, sharp suits
  { id: "54", title: "Greenback Boogie", artist: "Ima Robot", album: "Suits OST",            duration: "4:58", src: "/music/Ima Robot - Greenback Boogie - (official video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },

  // ── OLD MAN CANYON ────────────────────────────────────────────────────────
  // Phantoms & Friends — misty forest, ethereal
  { id: "37", title: "Phantoms and Friends", artist: "Old Man Canyon", album: "Phantoms & Friends", duration: "3:52", src: "/music/Old Man Canyon - Phantoms & Friends [Official Video].mp3",
    coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" },

  // ── PASSENGER ────────────────────────────────────────────────────────────
  // Let Her Go — watching things slip away, autumn leaves, melancholy
  { id: "38", title: "Let Her Go",    artist: "Passenger", album: "All The Little Lights",   duration: "4:13", src: "/music/Passenger ｜ Let Her Go (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },

  // ── NORMAN ───────────────────────────────────────────────────────────────
  // Here We Go — energetic, crowd, live music
  { id: "39", title: "Here We Go",    artist: "Norman", album: "Here We Go",                 duration: "2:24", src: "/music/Here We Go.mp3",
    coverUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80" },

  // ── BOBBY BAZINI ─────────────────────────────────────────────────────────
  // Blood's Thicker Than Water — family, roots, loyalty
  { id: "40", title: "Blood's Thicker Than Water", artist: "Bobby Bazini", album: "Summer Is Gone", duration: "3:42", src: "/music/Bobby Bazini - Blood's Thicker Than Water (Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80" },

  // ── MIRROR FURY ──────────────────────────────────────────────────────────
  // The One I Love — romantic, intimate
  { id: "41", title: "The One I Love", artist: "Mirror Fury", album: "The One I Love",       duration: "3:05", src: "/music/Mirror Fury - The One I Love.mp3",
    coverUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80" },

  // ── LOUIS ARMSTRONG ──────────────────────────────────────────────────────
  // What a Wonderful World — warm golden nature, flowers, blue sky
  { id: "42", title: "What a Wonderful World", artist: "Louis Armstrong", album: "What a Wonderful World", duration: "2:20", src: "/music/Louis Armstrong - What A Wonderful World (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80" },

  // ── NOVRA ────────────────────────────────────────────────────────────────
  // Before The Fall — deep house, dark ocean, before collapse
  { id: "43", title: "Before The Fall", artist: "Novra", album: "Before The Fall",           duration: "6:59", src: "/music/NOVRA – Before The Fall ｜ Emotional Deep House.mp3",
    coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },

  // ── THE VEILS ────────────────────────────────────────────────────────────
  // Grey Lynn Park — NZ indie, park, overcast
  { id: "44", title: "Grey Lynn Park", artist: "The Veils", album: "Troubles of the Brain",  duration: "2:40", src: "/music/The Veils - Grey Lynn Park.mp3",
    coverUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=400&q=80" },

  // ── MICHAEL JACKSON ──────────────────────────────────────────────────────
  // Man in the Mirror — reflection, self, spotlight
  { id: "45", title: "Man in the Mirror", artist: "Michael Jackson", album: "Bad",            duration: "5:20", src: "/music/Man in the Mirror - Michael Jackson.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80" },

  // ── DAN WILSON ───────────────────────────────────────────────────────────
  // Breathless — breathless, wind, movement
  { id: "46", title: "Breathless",    artist: "Dan Wilson", album: "Free Life",               duration: "3:54", src: "/music/Dan Wilson - Breathless.mp3",
    coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80" },

  // ── LORD HURON ───────────────────────────────────────────────────────────
  // The Night We Met — campfire, night, nostalgia, stars
  { id: "48", title: "The Night We Met", artist: "Lord Huron", album: "Strange Trails",      duration: "3:29", src: "/music/The Night We Met - Lord Huron.mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },

  // ── CHARLIE CUNNINGHAM ────────────────────────────────────────────────────
  // Permanent Way — folk, acoustic, road/path
  { id: "49", title: "Permanent Way (Live Session)", artist: "Charlie Cunningham", album: "Flesh & Bone", duration: "4:18", src: "/music/Charlie Cunningham - Permanent Way (Live Session).mp3",
    coverUrl: "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=400&q=80" },

  // ── NEIL DIAMOND ─────────────────────────────────────────────────────────
  // Sweet Caroline — crowd singalong, stadium, joy
  { id: "50", title: "Sweet Caroline", artist: "Neil Diamond", album: "Sweet Caroline",      duration: "3:24", src: "/music/Neil Diamond - Sweet Caroline (Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },

  // ── LUCIANO PAVAROTTI ────────────────────────────────────────────────────
  // Nessun Dorma — opera, grand stage, dramatic spotlight
  { id: "51", title: "Nessun Dorma (Live)", artist: "Luciano Pavarotti", album: "The Three Tenors in Concert 1994", duration: "3:25", src: "/music/The Three Tenors in Concert 1994： ＂Nessun Dorma＂ from Turandot (encore).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80" },

  // ── CELINE DION — Deadpool 2 ─────────────────────────────────────────────
  // Ashes — Deadpool, comic absurdity meets heartbreak
  { id: "52", title: "Ashes (from Deadpool 2)", artist: "Celine Dion", album: "Deadpool 2 OST", duration: "3:20", src: "/music/Céline Dion - Ashes (from ＂Deadpool 2＂ Motion Picture Soundtrack).mp3",
    coverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },

  // ── SURVIVOR ─────────────────────────────────────────────────────────────
  // Eye of the Tiger — boxing, fighter, rocky, raw power
  { id: "58", title: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger",       duration: "4:04", src: "/music/Survivor - Eye Of The Tiger (Official HD Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80" },

  // ── ATIF ASLAM ───────────────────────────────────────────────────────────
  // O'Meri Laila — Bollywood romance, warm colours, India
  { id: "55", title: "O'Meri Laila",  artist: "Atif Aslam", album: "Laila Majnu",            duration: "4:42", src: "/music/O Meri Laila - Lyrical ｜ Laila Majnu ｜ Jyotica Tangri ｜ Avinash Tiwary & Tripti Dimri.mp3",
    coverUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80" },

  // ── KEANE ────────────────────────────────────────────────────────────────
  // Somewhere Only We Know — English countryside, green meadow
  { id: "56", title: "Somewhere Only We Know", artist: "Keane", album: "Hopes and Fears",    duration: "3:58", src: "/music/Keane - Somewhere Only We Know (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },

  // ── WRABEL ───────────────────────────────────────────────────────────────
  // Into The Wild — wild nature, escape, forest
  { id: "57", title: "Into The Wild", artist: "Wrabel", album: "Sideways",                   duration: "3:31", src: "/music/Wrabel - Into The Wild (Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80" },

  // ── TURIN BRAKES ─────────────────────────────────────────────────────────
  // Save You — reaching out, hand, rescue
  { id: "59", title: "Save You",      artist: "Turin Brakes", album: "Save You",             duration: "3:05", src: "/music/Turin Brakes - Save You (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80" },

  // ── THE FRIENDLY INDIANS — Psych ──────────────────────────────────────────
  // Psych Theme — detective, pineapple, quirky fun
  { id: "60", title: "Psych Theme Song", artist: "The Friendly Indians", album: "Psych OST", duration: "2:08", src: "/music/Psych Theme Song (Full Version)~Friendly Indians.mp3",
    coverUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80" },

  // ── ELDERBROOK ───────────────────────────────────────────────────────────
  // Inner Light — spiritual, glowing light through dark
  { id: "61", title: "Inner Light",   artist: "Elderbrook", album: "Inner Light",            duration: "4:18", src: "/music/Elderbrook - Inner Light with Bob Moses (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&q=80" },

  // ── ALPHAVILLE ───────────────────────────────────────────────────────────
  // Big in Japan — 80s neon Tokyo, Japan city lights
  { id: "62", title: "Big in Japan",  artist: "Alphaville", album: "Forever Young",          duration: "4:45", src: "/music/Alphaville - Big In Japan (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },

  // ── CHARLOTTE OC ─────────────────────────────────────────────────────────
  // Colour My Heart — watercolour, vivid colour splash
  { id: "63", title: "Colour My Heart", artist: "Charlotte OC", album: "Colour My Heart",   duration: "4:40", src: "/music/Charlotte OC - Colour My Heart (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&q=80" },

  // ── DEAN LEWIS ───────────────────────────────————─────────────────────────
  // Waves — ocean waves, sea, coast
  { id: "64", title: "Waves",         artist: "Dean Lewis", album: "Same Kind of Different", duration: "4:02", src: "/music/Dean Lewis - Waves (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },

  // ── LOGIC & RAG'N'BONE MAN ────────────────────────────────────────────────
  // Broken People — Bright soundtrack, fantasy police LA
  { id: "65", title: "Broken People", artist: "Logic & Rag'n'Bone Man", album: "Bright: The Album", duration: "3:33", src: "/music/Logic & Rag'n'Bone Man - Broken People (from Bright： The Album) [Official Lyric Video].mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── FAOUZIA & JOHN LEGEND ────────────────────────────────────────────────
  // Minefields — emotional piano ballad, two voices
  { id: "66", title: "Minefields",    artist: "Faouzia & John Legend", album: "Minefields",  duration: "3:11", src: "/music/Faouzia & John Legend - Minefields (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80" },

  // ── ROBBIE WILLIAMS ──────────────────────────────────────────────────────
  // Man For All Seasons — Johnny English, spy comedy, British
  { id: "67", title: "Man For All Seasons", artist: "Robbie Williams", album: "Johnny English OST", duration: "4:01", src: "/music/Robbie Williams - Man For All Seasons (Johnny English).mp3",
    coverUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80" },

  // ── ZAC BROWN & SIR ROSEVELT ─────────────────────────────────────────────
  // It Goes On — country, road, life moving forward
  { id: "68", title: "It Goes On",    artist: "Sir Rosevelt & Zac Brown", album: "It Goes On", duration: "3:25", src: "/music/Zac Brown & Sir Rosevelt - It Goes On (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&q=80" },

  // ── THE DIG ──────────────────────────────────────────────────────────────
  // Break the Silence — quiet indie, hush, alone
  { id: "69", title: "Break the Silence", artist: "The Dig", album: "Midnight Flowers",     duration: "3:46", src: "/music/Break The Silence ⧸⧸ The Dig ⧸⧸ Midnight Flowers (2012).mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80" },

  // ── DESI VALENTINE ───────────────────────────────────────────────────────
  // Fate Don't Know You — Americana, campfire, fate
  { id: "70", title: "Fate Don't Know You", artist: "Desi Valentine", album: "Fate Don't Know You", duration: "4:02", src: "/music/Desi Valentine - Fate Don't Know You.mp3",
    coverUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=80" },

  // ── MARK AMBOR ───────────────────────────────────────────────────────────
  // Belong Together — warm, romantic, couple
  { id: "71", title: "Belong Together", artist: "Mark Ambor", album: "Belong Together",      duration: "2:29", src: "/music/Mark Ambor - Belong Together (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" },

  // ── STEALTH ──────────────────────────────────────────────────────────────
  // Judgement Day — epic, dark, storm clouds
  { id: "72", title: "Judgement Day", artist: "Stealth", album: "Intro",                    duration: "3:51", src: "/music/Stealth - Judgement Day.mp3",
    coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80" },

  // ── JOHNNY CLEGG ─────────────────────────────────────────────────────────
  // King of Time — South African, African sunset
  { id: "73", title: "King of Time",  artist: "Johnny Clegg", album: "King of Time",         duration: "3:17", src: "/music/Johnny Clegg - King Of Time.mp3",
    coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80" },

  // ── ANGUS STONE ──────────────────────────────────────────────────────────
  // Broken Brights — Australian folk, warm golden bushland
  { id: "74", title: "Broken Brights", artist: "Angus Stone", album: "Broken Brights",      duration: "4:13", src: "/music/Angus Stone - Broken Brights Official Video.mp3",
    coverUrl: "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=400&q=80" },

  // ── CADBURY GORILLA / DANJWO ─────────────────────────────────────────────
  // In The Air Tonight Extended — drums in the dark, tension building
  { id: "75", title: "In The Air Tonight (Extended Mix)", artist: "danjwo", album: "In The Air Tonight Extended", duration: "4:28", src: "/music/Cadbury Gorilla - In The Air Tonight (Extended Mix).mp3",
    coverUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80" },

  // ── MICHAEL KIWANUKA ─────────────────────────────────────────────────────
  // Love & Hate — soulful, 70s soul, warm vinyl
  { id: "76", title: "Love & Hate",   artist: "Michael Kiwanuka", album: "Love & Hate",      duration: "7:08", src: "/music/Michael Kiwanuka - Love & Hate (Live Session).mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },

  // ── A.R. RAHMAN ──────────────────────────────────────────────────────────
  // Tere Bina — Guru, India, sitar, golden light
  { id: "77", title: "Tere Bina",     artist: "A.R. Rahman", album: "Guru OST",              duration: "5:10", src: "/music/A.R. Rahman - Tere Bina ｜ Lyrical Song ｜ Aishwarya Rai ｜ Abhishek Bachchan ｜ Guru ｜ Gulzar.mp3",
    coverUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80" },

  // ── SAMUEL KIM ───────────────────────────────────────────────────────────
  // Duel of The Fates — Star Wars, space, epic battle
  { id: "78", title: "Duel of The Fates (Epic Version)", artist: "Samuel Kim", album: "Duel of The Fates", duration: "3:06", src: "/music/Star Wars： Duel of The Fates ｜ EPIC VERSION (Remastered V2).mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },

  // ── TINA TURNER ──────────────────────────────────────────────────────────
  // We Don't Need Another Hero — Thunderdome, post-apocalyptic, power
  { id: "79", title: "We Don't Need Another Hero", artist: "Tina Turner", album: "Simply the Best", duration: "4:16", src: "/music/TINA TURNER ★ We Don't Need Another Hero (Thunderdome)【music video】.mp3",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80" },

  // ── JOHNNY CLEGG — Great Heart ───────────────────────────────────────────
  // Great Heart — African savanna, ubuntu, community
  { id: "80", title: "Great Heart",   artist: "Johnny Clegg", album: "Third World Child",    duration: "4:22", src: "/music/Johnny Clegg-Great Heart.mp3",
    coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80" },

  // ── LAZLO BANE — Scrubs ──────────────────────────────────────────────────
  // Superman / Scrubs — hospital, comedy, everyday hero
  { id: "81", title: "Superman",      artist: "Lazlo Bane", album: "All The Time in the World", duration: "3:46", src: "/music/Scrubs Theme Song Superman Lazlo Bane Official Video Remastered HD.mp3",
    coverUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&q=80" },

  // ── JOSÉ GONZÁLEZ ────────────────────────────────────────────────────────
  // Stay Alive — Walter Mitty, Iceland, vast wilderness
  { id: "82", title: "Stay Alive",    artist: "José González", album: "The Secret Life of Walter Mitty", duration: "4:27", src: "/music/José González - Stay Alive.mp3",
    coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&q=80" },

  // ── ROCKY BALBOA THEME ────────────────────────────────────────────────────
  // Rocky — running up steps, training, fist pump
  { id: "83", title: "Rocky Balboa Theme", artist: "Various Artists", album: "Rocky Balboa OST", duration: "4:55", src: "/music/Rocky Balboa - Theme Song (HD).mp3",
    coverUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80" },

  // ── JON BON JOVI ─────────────────────────────────────────────────────────
  // Blaze of Glory — Young Guns, Western, desert, cowboy
  { id: "84", title: "Blaze of Glory", artist: "Jon Bon Jovi", album: "Young Guns II",       duration: "5:36", src: "/music/Bon Jovi - Young Guns II Blaze of Glory.mp3",
    coverUrl: "https://images.unsplash.com/photo-1508193638397-1c4234db14d8?w=400&q=80" },

  // ── DEEP BLUE SOMETHING ──────────────────────────────────────────────────
  // Breakfast at Tiffany's — Audrey Hepburn, NYC, coffee, window
  { id: "85", title: "Breakfast at Tiffany's", artist: "Deep Blue Something", album: "Home", duration: "4:18", src: "/music/Deep Blue Something - Breakfast At Tiffany's (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=400&q=80" },

  // ── RUTH B. ──────────────────────────────────────────────────────────────
  // Dandelions — dandelion field, blowing seeds, soft summer
  { id: "86", title: "Dandelions",    artist: "Ruth B.", album: "Safe Haven",                duration: "3:54", src: "/music/Ruth B. - Dandelions (Lyrics).mp3",
    coverUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&q=80" },

  // ── CHRIS CORNELL ────────────────────────────────────────────────────────
  // You Know My Name — Bond, Casino Royale, espionage
  { id: "87", title: "You Know My Name", artist: "Chris Cornell", album: "Casino Royale OST", duration: "4:01", src: "/music/Casino Royale - Chris Cornell - You Know My Name.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },

  // ── THE PROCLAIMERS ──────────────────────────────────────────────────────
  // 500 Miles — walking, road, Scottish hills
  { id: "88", title: "I'm Gonna Be (500 Miles)", artist: "The Proclaimers", album: "Sunshine on Leith", duration: "3:40", src: "/music/The Proclaimers - I'm Gonna Be (500 Miles) (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1510797215324-95aa89f43c33?w=400&q=80" },

  // ── BILL WITHERS ─────────────────────────────────────────────────────────
  // Lean on Me — community, togetherness, hand on shoulder
  { id: "89", title: "Lean on Me",    artist: "Bill Withers", album: "Still Bill",           duration: "4:19", src: "/music/Lean on Me.mp3",
    coverUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&q=80" },

  // ── BON JOVI ─────────────────────────────────────────────────────────────
  // It's My Life — rock, living on your own terms, stage
  { id: "90", title: "It's My Life",  artist: "Bon Jovi", album: "Crush",                    duration: "3:45", src: "/music/Bon Jovi - It's My Life (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80" },

  // ── THE WEEKND ───────────────────────────────────────────────────────────
  // Can't Feel My Face — dark neon, night club, The Weeknd aesthetic
  { id: "91", title: "Can't Feel My Face", artist: "The Weeknd", album: "Beauty Behind the Madness", duration: "3:34", src: "/music/The Weeknd - Can't Feel My Face (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },

  // ── NICHOLAS BRITELL — Succession ────────────────────────────────────────
  // Succession theme — wealth, power, NYC skyline, boardroom
  { id: "92", title: "Succession (Main Title Theme)", artist: "Nicholas Britell", album: "Succession Season 4", duration: "2:02", src: "/music/Succession (Main Title Theme) - Nicholas Britell ｜ Succession (HBO Original Series Soundtrack).mp3",
    coverUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },

  // ── ALEXANDRE DESPLAT ────────────────────────────────────────────────────
  // Godzilla! — monster, destruction, massive scale
  { id: "93", title: "Godzilla!",     artist: "Alexandre Desplat", album: "Godzilla OST",    duration: "2:09", src: "/music/Godzilla Soundtrack ｜ Godzilla! - Alexandre Desplat ｜ WaterTower Music.mp3",
    coverUrl: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&q=80" },

  // ── ONEREPUBLIC ──────────────────────────────────────────────────────────
  // Let's Hurt Tonight — emotional, raw, pain of love
  { id: "94", title: "Let's Hurt Tonight", artist: "OneRepublic", album: "Oh My My",         duration: "3:15", src: "/music/OneRepublic - Let's Hurt Tonight.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80" },

  // ── THE XX ───────────────────────────────────────────────────────────────
  // Intro — minimal, sparse, black and white intimacy
  { id: "95", title: "Intro",         artist: "The xx", album: "xx",                         duration: "2:07", src: "/music/Intro.mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80" },

  // ── HANNI EL KHATIB ──────────────────────────────────────────────────────
  // Nobody Move — garage rock, gritty, dark alley
  { id: "96", title: "Nobody Move",   artist: "Hanni El Khatib", album: "Head in the Dirt",  duration: "2:32", src: "/music/Hanni El Khatib - Nobody Move.mp3",
    coverUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80" },

  // ── YOHANI ───────────────────────────────────────────────────────────────
  // Manike — Sri Lankan/Bollywood, vibrant, dance
  { id: "97", title: "Manike",        artist: "Yohani", album: "Manike",                     duration: "3:57", src: "/music/Manike (Full Video)： Thank God ｜ Nora,Sidharth｜ Tanishk,Yohani,Jubin,Surya R ｜Rashmi Virag｜Bhushan K.mp3",
    coverUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=80" },

  // ── SHEPPARD ─────────────────────────────────────────────────────────────
  // Geronimo — jumping, free fall, energy, fun
  { id: "98", title: "Geronimo",      artist: "Sheppard", album: "Bombs Away",               duration: "3:39", src: "/music/Sheppard - Geronimo (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80" },

  // ── INI KAMOZE ───────────────────────────────────────────────────────────
  // Here Comes the Hotstepper — reggae, Jamaica, swagger
  { id: "99", title: "Here Comes the Hotstepper", artist: "Ini Kamoze", album: "Here Comes the Hotstepper", duration: "4:11", src: "/music/Ini Kamoze - Here Comes The Hotstepper (Remix) (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80" },

  // ── MARTIN GARRIX ────────────────────────────────────────────────────────
  // High on Life — EDM festival, crowd, laser lights
  { id: "100", title: "High on Life", artist: "Martin Garrix", album: "High on Life",        duration: "3:51", src: "/music/Martin Garrix feat. Bonn - High On Life (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },

  // ── GEORGE EZRA ──────────────────────────────────────────────────────────
  // Budapest — Budapest city, Danube, Europe travel
  { id: "101", title: "Budapest",     artist: "George Ezra", album: "Wanted on Voyage",      duration: "3:21", src: "/music/George Ezra - Budapest (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?w=400&q=80" },

  // ── THE VERVE ────────────────────────────────────────────────────────────
  // Bittersweet Symphony — walking through busy street, strings
  { id: "102", title: "Bittersweet Symphony", artist: "The Verve", album: "Urban Hymns",     duration: "4:30", src: "/music/The Verve - Bitter Sweet Symphony.mp3",
    coverUrl: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400&q=80" },

  // ── 4 NON BLONDES ────────────────────────────────────────────────────────
  // What's Up? — 90s alternative, asking questions, searching
  { id: "103", title: "What's Up?",   artist: "4 Non Blondes", album: "Bigger, Better, Faster, More!", duration: "4:56", src: "/music/4 Non Blondes - What's Up (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },

  // ── LIKE A PRAYER CHOIR ───────────────────────────────────────────────────
  // Like a Prayer Choir — gospel choir, church, spiritual
  { id: "104", title: "Like a Prayer (Choir Version)", artist: "I'll Take You There Choir", album: "Deadpool & Wolverine", duration: "2:33", src: "/music/Madonna - Like A Prayer (Choir Version) [Vinyl Visualizer].mp3",
    coverUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&q=80" },

  // ── DOBIE GRAY ───────────────────────────────────────────────────────────
  // Drift Away — classic rock, drifting, weightless
  { id: "105", title: "Drift Away",   artist: "Dobie Gray", album: "Drift Away",             duration: "3:59", src: "/music/Dobie Gray - Drift Away (Original Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },

  // ── FRIENDS OF JOHNNY CLEGG ──────────────────────────────────────────────
  // The Crossing — African unity, crossing borders, ubuntu
  { id: "106", title: "The Crossing", artist: "Friends of Johnny Clegg", album: "The Crossing", duration: "5:07", src: "/music/THE CROSSING - Friends of Johnny Clegg.mp3",
    coverUrl: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=400&q=80" },

  // ── ELTON JOHN & DUA LIPA ────────────────────────────────────────────────
  // Cold Heart — glam, disco mirror ball, nostalgic glitter
  { id: "107", title: "Cold Heart (PNAU Remix)", artist: "Elton John & Dua Lipa", album: "The Lockdown Sessions", duration: "3:23", src: "/music/Elton John, Dua Lipa - Cold Heart (PNAU Remix) (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },

  // ── JACOB BANKS ──────────────────────────────────────────────────────────
  // Unknown (To You) — mystery, silhouette, unknown figure
  { id: "108", title: "Unknown (To You)", artist: "Jacob Banks", album: "Village",           duration: "3:54", src: "/music/Jacob Banks - Unknown (To You) Official Music Video.mp3",
    coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80" },

  // ── LEWIS CAPALDI ────────────────────────────────────────────────────────
  // Before You Go — grief, loss, letter, rain
  { id: "109", title: "Before You Go", artist: "Lewis Capaldi", album: "Divinely Uninspired to a Hellish Extent", duration: "3:36", src: "/music/Lewis Capaldi - Before You Go (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=400&q=80" },

  // ── KALEO ────────────────────────────────────────────────────────────────
  // Way Down We Go — dark descent, underground, Icelandic
  { id: "110", title: "Way Down We Go", artist: "KALEO", album: "A/B",                       duration: "3:34", src: "/music/KALEO - Way Down We Go (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=400&q=80" },

  // ── RAG'N'BONE MAN ───────────────────────────────────────────────────────
  // Human — raw, imperfect, soulful man
  { id: "111", title: "Human",        artist: "Rag'n'Bone Man", album: "Human",              duration: "3:20", src: "/music/Rag'n'Bone Man - Human (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=400&q=80" },

  // ── SAM SMITH ────────────────────────────────────────────────────────────
  // Stay With Me — longing, candlelit, intimate bedroom
  { id: "112", title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour",      duration: "2:53", src: "/music/Sam Smith - Stay With Me (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=400&q=80" },

  // ── GEORGE MICHAEL & ELTON JOHN ──────────────────────────────────────────
  // Don't Let the Sun Go Down — sunset, classic rock legends, stage
  { id: "113", title: "Don't Let the Sun Go Down on Me (Live)", artist: "George Michael & Elton John", album: "Twenty Five", duration: "5:48", src: "/music/George Michael, Elton John - Don't Let The Sun Go Down On Me (Live).mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },

  // ── THE HAT — True Detective ─────────────────────────────────────────────
  // The Angry River — swamp, bayou, dark south, True Detective
  { id: "114", title: "The Angry River", artist: "The Hat", album: "True Detective OST",     duration: "2:56", src: "/music/The Angry River - The Hat ft. father John Misty (with lyrics).mp3",
    coverUrl: "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=400&q=80" },

  // ── LERA LYNN — True Detective ───────────────────────────────────────────
  // Lately — dimly lit bar, True Detective S2, dark noir
  { id: "115", title: "Lately",       artist: "Lera Lynn", album: "True Detective OST",       duration: "2:50", src: "/music/Lera Lynn - Lately.mp3",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80" },

  // ── BILL WITHERS — Lovely Day ────────────────────────────────────────────
  // Lovely Day — sunshine, blue sky, joy
  { id: "116", title: "Lovely Day",   artist: "Bill Withers", album: "Menagerie",             duration: "4:15", src: "/music/Bill Withers - Lovely Day (Official Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },

  // ── HANS ZIMMER — Why Do We Fall ────────────────────────────────────────
  // Why Do We Fall? — Batman Rises, standing back up, determination
  { id: "117", title: "Why Do We Fall?", artist: "Hans Zimmer", album: "The Dark Knight Rises OST", duration: "2:07", src: "/music/The Dark Knight Rises Official Soundtrack ｜ Why Do We Fall？ – Hans Zimmer ｜ WaterTower.mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── JAMES BAY ────────────────────────────────────────────────────────────
  // Hold Back the River — river, current, letting go
  { id: "118", title: "Hold Back the River", artist: "James Bay", album: "Chaos and the Calm", duration: "3:59", src: "/music/James Bay - Hold Back The River.mp3",
    coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },

  // ── SCORPIONS ────────────────────────────────────────────────────────────
  // Wind of Change — Berlin Wall, freedom, whistling wind
  { id: "119", title: "Wind of Change", artist: "Scorpions", album: "Crazy World",           duration: "5:13", src: "/music/Scorpions - Wind Of Change (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80" },

  // ── AEROSMITH ────────────────────────────────────────────────────────────
  // I Don't Want to Miss a Thing — Armageddon, space, asteroid, love
  { id: "120", title: "I Don't Want to Miss a Thing", artist: "Aerosmith", album: "Armageddon OST", duration: "4:59", src: "/music/I Don't Want to Miss a Thing - Aerosmith.mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },

  // ── JOHN NEWMAN ──────────────────────────────────────────────────────────
  // Love Me Again — soulful R&B, raw emotion, heartbreak
  { id: "121", title: "Love Me Again", artist: "John Newman", album: "Tribute",              duration: "4:00", src: "/music/John Newman - Love Me Again.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },

  // ── JOHN POWELL — Bourne ─────────────────────────────────────────────────
  // Treadstone Assassins — spy thriller, dark corridor, suspense
  { id: "122", title: "Treadstone Assassins", artist: "John Powell", album: "The Bourne Identity OST", duration: "2:13", src: "/music/Treadstone Assassins.mp3",
    coverUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=400&q=80" },

  // ── EAGLE-EYE CHERRY ─────────────────────────────────────────────────────
  // Save Tonight — last night together, fire, candle burning down
  { id: "123", title: "Save Tonight", artist: "Eagle-Eye Cherry", album: "Desireless",       duration: "4:01", src: "/music/Eagle-Eye Cherry - Save Tonight.mp3",
    coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80" },

  // ── GUIDED BY VOICES ─────────────────────────────────────────────────────
  // Hold on Hope — indie rock, holding on, hopeful
  { id: "124", title: "Hold on Hope", artist: "Guided By Voices", album: "Do The Collapse",  duration: "3:32", src: "/music/Hold On Hope.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&q=80" },

  // ── ONEREPUBLIC — Need Your Love ─────────────────────────────────────────
  // Need Your Love — longing, reaching out
  { id: "125", title: "Need Your Love", artist: "OneRepublic", album: "Need Your Love",      duration: "3:59", src: "/music/OneRepublic - Need Your Love (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80" },

  // ── ROYA ─────────────────────────────────────────────────────────────────
  // Cruise (Extended) — smooth sailing, open water, live session
  { id: "126", title: "Cruise (Extended)", artist: "ROYA", album: "Cruise Extended",         duration: "3:32", src: "/music/ROYA - Cruise (Extended Version) - LIVE SESSION.mp3",
    coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },

  // ── ASTRALITY ────────────────────────────────────────────────────────────
  // Can't Go Back — no turning back, road disappearing
  { id: "127", title: "Can't Go Back", artist: "Astrality", album: "Can't Go Back",          duration: "2:36", src: "/music/Astrality & James French - Can't Go Back.mp3",
    coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80" },

  // ── TESTPILOT1 ───────────────────────────────────────────────────────────
  // Never Did — introspective, quiet regret
  { id: "128", title: "Never Did",    artist: "testpilot1", album: "Never Did",              duration: "4:35", src: "/music/Never Did.mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80" },

  // ── DANNYHO ──────────────────────────────────────────────────────────────
  // One Last Waltz — Minecraft EDM, farewell dance, bittersweet
  { id: "129", title: "One Last Waltz", artist: "DannyHO", album: "Afterglow",               duration: "5:08", src: "/music/One Last Waltz – DannyHO ｜ Minecraft-Style EDM Visual ｜ Afterglow (Track 07).mp3",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },

  // ── IMAGINE DRAGONS ──────────────────────────────────────────────────────
  // Shots — explosive energy, imagine dragons arena rock
  { id: "130", title: "Shots (Broiler Remix)", artist: "Imagine Dragons", album: "Shots EP", duration: "3:12", src: "/music/Imagine Dragons - Shots (Broiler Remix) ft. Broiler.mp3",
    coverUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80" },

  // ── ALL THINGS BREAK ─────────────────────────────────────────────────────
  // magnetic magnetic — dark electronic, pulling force, minimalist
  { id: "131", title: "magnetic magnetic", artist: "all things break", album: "magnetic magnetic", duration: "2:12", src: "/music/all things break - magnetic magnetic.mp3",
    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80" },

  // ── DANNYHO — Against the Tide ───────────────────────────────────────────
  // Against the Tide — fighting current, ocean waves
  { id: "132", title: "Against the Tide", artist: "DannyHO", album: "Afterglow",             duration: "4:32", src: "/music/Against the Tide – DannyHO ｜ Minecraft-Style EDM Visual ｜ Afterglow (Track 04).mp3",
    coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=80" },

  // ── DUA LIPA ─────────────────────────────────────────────────────────────
  // Levitating — space disco, floating, retro-futuristic
  { id: "150", title: "Levitating",   artist: "Dua Lipa", album: "Future Nostalgia",         duration: "3:23", src: "/music/Dua Lipa - Levitating Featuring DaBaby (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },

  // ── THE WEEKND ───────────────────────────────────────────────────────────
  // Blinding Lights — neon city, After Hours red aesthetic, night drive
  { id: "151", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours",         duration: "3:20", src: "/music/The Weeknd - Blinding Lights (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },
];

const byIds = (...ids: string[]) => ALL_TRACKS.filter(t => ids.includes(t.id));
export const PLAYLISTS: Playlist[] = [
  {
    id: "coldplay",
    name: "Coldplay",
    description: "Every Coldplay track in the collection",
    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80",
    tracks: byIds("1","2","5","10","16","17","18","19"),
  },
];
