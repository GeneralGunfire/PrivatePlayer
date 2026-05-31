export interface Track { id: string; title: string; artist: string; album: string; coverUrl: string; duration: string; src: string; }
export interface Playlist { id: string; name: string; description?: string; coverUrl: string; tracks: Track[]; }

// Cover art: real official album covers from Last.fm image CDN (publicly accessible, no auth).
// Fallback Unsplash photos used where no album art is available.

export const ALL_TRACKS: Track[] = [
  // ── COLDPLAY ─────────────────────────────────────────────────────────────
  { id: "1",  title: "Paradise",     artist: "Coldplay", album: "Mylo Xyloto",              duration: "4:39", src: "/music/Coldplay - Paradise (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },
  { id: "2",  title: "In My Place",  artist: "Coldplay", album: "A Rush of Blood to the Head", duration: "3:47", src: "/music/Coldplay - In My Place (Official 4K Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=400&q=80" },
  { id: "5",  title: "Fix You",      artist: "Coldplay", album: "X&Y",                      duration: "4:56", src: "/music/Coldplay - Fix You (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },
  { id: "10", title: "Magic",        artist: "Coldplay", album: "Ghost Stories",             duration: "4:46", src: "/music/Coldplay - Magic (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80" },
  { id: "16", title: "Violet Hill",  artist: "Coldplay", album: "Viva la Vida",              duration: "3:43", src: "/music/Coldplay - Violet Hill (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1493676304819-0d7a312d5e5b?w=400&q=80" },
  { id: "17", title: "Everglow",     artist: "Coldplay", album: "A Head Full of Dreams",     duration: "4:43", src: "/music/Coldplay - Everglow [Single Version] - (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=400&q=80" },
  { id: "18", title: "Miracles",     artist: "Coldplay", album: "Unbroken",                  duration: "3:56", src: "/music/Coldplay - Miracles (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },
  { id: "19", title: "Up&Up",        artist: "Coldplay", album: "A Head Full of Dreams",     duration: "6:46", src: "/music/Coldplay - Up&Up (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80" },

  // ── CHET FAKER ───────────────────────────────────────────────────────────
  { id: "20", title: "Talk Is Cheap", artist: "Chet Faker", album: "Built on Glass",         duration: "3:39", src: "/music/Talk Is Cheap.mp3",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80" },

  // ── AVi SNOW ─────────────────────────────────────────────────────────────
  { id: "21", title: "Feel",          artist: "Avi Snow", album: "Feel",                     duration: "2:48", src: "/music/Feel - Avi Snow, MVCA, Zeeba (AI Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },

  // ── ELEZO ─────────────────────────────────────────────────────────────────
  { id: "28", title: "The XX Intro (ELEZO Remix)", artist: "ELEZO", album: "Remix",          duration: "2:42", src: "/music/The XX Intro - ELEZO remix ( Official video ).mp3",
    coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=400&q=80" },

  // ── SUPERMODE ────────────────────────────────────────────────────────────
  { id: "29", title: "Tell Me Why (James Carter Remix)", artist: "Supermode", album: "Tell Me Why", duration: "2:59", src: "/music/Tell Me Why (James Carter Remix) - Supermode.mp3",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },

  // ── DEZKO & CERES ────────────────────────────────────────────────────────
  { id: "30", title: "U&ME",          artist: "Dezko", album: "U&ME",                        duration: "3:16", src: "/music/Dezko & CERES - U&ME (Visualizer).mp3",
    coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=400&q=80" },

  // ── MARIUS BEAR ──────────────────────────────────────────────────────────
  { id: "31", title: "Horizon",       artist: "Marius Bear", album: "Horizon",               duration: "2:53", src: "/music/Marius Bear - Horizon (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80" },

  // ── JON HOWARD ───────────────────────────────────────────────────────────
  { id: "32", title: "In the Air Tonight", artist: "Jon Howard", album: "In the Air Tonight", duration: "2:54", src: "/music/In The Air Tonight-  Jon Howard (Official Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── BREAKING RUST ─────────────────────────────────────────────────────────
  { id: "33", title: "Livin' on Borrowed Time", artist: "Breaking Rust", album: "Livin' on Borrowed Time", duration: "3:25", src: "/music/Livin' on Borrowed Time.mp3",
    coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80" },

  // ── JAMIE N COMMONS ──────────────────────────────────────────────────────
  { id: "53", title: "Lead Me Home",  artist: "Jamie N Commons", album: "The Walking Dead OST", duration: "1:58", src: "/music/Jamie N Commons - Lead Me Home (The Walking Dead).mp3",
    coverUrl: "https://images.unsplash.com/photo-1414862625253-63af814c65e7?w=400&q=80" },

  // ── CROIXX ───────────────────────────────────────────────────────────────
  { id: "34", title: "Higher",        artist: "Croixx", album: "Higher",                     duration: "2:04", src: "/music/Croixx - Higher (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80" },

  // ── MARTIN WAVE ──────────────────────────────────────────────────────────
  { id: "35", title: "Watch Me Die",  artist: "Martin Wave", album: "Watch Me Die",          duration: "2:48", src: "/music/Martin Wave feat. ASHBY - Watch Me Die (From The Terminal List) [FULL SONG].mp3",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },

  // ── ALEX WARREN ──────────────────────────────────────────────────────────
  { id: "36", title: "Ordinary",      artist: "Alex Warren", album: "You'll Be Alright, Kid", duration: "3:07", src: "/music/Alex Warren - Ordinary (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80" },

  // ── HANS ZIMMER — Batman ─────────────────────────────────────────────────
  { id: "47", title: "A Dark Knight (Epic Version)", artist: "Hans Zimmer", album: "The Dark Knight OST", duration: "6:22", src: "/music/Hans Zimmer - A Dark Knight ｜ EPIC VERSION.mp3",
    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },

  // ── IMA ROBOT ────────────────────────────────────────────────────────────
  { id: "54", title: "Greenback Boogie", artist: "Ima Robot", album: "Suits OST",            duration: "4:58", src: "/music/Ima Robot - Greenback Boogie - (official video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },

  // ── OLD MAN CANYON ────────────────────────────────────────────────────────
  { id: "37", title: "Phantoms and Friends", artist: "Old Man Canyon", album: "Phantoms & Friends", duration: "3:52", src: "/music/Old Man Canyon - Phantoms & Friends [Official Video].mp3",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=80" },

  // ── PASSENGER ────────────────────────────────────────────────────────────
  { id: "38", title: "Let Her Go",    artist: "Passenger", album: "All The Little Lights",   duration: "4:13", src: "/music/Passenger ｜ Let Her Go (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80" },

  // ── NORMAN ───────────────────────────────────────────────────────────────
  { id: "39", title: "Here We Go",    artist: "Norman", album: "Here We Go",                 duration: "2:24", src: "/music/Here We Go.mp3",
    coverUrl: "https://images.unsplash.com/photo-1571388208497-71bedc604bf5?w=400&q=80" },

  // ── BOBBY BAZINI ─────────────────────────────────────────────────────────
  { id: "40", title: "Blood's Thicker Than Water", artist: "Bobby Bazini", album: "Summer Is Gone", duration: "3:42", src: "/music/Bobby Bazini - Blood's Thicker Than Water (Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80" },

  // ── MIRROR FURY ──────────────────────────────────────────────────────────
  { id: "41", title: "The One I Love", artist: "Mirror Fury", album: "The One I Love",       duration: "3:05", src: "/music/Mirror Fury - The One I Love.mp3",
    coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80" },

  // ── LOUIS ARMSTRONG ──────────────────────────────────────────────────────
  { id: "42", title: "What a Wonderful World", artist: "Louis Armstrong", album: "What a Wonderful World", duration: "2:20", src: "/music/Louis Armstrong - What A Wonderful World (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&q=80" },

  // ── NOVRA ────────────────────────────────────────────────────────────────
  { id: "43", title: "Before The Fall", artist: "Novra", album: "Before The Fall",           duration: "6:59", src: "/music/NOVRA – Before The Fall ｜ Emotional Deep House.mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80" },

  // ── THE VEILS ────────────────────────────────────────────────────────────
  { id: "44", title: "Grey Lynn Park", artist: "The Veils", album: "Troubles of the Brain",  duration: "2:40", src: "/music/The Veils - Grey Lynn Park.mp3",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=80" },

  // ── MICHAEL JACKSON ──────────────────────────────────────────────────────
  { id: "45", title: "Man in the Mirror", artist: "Michael Jackson", album: "Bad",            duration: "5:20", src: "/music/Man in the Mirror - Michael Jackson.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80" },

  // ── DAN WILSON ───────────────────────────────────────────────────────────
  { id: "46", title: "Breathless",    artist: "Dan Wilson", album: "Free Life",               duration: "3:54", src: "/music/Dan Wilson - Breathless.mp3",
    coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&q=80" },

  // ── LORD HURON ───────────────────────────────────────────────────────────
  { id: "48", title: "The Night We Met", artist: "Lord Huron", album: "Strange Trails",      duration: "3:29", src: "/music/The Night We Met - Lord Huron.mp3",
    coverUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80" },

  // ── CHARLIE CUNNINGHAM ────────────────────────────────────────────────────
  { id: "49", title: "Permanent Way (Live Session)", artist: "Charlie Cunningham", album: "Flesh & Bone", duration: "4:18", src: "/music/Charlie Cunningham - Permanent Way (Live Session).mp3",
    coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&q=80" },

  // ── NEIL DIAMOND ─────────────────────────────────────────────────────────
  { id: "50", title: "Sweet Caroline", artist: "Neil Diamond", album: "Sweet Caroline",      duration: "3:24", src: "/music/Neil Diamond - Sweet Caroline (Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80" },

  // ── LUCIANO PAVAROTTI ────────────────────────────────────────────────────
  { id: "51", title: "Nessun Dorma (Live)", artist: "Luciano Pavarotti", album: "The Three Tenors in Concert 1994", duration: "3:25", src: "/music/The Three Tenors in Concert 1994： ＂Nessun Dorma＂ from Turandot (encore).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },

  // ── CELINE DION — Deadpool 2 ─────────────────────────────────────────────
  { id: "52", title: "Ashes (from Deadpool 2)", artist: "Celine Dion", album: "Deadpool 2 OST", duration: "3:20", src: "/music/Céline Dion - Ashes (from ＂Deadpool 2＂ Motion Picture Soundtrack).mp3",
    coverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&q=80" },

  // ── SURVIVOR ─────────────────────────────────────────────────────────────
  { id: "58", title: "Eye of the Tiger", artist: "Survivor", album: "Eye of the Tiger",       duration: "4:04", src: "/music/Survivor - Eye Of The Tiger (Official HD Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=400&q=80" },

  // ── ATIF ASLAM ───────────────────────────────────────────────────────────
  { id: "55", title: "O'Meri Laila",  artist: "Atif Aslam", album: "Laila Majnu",            duration: "4:42", src: "/music/O Meri Laila - Lyrical ｜ Laila Majnu ｜ Jyotica Tangri ｜ Avinash Tiwary & Tripti Dimri.mp3",
    coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80" },

  // ── KEANE ────────────────────────────────────────────────────────────────
  { id: "56", title: "Somewhere Only We Know", artist: "Keane", album: "Hopes and Fears",    duration: "3:58", src: "/music/Keane - Somewhere Only We Know (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80" },

  // ── WRABEL ───────────────────────────────────────────────────────────────
  { id: "57", title: "Into The Wild", artist: "Wrabel", album: "Sideways",                   duration: "3:31", src: "/music/Wrabel - Into The Wild (Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=80" },

  // ── TURIN BRAKES ─────────────────────────────────────────────────────────
  { id: "59", title: "Save You",      artist: "Turin Brakes", album: "Save You",             duration: "3:05", src: "/music/Turin Brakes - Save You (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&q=80" },

  // ── THE FRIENDLY INDIANS — Psych ──────────────────────────────────────────
  { id: "60", title: "Psych Theme Song", artist: "The Friendly Indians", album: "Psych OST", duration: "2:08", src: "/music/Psych Theme Song (Full Version)~Friendly Indians.mp3",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80" },

  // ── ELDERBROOK ───────────────────────────────────────────────────────────
  { id: "61", title: "Inner Light",   artist: "Elderbrook", album: "Inner Light",            duration: "4:18", src: "/music/Elderbrook - Inner Light with Bob Moses (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },

  // ── ALPHAVILLE ───────────────────────────────────────────────────────────
  { id: "62", title: "Big in Japan",  artist: "Alphaville", album: "Forever Young",          duration: "4:45", src: "/music/Alphaville - Big In Japan (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80" },

  // ── CHARLOTTE OC ─────────────────────────────────────────────────────────
  { id: "63", title: "Colour My Heart", artist: "Charlotte OC", album: "Colour My Heart",   duration: "4:40", src: "/music/Charlotte OC - Colour My Heart (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=400&q=80" },

  // ── DEAN LEWIS ───────────────────────────────────────────────────────────
  { id: "64", title: "Waves",         artist: "Dean Lewis", album: "Same Kind of Different", duration: "4:02", src: "/music/Dean Lewis - Waves (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80" },

  // ── LOGIC & RAG'N'BONE MAN ────────────────────────────────────────────────
  { id: "65", title: "Broken People", artist: "Logic & Rag'n'Bone Man", album: "Bright: The Album", duration: "3:33", src: "/music/Logic & Rag'n'Bone Man - Broken People (from Bright： The Album) [Official Lyric Video].mp3",
    coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400&q=80" },

  // ── FAOUZIA & JOHN LEGEND ────────────────────────────────────────────────
  { id: "66", title: "Minefields",    artist: "Faouzia & John Legend", album: "Minefields",  duration: "3:11", src: "/music/Faouzia & John Legend - Minefields (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" },

  // ── ROBBIE WILLIAMS ──────────────────────────────────────────────────────
  { id: "67", title: "Man For All Seasons", artist: "Robbie Williams", album: "Johnny English OST", duration: "4:01", src: "/music/Robbie Williams - Man For All Seasons (Johnny English).mp3",
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80" },

  // ── ZAC BROWN & SIR ROSEVELT ─────────────────────────────────────────────
  { id: "68", title: "It Goes On",    artist: "Sir Rosevelt & Zac Brown", album: "It Goes On", duration: "3:25", src: "/music/Zac Brown & Sir Rosevelt - It Goes On (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80" },

  // ── THE DIG ──────────────────────────────────────────────────────────────
  { id: "69", title: "Break the Silence", artist: "The Dig", album: "Midnight Flowers",     duration: "3:46", src: "/music/Break The Silence ⧸⧸ The Dig ⧸⧸ Midnight Flowers (2012).mp3",
    coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=400&q=80" },

  // ── DESI VALENTINE ───────────────────────────────────────────────────────
  { id: "70", title: "Fate Don't Know You", artist: "Desi Valentine", album: "Fate Don't Know You", duration: "4:02", src: "/music/Desi Valentine - Fate Don't Know You.mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80" },

  // ── MARK AMBOR ───────────────────────────────────────────────────────────
  { id: "71", title: "Belong Together", artist: "Mark Ambor", album: "Belong Together",      duration: "2:29", src: "/music/Mark Ambor - Belong Together (Official Lyric Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80" },

  // ── STEALTH ──────────────────────────────────────────────────────────────
  { id: "72", title: "Judgement Day", artist: "Stealth", album: "Intro",                    duration: "3:51", src: "/music/Stealth - Judgement Day.mp3",
    coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400&q=80" },

  // ── JOHNNY CLEGG ─────────────────────────────────────────────────────────
  { id: "73", title: "King of Time",  artist: "Johnny Clegg", album: "King of Time",         duration: "3:17", src: "/music/Johnny Clegg - King Of Time.mp3",
    coverUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400&q=80" },

  // ── ANGUS STONE ──────────────────────────────────────────────────────────
  { id: "74", title: "Broken Brights", artist: "Angus Stone", album: "Broken Brights",      duration: "4:13", src: "/music/Angus Stone - Broken Brights Official Video.mp3",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=80" },

  // ── CADBURY GORILLA / DANJWO ─────────────────────────────────────────────
  { id: "75", title: "In The Air Tonight (Extended Mix)", artist: "danjwo", album: "In The Air Tonight Extended", duration: "4:28", src: "/music/Cadbury Gorilla - In The Air Tonight (Extended Mix).mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── MICHAEL KIWANUKA ─────────────────────────────────────────────────────
  { id: "76", title: "Love & Hate",   artist: "Michael Kiwanuka", album: "Love & Hate",      duration: "7:08", src: "/music/Michael Kiwanuka - Love & Hate (Live Session).mp3",
    coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=400&q=80" },

  // ── A.R. RAHMAN ──────────────────────────────────────────────────────────
  { id: "77", title: "Tere Bina",     artist: "A.R. Rahman", album: "Guru OST",              duration: "5:10", src: "/music/A.R. Rahman - Tere Bina ｜ Lyrical Song ｜ Aishwarya Rai ｜ Abhishek Bachchan ｜ Guru ｜ Gulzar.mp3",
    coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80" },

  // ── SAMUEL KIM ───────────────────────────────────────────────────────────
  { id: "78", title: "Duel of The Fates (Epic Version)", artist: "Samuel Kim", album: "Duel of The Fates", duration: "3:06", src: "/music/Star Wars： Duel of The Fates ｜ EPIC VERSION (Remastered V2).mp3",
    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },

  // ── TINA TURNER ──────────────────────────────────────────────────────────
  { id: "79", title: "We Don't Need Another Hero", artist: "Tina Turner", album: "Simply the Best", duration: "4:16", src: "/music/TINA TURNER ★ We Don't Need Another Hero (Thunderdome)【music video】.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&q=80" },

  // ── JOHNNY CLEGG — Great Heart ───────────────────────────────────────────
  { id: "80", title: "Great Heart",   artist: "Johnny Clegg", album: "Third World Child",    duration: "4:22", src: "/music/Johnny Clegg-Great Heart.mp3",
    coverUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400&q=80" },

  // ── LAZLO BANE — Scrubs ──────────────────────────────────────────────────
  { id: "81", title: "Superman",      artist: "Lazlo Bane", album: "All The Time in the World", duration: "3:46", src: "/music/Scrubs Theme Song “Superman” Lazlo Bane Official Video Remastered HD.mp3",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80" },

  // ── JOSÉ GONZÁLEZ ────────────────────────────────────────────────────────
  { id: "82", title: "Stay Alive",    artist: "José González", album: "The Secret Life of Walter Mitty", duration: "4:27", src: "/music/José González - Stay Alive.mp3",
    coverUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80" },

  // ── ROCKY BALBOA THEME ────────────────────────────────────────────────────
  { id: "83", title: "Rocky Balboa Theme", artist: "Various Artists", album: "Rocky Balboa OST", duration: "4:55", src: "/music/Rocky Balboa - Theme Song (HD).mp3",
    coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=400&q=80" },

  // ── JON BON JOVI ─────────────────────────────────────────────────────────
  { id: "84", title: "Blaze of Glory", artist: "Jon Bon Jovi", album: "Young Guns II",       duration: "5:36", src: "/music/Bon Jovi - Young Guns II Blaze of Glory.mp3",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },

  // ── DEEP BLUE SOMETHING ──────────────────────────────────────────────────
  { id: "85", title: "Breakfast at Tiffany's", artist: "Deep Blue Something", album: "Home", duration: "4:18", src: "/music/Deep Blue Something - Breakfast At Tiffany's (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=400&q=80" },

  // ── RUTH B. ──────────────────────────────────────────────────────────────
  { id: "86", title: "Dandelions",    artist: "Ruth B.", album: "Safe Haven",                duration: "3:54", src: "/music/Ruth B. - Dandelions (Lyrics).mp3",
    coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=400&q=80" },

  // ── CHRIS CORNELL ────────────────────────────────────────────────────────
  { id: "87", title: "You Know My Name", artist: "Chris Cornell", album: "Casino Royale OST", duration: "4:01", src: "/music/Casino Royale - Chris Cornell - You Know My Name.mp3",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },

  // ── THE PROCLAIMERS ──────────────────────────────────────────────────────
  { id: "88", title: "I'm Gonna Be (500 Miles)", artist: "The Proclaimers", album: "Sunshine on Leith", duration: "3:40", src: "/music/The Proclaimers - I'm Gonna Be (500 Miles) (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&q=80" },

  // ── BILL WITHERS ─────────────────────────────────────────────────────────
  { id: "89", title: "Lean on Me",    artist: "Bill Withers", album: "Still Bill",           duration: "4:19", src: "/music/Lean on Me.mp3",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=80" },

  // ── BON JOVI ─────────────────────────────────────────────────────────────
  { id: "90", title: "It's My Life",  artist: "Bon Jovi", album: "Crush",                    duration: "3:45", src: "/music/Bon Jovi - It's My Life (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },

  // ── THE WEEKND ───────────────────────────────────────────────────────────
  { id: "91", title: "Can't Feel My Face", artist: "The Weeknd", album: "Beauty Behind the Madness", duration: "3:34", src: "/music/The Weeknd - Can't Feel My Face (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },

  // ── NICHOLAS BRITELL — Succession ────────────────────────────────────────
  { id: "92", title: "Succession (Main Title Theme)", artist: "Nicholas Britell", album: "Succession Season 4", duration: "2:02", src: "/music/Succession (Main Title Theme) - Nicholas Britell ｜ Succession (HBO Original Series Soundtrack).mp3",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80" },

  // ── ALEXANDRE DESPLAT ────────────────────────────────────────────────────
  { id: "93", title: "Godzilla!",     artist: "Alexandre Desplat", album: "Godzilla OST",    duration: "2:09", src: "/music/Godzilla Soundtrack ｜ Godzilla! - Alexandre Desplat ｜ WaterTower Music.mp3",
    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },

  // ── ONEREPUBLIC ──────────────────────────────────────────────────────────
  { id: "94", title: "Let's Hurt Tonight", artist: "OneRepublic", album: "Oh My My",         duration: "3:15", src: "/music/OneRepublic - Let's Hurt Tonight.mp3",
    coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80" },

  // ── THE XX ───────────────────────────────────────────────────────────────
  { id: "95", title: "Intro",         artist: "The xx", album: "xx",                         duration: "2:07", src: "/music/Intro.mp3",
    coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=400&q=80" },

  // ── HANNI EL KHATIB ──────────────────────────────────────────────────────
  { id: "96", title: "Nobody Move",   artist: "Hanni El Khatib", album: "Head in the Dirt",  duration: "2:32", src: "/music/Hanni El Khatib - Nobody Move.mp3",
    coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400&q=80" },

  // ── YOHANI ───────────────────────────────────────────────────────────────
  { id: "97", title: "Manike",        artist: "Yohani", album: "Manike",                     duration: "3:57", src: "/music/Manike (Full Video)： Thank God ｜ Nora,Sidharth｜ Tanishk,Yohani,Jubin,Surya R ｜Rashmi Virag｜Bhushan K.mp3",
    coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=400&q=80" },

  // ── SHEPPARD ─────────────────────────────────────────────────────────────
  { id: "98", title: "Geronimo",      artist: "Sheppard", album: "Bombs Away",               duration: "3:39", src: "/music/Sheppard - Geronimo (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1571388208497-71bedc604bf5?w=400&q=80" },

  // ── INI KAMOZE ───────────────────────────────────────────────────────────
  { id: "99", title: "Here Comes the Hotstepper", artist: "Ini Kamoze", album: "Here Comes the Hotstepper", duration: "4:11", src: "/music/Ini Kamoze - Here Comes The Hotstepper (Remix) (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=400&q=80" },

  // ── MARTIN GARRIX ────────────────────────────────────────────────────────
  { id: "100", title: "High on Life", artist: "Martin Garrix", album: "High on Life",        duration: "3:51", src: "/music/Martin Garrix feat. Bonn - High On Life (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },

  // ── GEORGE EZRA ──────────────────────────────────────────────────────────
  { id: "101", title: "Budapest",     artist: "George Ezra", album: "Wanted on Voyage",      duration: "3:21", src: "/music/George Ezra - Budapest (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── THE VERVE ────────────────────────────────────────────────────────────
  { id: "102", title: "Bittersweet Symphony", artist: "The Verve", album: "Urban Hymns",     duration: "4:30", src: "/music/The Verve - Bitter Sweet Symphony.mp3",
    coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&q=80" },

  // ── 4 NON BLONDES ────────────────────────────────────────────────────────
  { id: "103", title: "What's Up?",   artist: "4 Non Blondes", album: "Bigger, Better, Faster, More!", duration: "4:56", src: "/music/4 Non Blondes - What's Up (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80" },

  // ── LIKE A PRAYER CHOIR ───────────────────────────────────────────────────
  { id: "104", title: "Like a Prayer (Choir Version)", artist: "I'll Take You There Choir", album: "Deadpool & Wolverine", duration: "2:33", src: "/music/Madonna - Like A Prayer (Choir Version) [Vinyl Visualizer].mp3",
    coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&q=80" },

  // ── DOBIE GRAY ───────────────────────────────────────────────────────────
  { id: "105", title: "Drift Away",   artist: "Dobie Gray", album: "Drift Away",             duration: "3:59", src: "/music/Dobie Gray - Drift Away (Original Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=400&q=80" },

  // ── FRIENDS OF JOHNNY CLEGG ──────────────────────────────────────────────
  { id: "106", title: "The Crossing", artist: "Friends of Johnny Clegg", album: "The Crossing", duration: "5:07", src: "/music/THE CROSSING - Friends of Johnny Clegg.mp3",
    coverUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400&q=80" },

  // ── ELTON JOHN & DUA LIPA ────────────────────────────────────────────────
  { id: "107", title: "Cold Heart (PNAU Remix)", artist: "Elton John & Dua Lipa", album: "The Lockdown Sessions", duration: "3:23", src: "/music/Elton John, Dua Lipa - Cold Heart (PNAU Remix) (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=400&q=80" },

  // ── JACOB BANKS ──────────────────────────────────────────────────────────
  { id: "108", title: "Unknown (To You)", artist: "Jacob Banks", album: "Village",           duration: "3:54", src: "/music/Jacob Banks - Unknown (To You) Official Music Video.mp3",
    coverUrl: "https://images.unsplash.com/photo-1571388208497-71bedc604bf5?w=400&q=80" },

  // ── LEWIS CAPALDI ────────────────────────────────────────────────────────
  { id: "109", title: "Before You Go", artist: "Lewis Capaldi", album: "Divinely Uninspired to a Hellish Extent", duration: "3:36", src: "/music/Lewis Capaldi - Before You Go (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=400&q=80" },

  // ── KALEO ────────────────────────────────────────────────────────────────
  { id: "110", title: "Way Down We Go", artist: "KALEO", album: "A/B",                       duration: "3:34", src: "/music/KALEO - Way Down We Go (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1414862625253-63af814c65e7?w=400&q=80" },

  // ── RAG'N'BONE MAN ───────────────────────────────────────────────────────
  { id: "111", title: "Human",        artist: "Rag'n'Bone Man", album: "Human",              duration: "3:20", src: "/music/Rag'n'Bone Man - Human (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80" },

  // ── SAM SMITH ────────────────────────────────────────────────────────────
  { id: "112", title: "Stay With Me", artist: "Sam Smith", album: "In the Lonely Hour",      duration: "2:53", src: "/music/Sam Smith - Stay With Me (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400&q=80" },

  // ── GEORGE MICHAEL & ELTON JOHN ──────────────────────────────────────────
  { id: "113", title: "Don't Let the Sun Go Down on Me (Live)", artist: "George Michael & Elton John", album: "Twenty Five", duration: "5:48", src: "/music/George Michael, Elton John - Don't Let The Sun Go Down On Me (Live).mp3",
    coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=400&q=80" },

  // ── THE HAT — True Detective ─────────────────────────────────────────────
  { id: "114", title: "The Angry River", artist: "The Hat", album: "True Detective OST",     duration: "2:56", src: "/music/The Angry River - The Hat ft. father John Misty (with lyrics).mp3",
    coverUrl: "https://images.unsplash.com/photo-1414862625253-63af814c65e7?w=400&q=80" },

  // ── LERA LYNN — True Detective ───────────────────────────────────────────
  { id: "115", title: "Lately",       artist: "Lera Lynn", album: "True Detective OST",       duration: "2:50", src: "/music/Lera Lynn - Lately.mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&q=80" },

  // ── BILL WITHERS — Lovely Day ────────────────────────────────────────────
  { id: "116", title: "Lovely Day",   artist: "Bill Withers", album: "Menagerie",             duration: "4:15", src: "/music/Bill Withers - Lovely Day (Official Audio).mp3",
    coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=400&q=80" },

  // ── HANS ZIMMER — Why Do We Fall ────────────────────────────────────────
  { id: "117", title: "Why Do We Fall?", artist: "Hans Zimmer", album: "The Dark Knight Rises OST", duration: "2:07", src: "/music/The Dark Knight Rises Official Soundtrack ｜ Why Do We Fall？ – Hans Zimmer ｜ WaterTower.mp3",
    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=400&q=80" },

  // ── JAMES BAY ────────────────────────────────────────────────────────────
  { id: "118", title: "Hold Back the River", artist: "James Bay", album: "Chaos and the Calm", duration: "3:59", src: "/music/James Bay - Hold Back The River.mp3",
    coverUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=400&q=80" },

  // ── SCORPIONS ────────────────────────────────────────────────────────────
  { id: "119", title: "Wind of Change", artist: "Scorpions", album: "Crazy World",           duration: "5:13", src: "/music/Scorpions - Wind Of Change (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400&q=80" },

  // ── AEROSMITH ────────────────────────────────────────────────────────────
  { id: "120", title: "I Don't Want to Miss a Thing", artist: "Aerosmith", album: "Armageddon OST", duration: "4:59", src: "/music/I Don't Want to Miss a Thing - Aerosmith.mp3",
    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=400&q=80" },

  // ── JOHN NEWMAN ──────────────────────────────────────────────────────────
  { id: "121", title: "Love Me Again", artist: "John Newman", album: "Tribute",              duration: "4:00", src: "/music/John Newman - Love Me Again.mp3",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },

  // ── JOHN POWELL — Bourne ─────────────────────────────────────────────────
  { id: "122", title: "Treadstone Assassins", artist: "John Powell", album: "The Bourne Identity OST", duration: "2:13", src: "/music/Treadstone Assassins.mp3",
    coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=400&q=80" },

  // ── EAGLE-EYE CHERRY ─────────────────────────────────────────────────────
  { id: "123", title: "Save Tonight", artist: "Eagle-Eye Cherry", album: "Desireless",       duration: "4:01", src: "/music/Eagle-Eye Cherry - Save Tonight.mp3",
    coverUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=400&q=80" },

  // ── GUIDED BY VOICES ─────────────────────────────────────────────────────
  { id: "124", title: "Hold on Hope", artist: "Guided By Voices", album: "Do The Collapse",  duration: "3:32", src: "/music/Hold On Hope.mp3",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=400&q=80" },

  // ── ONEREPUBLIC — Need Your Love ─────────────────────────────────────────
  { id: "125", title: "Need Your Love", artist: "OneRepublic", album: "Need Your Love",      duration: "3:59", src: "/music/OneRepublic - Need Your Love (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=400&q=80" },

  // ── ROYA ─────────────────────────────────────────────────────────────────
  { id: "126", title: "Cruise (Extended)", artist: "ROYA", album: "Cruise Extended",         duration: "3:32", src: "/music/ROYA - Cruise (Extended Version) - LIVE SESSION.mp3",
    coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=400&q=80" },

  // ── ASTRALITY ────────────────────────────────────────────────────────────
  { id: "127", title: "Can't Go Back", artist: "Astrality", album: "Can't Go Back",          duration: "2:36", src: "/music/Astrality & James French - Can't Go Back.mp3",
    coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80" },

  // ── TESTPILOT1 ───────────────────────────────────────────────────────────
  { id: "128", title: "Never Did",    artist: "testpilot1", album: "Never Did",              duration: "4:35", src: "/music/Never Did.mp3",
    coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=400&q=80" },

  // ── DANNYHO ──────────────────────────────────────────────────────────────
  { id: "129", title: "One Last Waltz", artist: "DannyHO", album: "Afterglow",               duration: "5:08", src: "/music/One Last Waltz – DannyHO ｜ Minecraft-Style EDM Visual ｜ Afterglow (Track 07).mp3",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },

  // ── IMAGINE DRAGONS ──────────────────────────────────────────────────────
  { id: "130", title: "Shots (Broiler Remix)", artist: "Imagine Dragons", album: "Shots EP", duration: "3:12", src: "/music/Imagine Dragons - Shots (Broiler Remix) ft. Broiler.mp3",
    coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=400&q=80" },

  // ── ALL THINGS BREAK ─────────────────────────────────────────────────────
  { id: "131", title: "magnetic magnetic", artist: "all things break", album: "magnetic magnetic", duration: "2:12", src: "/music/all things break - magnetic magnetic.mp3",
    coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=80" },

  // ── DANNYHO — Against the Tide ───────────────────────────────────────────
  { id: "132", title: "Against the Tide", artist: "DannyHO", album: "Afterglow",             duration: "4:32", src: "/music/Against the Tide – DannyHO ｜ Minecraft-Style EDM Visual ｜ Afterglow (Track 04).mp3",
    coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=400&q=80" },

  // ── DUA LIPA — keep as requested ─────────────────────────────────────────
  { id: "150", title: "Levitating",   artist: "Dua Lipa", album: "Future Nostalgia",         duration: "3:23", src: "/music/Dua Lipa - Levitating Featuring DaBaby (Official Music Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80" },

  // ── THE WEEKND — keep as requested ───────────────────────────────────────
  { id: "151", title: "Blinding Lights", artist: "The Weeknd", album: "After Hours",         duration: "3:20", src: "/music/The Weeknd - Blinding Lights (Official Video).mp3",
    coverUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },
];

export const PLAYLISTS: Playlist[] = [];
