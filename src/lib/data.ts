export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  src: string;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl: string;
  tracks: Track[];
}

// ── All tracks ─────────────────────────────────────────────
export const ALL_TRACKS: Track[] = [
  // ── COLDPLAY ──────────────────────────────────────────────
  // Coldplay uses space/cosmic/colourful concert imagery — each unique
  { id: "1",   title: "Paradise",                     artist: "Coldplay",          album: "Mylo Xyloto",                      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",  duration: "4:38", src: "/music/Coldplay - Paradise (Official Video).mp3" },
  { id: "2",   title: "In My Place",                  artist: "Coldplay",          album: "A Rush of Blood to the Head",      coverUrl: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=80",  duration: "3:48", src: "/music/Coldplay - In My Place (Official 4K Video).mp3" },
  { id: "3",   title: "The Scientist",                artist: "Coldplay",          album: "A Rush of Blood to the Head",      coverUrl: "https://images.unsplash.com/photo-1464983953574-0892a716854b?w=800&q=80",  duration: "5:09", src: "/music/Coldplay - The Scientist (Official 4K Video).mp3" },
  { id: "4",   title: "Yellow",                       artist: "Coldplay",          album: "Parachutes",                       coverUrl: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&q=80",  duration: "4:29", src: "/music/Coldplay - Yellow (Official Video).mp3" },
  { id: "5",   title: "Fix You",                      artist: "Coldplay",          album: "X&Y",                              coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",  duration: "4:55", src: "/music/Coldplay - Fix You (Official Video).mp3" },
  { id: "6",   title: "Speed of Sound",               artist: "Coldplay",          album: "X&Y",                              coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",  duration: "4:48", src: "/music/Coldplay - Speed Of Sound (Official Video).mp3" },
  { id: "7",   title: "Clocks",                       artist: "Coldplay",          album: "A Rush of Blood to the Head",      coverUrl: "https://images.unsplash.com/photo-1518972734183-c4b97c4e1a32?w=800&q=80",  duration: "5:07", src: "/music/Coldplay - Clocks (Official Video).mp3" },
  { id: "8",   title: "Viva la Vida",                 artist: "Coldplay",          album: "Viva la Vida",                     coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",  duration: "4:01", src: "/music/Coldplay - Viva La Vida (Official Video).mp3" },
  { id: "9",   title: "A Sky Full of Stars",          artist: "Coldplay",          album: "Ghost Stories",                    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",  duration: "4:28", src: "/music/Coldplay - A Sky Full Of Stars (Official Video).mp3" },
  { id: "10",  title: "Magic",                        artist: "Coldplay",          album: "Ghost Stories",                    coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",  duration: "4:46", src: "/music/Coldplay - Magic (Official Video).mp3" },
  { id: "11",  title: "The Hardest Part",             artist: "Coldplay",          album: "X&Y",                              coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80",  duration: "4:25", src: "/music/Coldplay - The Hardest Part (Official Video).mp3" },
  { id: "12",  title: "Shiver",                       artist: "Coldplay",          album: "Parachutes",                       coverUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",  duration: "5:00", src: "/music/Coldplay - Shiver (Official Video).mp3" },
  { id: "13",  title: "Trouble",                      artist: "Coldplay",          album: "Parachutes",                       coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80",  duration: "4:30", src: "/music/Coldplay - Trouble (Official video).mp3" },
  { id: "14",  title: "Every Teardrop Is a Waterfall",artist: "Coldplay",          album: "Mylo Xyloto",                      coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",  duration: "4:00", src: "/music/Coldplay - Every Teardrop Is a Waterfall (Official Video).mp3" },
  { id: "15",  title: "Charlie Brown",                artist: "Coldplay",          album: "Mylo Xyloto",                      coverUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&q=80",  duration: "4:42", src: "/music/Coldplay - Charlie Brown (Official Video).mp3" },
  { id: "16",  title: "Violet Hill",                 artist: "Coldplay",          album: "Viva la Vida",                     coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",  duration: "3:43", src: "/music/Violet Hill - Coldplay.mp3" },
  { id: "17",  title: "Everglow",                    artist: "Coldplay",          album: "A Head Full of Dreams",            coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",  duration: "4:43", src: "/music/Everglow - Coldplay.mp3" },
  { id: "18",  title: "Miracles",                    artist: "Coldplay",          album: "Unbroken",                         coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",  duration: "3:56", src: "/music/Miracles - Coldplay.mp3" },
  { id: "19",  title: "Up&Up",                       artist: "Coldplay",          album: "A Head Full of Dreams",            coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80",  duration: "6:46", src: "/music/Up&Up - Coldplay.mp3" },

  // ── INSTRUMENTALS ─────────────────────────────────────────
  // Each gets its own mood-matching image
  { id: "20",  title: "Talk Is Cheap",                artist: "Chet Faker",        album: "Built on Glass",                   coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&q=80",  duration: "4:50", src: "/music/Talk Is Cheap.mp3" },
  { id: "21",  title: "Experience",                   artist: "Ludovico Einaudi",  album: "In a Time Lapse",                  coverUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80",  duration: "5:13", src: "/music/Ludovico Einaudi - Experience (Live from Teatro dal Verme, Milano).mp3" },
  { id: "22",  title: "Nuvole Bianche",               artist: "Ludovico Einaudi",  album: "Una Mattina",                      coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",  duration: "5:57", src: "/music/Ludovico Einaudi - Nuvole Bianche (Live From The Steve Jobs Theatre ⧸ 2019).mp3" },
  { id: "23",  title: "Divenire",                     artist: "Ludovico Einaudi",  album: "Divenire",                         coverUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",  duration: "7:14", src: "/music/Ludovico Einaudi - Divenire (Live from The Royal Albert Hall London ⧸ 2010).mp3" },
  { id: "24",  title: "Gymnopédie No.1",              artist: "Erik Satie",        album: "Gymnopédies",                      coverUrl: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80",  duration: "3:00", src: "/music/Erik Satie - Gymnopédie No.1.mp3" },
  { id: "25",  title: "Comptine d'un autre été",      artist: "Yann Tiersen",      album: "Amélie OST",                       coverUrl: "https://images.unsplash.com/photo-1473177104440-ffee2f376098?w=800&q=80",  duration: "2:22", src: "/music/Comptine d'un autre été, l'après-midi.mp3" },
  { id: "26",  title: "River Flows in You",           artist: "Yiruma",            album: "First Love",                       coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",  duration: "3:32", src: "/music/Yiruma, (이루마) - River Flows in You.mp3" },
  { id: "27",  title: "Clair de Lune",                artist: "Claude Debussy",    album: "Suite bergamasque",                coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",  duration: "5:30", src: "/music/CLAUDE DEBUSSY：  CLAIR DE LUNE.mp3" },
  { id: "28",  title: "The XX Intro (ELEZO Remix)",  artist: "ELEZO",             album: "Remix",                            coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=800&q=80",  duration: "2:42", src: "/music/The XX Intro - ELEZO Remix.mp3" },
  { id: "29",  title: "Duel of the Fates (Epic)",    artist: "Samuel Kim",        album: "Duel of The Fates",                coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",  duration: "3:06", src: "/music/Duel of The Fates - Epic Version.mp3" },

  // ── MOVIES ────────────────────────────────────────────────
  { id: "40",  title: "Time",                         artist: "Hans Zimmer",       album: "Inception OST",                    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",  duration: "4:35", src: "/music/Hans Zimmer - Time (Inception).mp3" },
  { id: "41",  title: "Now We Are Free",              artist: "Hans Zimmer",       album: "Gladiator OST",                    coverUrl: "https://images.unsplash.com/photo-1509515837298-2c67a3933321?w=800&q=80",  duration: "4:41", src: "/music/Gladiator • Now We Are Free • Hans Zimmer & Lisa Gerrard.mp3" },
  { id: "42",  title: "Interstellar Main Theme",      artist: "Hans Zimmer",       album: "Interstellar OST",                 coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80",  duration: "4:02", src: "/music/Interstellar Main Theme - Hans Zimmer.mp3" },
  { id: "43",  title: "My Heart Will Go On",          artist: "Celine Dion",       album: "Titanic OST",                      coverUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80",  duration: "4:41", src: "/music/Céline Dion - My Heart Will Go On (Official 25th Anniversary Alternate Music Video).mp3" },
  { id: "44",  title: "The Godfather Waltz",          artist: "Nino Rota",         album: "The Godfather OST",                coverUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80",  duration: "3:14", src: "/music/The Godfather Waltz.mp3" },
  { id: "45",  title: "Requiem for a Dream",          artist: "Clint Mansell",     album: "Requiem for a Dream OST",          coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80",  duration: "2:30", src: "/music/Requiem For A Dream Full Song HD.mp3" },
  { id: "46",  title: "Pirates of the Caribbean",     artist: "Klaus Badelt",      album: "Pirates of the Caribbean OST",     coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",  duration: "2:37", src: "/music/＂Suite＂ - Pirates of the Caribbean (Klaus Badelt) - Film Symphony Orchestra.mp3" },

  // ── CALM ──────────────────────────────────────────────────
  { id: "60",  title: "Holocene",                     artist: "Bon Iver",          album: "Bon Iver",                         coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80",  duration: "5:37", src: "/music/Bon Iver - Holocene - Official Video.mp3" },
  { id: "61",  title: "Skinny Love",                  artist: "Bon Iver",          album: "For Emma, Forever Ago",            coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",  duration: "3:58", src: "/music/Skinny Love.mp3" },
  { id: "62",  title: "Breathe (2 AM)",               artist: "Anna Nalick",       album: "Wreck of the Day",                 coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",  duration: "4:25", src: "/music/Anna Nalick - Breathe (2 AM) (Official Video).mp3" },
  { id: "63",  title: "The Night Will Always Win",    artist: "Manchester Orchestra",album: "Cope",                           coverUrl: "https://images.unsplash.com/photo-1414862625253-63af814c65e7?w=800&q=80",  duration: "4:18", src: "/music/The Night Will Always Win - Manchester Orchestra.mp3" },
  { id: "64",  title: "Slow Burn",                    artist: "Kacey Musgraves",   album: "Golden Hour",                      coverUrl: "https://images.unsplash.com/photo-1501426026826-31c667bdf23d?w=800&q=80",  duration: "3:47", src: "/music/Kacey Musgraves - Slow Burn (Official Audio).mp3" },
  { id: "65",  title: "Lua",                          artist: "Bright Eyes",       album: "I'm Wide Awake, It's Morning",     coverUrl: "https://images.unsplash.com/photo-1499415479124-43c32433a620?w=800&q=80",  duration: "4:14", src: "/music/Lua - Bright Eyes.mp3" },
  { id: "66",  title: "Bloodstream",                  artist: "Stateless",         album: "Bloodstream",                      coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",  duration: "5:38", src: "/music/Stateless - Bloodstream (Official lyrics).mp3" },
  { id: "67",  title: "Youth",                        artist: "Daughter",          album: "If You Leave",                     coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",  duration: "4:40", src: "/music/Daughter - Youth.mp3" },
  { id: "68",  title: "Medicine",                     artist: "Daughter",          album: "His Young Heart",                  coverUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",  duration: "4:10", src: "/music/Medicine.mp3" },

  // ── LOVE ──────────────────────────────────────────────────
  { id: "80",  title: "Make You Feel My Love",        artist: "Adele",             album: "19",                               coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",  duration: "3:32", src: "/music/Adele - Make You Feel My Love (Official Video).mp3" },
  { id: "81",  title: "Someone Like You",             artist: "Adele",             album: "21",                               coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",  duration: "4:45", src: "/music/Adele - Someone Like You (Official Music Video).mp3" },
  { id: "82",  title: "All of Me",                    artist: "John Legend",       album: "Love in the Future",               coverUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80",  duration: "4:29", src: "/music/John Legend - All of Me (Official Video).mp3" },
  { id: "83",  title: "A Thousand Years",             artist: "Christina Perri",   album: "A Thousand Years",                 coverUrl: "https://images.unsplash.com/photo-1519985176271-adb1088fa94c?w=800&q=80",  duration: "4:45", src: "/music/Christina Perri - A Thousand Years [Official Music Video].mp3" },
  { id: "84",  title: "Perfect",                      artist: "Ed Sheeran",        album: "÷ (Divide)",                       coverUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80",  duration: "4:23", src: "/music/Ed Sheeran - Perfect (Official Music Video).mp3" },
  { id: "85",  title: "Thinking Out Loud",            artist: "Ed Sheeran",        album: "X (Multiply)",                     coverUrl: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80",  duration: "4:41", src: "/music/Ed Sheeran - Thinking Out Loud (Official Music Video).mp3" },
  { id: "86",  title: "Can't Help Falling in Love",   artist: "Elvis Presley",     album: "Blue Hawaii",                      coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",  duration: "3:00", src: "/music/Elvis Presley - Can't Help Falling In Love (Official Audio).mp3" },
  { id: "87",  title: "Lover",                        artist: "Taylor Swift",      album: "Lover",                            coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=800&q=80",  duration: "3:41", src: "/music/Taylor Swift - Lover (Official Music Video).mp3" },
  { id: "88",  title: "Wildest Dreams",               artist: "Taylor Swift",      album: "1989",                             coverUrl: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?w=800&q=80",  duration: "3:40", src: "/music/Taylor Swift - Wildest Dreams.mp3" },

  // ── LEGENDS ───────────────────────────────────────────────
  { id: "100", title: "Bohemian Rhapsody",            artist: "Queen",             album: "A Night at the Opera",             coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",  duration: "5:55", src: "/music/Queen – Bohemian Rhapsody (Official Video Remastered).mp3" },
  { id: "101", title: "Hotel California",             artist: "Eagles",            album: "Hotel California",                 coverUrl: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80",  duration: "6:30", src: "/music/Hotel California (2013 Remaster).mp3" },
  { id: "102", title: "Stairway to Heaven",           artist: "Led Zeppelin",      album: "Led Zeppelin IV",                  coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",  duration: "8:02", src: "/music/Led Zeppelin - Stairway To Heaven (Official Audio).mp3" },
  { id: "103", title: "Comfortably Numb",             artist: "Pink Floyd",        album: "The Wall",                         coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",  duration: "6:23", src: "/music/Pink Floyd - Comfortably numb.mp3" },
  { id: "104", title: "Wish You Were Here",           artist: "Pink Floyd",        album: "Wish You Were Here",               coverUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",  duration: "5:40", src: "/music/Pink Floyd - Wish You Were Here.mp3" },
  { id: "105", title: "Let It Be",                    artist: "The Beatles",       album: "Let It Be",                        coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",  duration: "3:50", src: "/music/Let It Be (Remastered 2009).mp3" },
  { id: "106", title: "Hey Jude",                     artist: "The Beatles",       album: "Hey Jude",                         coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",  duration: "7:11", src: "/music/The Beatles - The Beatles - Hey Jude (Official Music Video) [Remastered 2015].mp3" },
  { id: "107", title: "Imagine",                      artist: "John Lennon",       album: "Imagine",                          coverUrl: "https://images.unsplash.com/photo-1577375729152-4c8b5fcda381?w=800&q=80",  duration: "3:07", src: "/music/Imagine - John Lennon & The Plastic Ono Band (w The Flux Fiddlers) (Ultimate Mix 2018) - 4K REMASTER.mp3" },
  { id: "108", title: "Space Oddity",                 artist: "David Bowie",       album: "Space Oddity",                     coverUrl: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&q=80",  duration: "5:17", src: "/music/David Bowie - Space Oddity (Official Video).mp3" },
  { id: "109", title: "Heroes",                       artist: "David Bowie",       album: "Heroes",                           coverUrl: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80",  duration: "6:07", src: "/music/David Bowie - ＂Heroes＂ (Official Video) [HD].mp3" },
  { id: "110", title: "Roxanne",                      artist: "The Police",        album: "Outlandos d'Amour",                coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=800&q=80",  duration: "3:13", src: "/music/The Police - Roxanne (Official Music Video).mp3" },
  { id: "111", title: "Every Breath You Take",        artist: "The Police",        album: "Synchronicity",                    coverUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",  duration: "4:13", src: "/music/The Police - Every Breath You Take (Official Music Video).mp3" },
  { id: "112", title: "Africa",                       artist: "Toto",              album: "Toto IV",                          coverUrl: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=800&q=80",  duration: "4:55", src: "/music/Toto - Africa (Official HD Video).mp3" },
  { id: "113", title: "Take On Me",                   artist: "a-ha",              album: "Hunting High and Low",             coverUrl: "https://images.unsplash.com/photo-1518085250887-2f903c200fee?w=800&q=80",  duration: "3:46", src: "/music/a-ha - Take On Me (Official Video) [4K].mp3" },
  { id: "114", title: "Don't You (Forget About Me)",  artist: "Simple Minds",      album: "Don't You",                        coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",  duration: "4:21", src: "/music/Simple Minds - Don't You (Forget About Me).mp3" },

  // ── VIBES ─────────────────────────────────────────────────
  { id: "130", title: "Midnight City",                artist: "M83",               album: "Hurry Up, We're Dreaming",         coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",  duration: "4:03", src: "/music/M83 'Midnight City' Official video.mp3" },
  { id: "131", title: "Intro",                        artist: "The xx",            album: "xx",                               coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=800&q=80",  duration: "2:07", src: "/music/Intro.mp3" },
  { id: "132", title: "On + On",                      artist: "Erykah Badu",       album: "Baduizm",                          coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=800&q=80",  duration: "5:22", src: "/music/Erykah Badu - On & On (Remix Edit).mp3" },
  { id: "133", title: "Redbone",                      artist: "Childish Gambino",  album: "Awaken, My Love!",                 coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",  duration: "5:26", src: "/music/Childish Gambino - Redbone (Lyrics).mp3" },
  { id: "134", title: "Do I Wanna Know?",             artist: "Arctic Monkeys",    album: "AM",                               coverUrl: "https://images.unsplash.com/photo-1508973379184-7517410eec07?w=800&q=80",  duration: "4:32", src: "/music/Arctic Monkeys - Do I Wanna Know？ (Official Video).mp3" },
  { id: "135", title: "R U Mine?",                    artist: "Arctic Monkeys",    album: "AM",                               coverUrl: "https://images.unsplash.com/photo-1558618047-f4e2e3d82e1f?w=800&q=80",  duration: "3:21", src: "/music/Arctic Monkeys - R U Mine？ (Official Video).mp3" },
  { id: "136", title: "505",                          artist: "Arctic Monkeys",    album: "Favourite Worst Nightmare",        coverUrl: "https://images.unsplash.com/photo-1571388208497-71bedc604bf5?w=800&q=80",  duration: "4:13", src: "/music/Arctic Monkeys - 505.mp3" },
  { id: "137", title: "Lost in the Light",            artist: "Bahamas",           album: "Barchords",                        coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",  duration: "3:41", src: "/music/Lost in the Light - Bahamas.mp3" },
  { id: "138", title: "Electric Feel",                artist: "MGMT",              album: "Oracular Spectacular",             coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=800&q=80",  duration: "3:49", src: "/music/MGMT - Electric Feel (Official HD Video).mp3" },
  { id: "139", title: "Kids",                         artist: "MGMT",              album: "Oracular Spectacular",             coverUrl: "https://images.unsplash.com/photo-1553514029-1318c9127859?w=800&q=80",  duration: "5:01", src: "/music/MGMT - Kids (Lyrics).mp3" },

  // ── OTHER ─────────────────────────────────────────────────
  { id: "150", title: "Blinding Lights",              artist: "The Weeknd",        album: "After Hours",                      coverUrl: "https://images.unsplash.com/photo-1604537466158-719b1972feb8?w=800&q=80",  duration: "3:20", src: "/music/The Weeknd - Blinding Lights (Official Video).mp3" },
  { id: "151", title: "Starboy",                      artist: "The Weeknd",        album: "Starboy",                          coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",  duration: "3:50", src: "/music/The Weeknd - Starboy ft. Daft Punk (Official Video) ft. Daft Punk.mp3" },
  { id: "152", title: "Circles",                      artist: "Post Malone",       album: "Hollywood's Bleeding",             coverUrl: "https://images.unsplash.com/photo-1574169208507-84376144848b?w=800&q=80",  duration: "3:35", src: "/music/Post Malone - Circles.mp3" },
  { id: "153", title: "Sunflower",                    artist: "Post Malone",       album: "Spider-Man: Into the Spider-Verse",coverUrl: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=800&q=80",  duration: "2:38", src: "/music/Post Malone, Swae Lee - Sunflower (Spider-Man： Into the Spider-Verse).mp3" },
  { id: "154", title: "Levitating",                   artist: "Dua Lipa",          album: "Future Nostalgia",                 coverUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",  duration: "3:23", src: "/music/Dua Lipa - Levitating Featuring DaBaby (Official Music Video).mp3" },
  { id: "155", title: "As It Was",                    artist: "Harry Styles",      album: "Harry's House",                    coverUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",  duration: "2:37", src: "/music/Harry Styles - As It Was (Official Video).mp3" },
  { id: "156", title: "Heat Waves",                   artist: "Glass Animals",     album: "Dreamland",                        coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",  duration: "3:59", src: "/music/Glass Animals - Heat Waves (Official Video).mp3" },
  { id: "157", title: "golden hour",                  artist: "JVKE",              album: "This is What ____ Feels Like",     coverUrl: "https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=800&q=80",  duration: "3:29", src: "/music/JVKE - golden hour (official music video).mp3" },
  { id: "158", title: "Anti-Hero",                    artist: "Taylor Swift",      album: "Midnights",                        coverUrl: "https://images.unsplash.com/photo-1518972734183-c4b97c4e1a32?w=800&q=80",  duration: "3:20", src: "/music/Taylor Swift - Anti-Hero (Official Music Video).mp3" },
  { id: "159", title: "Flowers",                      artist: "Miley Cyrus",       album: "Endless Summer Vacation",          coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=800&q=80",  duration: "3:21", src: "/music/Miley Cyrus - Flowers (Official Video).mp3" },
  { id: "160", title: "Cruel Summer",                 artist: "Taylor Swift",      album: "Lover",                            coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",  duration: "2:58", src: "/music/Taylor Swift - Cruel Summer (Official Audio).mp3" },
  { id: "161", title: "Peaches",                      artist: "Justin Bieber",     album: "Justice",                          coverUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80",  duration: "3:18", src: "/music/Justin Bieber - Peaches ft. Daniel Caesar, Giveon.mp3" },

  // ── NEW MOVIES (from batch) ────────────────────────────────
  { id: "200", title: "A Dark Knight (Epic)",         artist: "Mathias Fritsche",  album: "Batman OST",                       coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",  duration: "6:22", src: "/music/A Dark Knight (Epic Version).mp3" },
  { id: "201", title: "Why Do We Fall?",              artist: "Hans Zimmer",       album: "The Dark Knight Rises OST",        coverUrl: "https://images.unsplash.com/photo-1414862625253-63af814c65e7?w=800&q=80",  duration: "2:07", src: "/music/Why Do We Fall - Hans Zimmer.mp3" },
  { id: "202", title: "Stay Alive",                   artist: "Jose Gonzalez",     album: "The Secret Life of Walter Mitty",  coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",  duration: "4:27", src: "/music/Stay Alive - Jose Gonzalez.mp3" },
  { id: "203", title: "You Know My Name",             artist: "Chris Cornell",     album: "Casino Royale OST",                coverUrl: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80",  duration: "4:01", src: "/music/You Know My Name - Chris Cornell.mp3" },
  { id: "204", title: "Blaze of Glory",               artist: "Jon Bon Jovi",      album: "Young Guns II",                    coverUrl: "https://images.unsplash.com/photo-1518972734183-c4b97c4e1a32?w=800&q=80",  duration: "5:36", src: "/music/Blaze Of Glory - Jon Bon Jovi.mp3" },
  { id: "205", title: "Godzilla!",                    artist: "Alexandre Desplat", album: "Godzilla OST",                     coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",  duration: "2:09", src: "/music/Godzilla - Alexandre Desplat.mp3" },
  { id: "206", title: "Lead Me Home",                 artist: "Jamie N Commons",   album: "The Walking Dead OST",             coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",  duration: "1:58", src: "/music/Lead Me Home - Jamie N Commons.mp3" },
  { id: "207", title: "Greenback Boogie",             artist: "Ima Robot",         album: "Suits OST",                        coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=800&q=80",  duration: "4:58", src: "/music/Greenback Boogie - Ima Robot.mp3" },
  { id: "208", title: "Treadstone Assassins",         artist: "John Powell",       album: "The Bourne Identity OST",          coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",  duration: "2:13", src: "/music/Treadstone Assassins - John Powell.mp3" },
  { id: "209", title: "Rocky Balboa Theme",           artist: "Various Artists",   album: "Rocky Balboa OST",                 coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",  duration: "4:55", src: "/music/Rocky Balboa - Theme Song.mp3" },
  { id: "210", title: "Burning Heart",                artist: "Survivor",          album: "Rocky IV",                         coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",  duration: "3:51", src: "/music/Burning Heart - Survivor.mp3" },
  { id: "211", title: "Eye of the Tiger",             artist: "Survivor",          album: "Eye of the Tiger",                 coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",  duration: "4:04", src: "/music/Eye of the Tiger - Survivor.mp3" },
  { id: "212", title: "Succession Main Theme",        artist: "Nicholas Britell",  album: "Succession Season 4",              coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",  duration: "2:02", src: "/music/Succession (Main Title Theme).mp3" },
  { id: "213", title: "Duel of the Fates (Epic)",     artist: "Samuel Kim",        album: "Duel of The Fates",                coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",  duration: "3:06", src: "/music/Duel of The Fates - Epic Version.mp3" },
  // ── NEW INSTRUMENTALS ─────────────────────────────────────
  { id: "220", title: "The XX Intro (ELEZO Remix)",   artist: "ELEZO",             album: "Remix",                            coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=800&q=80",  duration: "2:42", src: "/music/The XX Intro - ELEZO Remix.mp3" },
  // ── NEW CALM ──────────────────────────────────────────────
  { id: "230", title: "Love and Hate",                artist: "Michael Kiwanuka",  album: "Love and Hate",                    coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",  duration: "7:08", src: "/music/Love & Hate - Michael Kiwanuka.mp3" },
  { id: "231", title: "The Night We Met",             artist: "Lord Huron",        album: "Strange Trails",                   coverUrl: "https://images.unsplash.com/photo-1414862625253-63af814c65e7?w=800&q=80",  duration: "3:29", src: "/music/The Night We Met - Lord Huron.mp3" },
  { id: "232", title: "Way Down We Go",               artist: "KALEO",             album: "A/B",                              coverUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",  duration: "3:34", src: "/music/Way Down We Go - KALEO.mp3" },
  { id: "233", title: "Hold Back the River",          artist: "James Bay",         album: "Chaos and the Calm",               coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80",  duration: "3:59", src: "/music/Hold Back the River - James Bay.mp3" },
  { id: "234", title: "Before You Go",                artist: "Lewis Capaldi",     album: "Divinely Uninspired",              coverUrl: "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80",  duration: "3:36", src: "/music/Before You Go - Lewis Capaldi.mp3" },
  { id: "235", title: "Human",                        artist: "Rag'n'Bone Man",    album: "Human",                            coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",  duration: "3:20", src: "/music/Human - Rag'n'Bone Man.mp3" },
  { id: "236", title: "Somewhere Only We Know",       artist: "Keane",             album: "Hopes and Fears",                  coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80",  duration: "3:58", src: "/music/Somewhere Only We Know - Keane.mp3" },
  { id: "237", title: "Dandelions",                   artist: "Ruth B.",           album: "Safe Haven",                       coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=800&q=80",  duration: "3:54", src: "/music/Dandelions - Ruth B.mp3" },
  { id: "238", title: "Unknown (To You)",             artist: "Jacob Banks",       album: "Village",                          coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",  duration: "3:54", src: "/music/Unknown (To You) - Jacob Banks.mp3" },
  { id: "239", title: "Open Your Eyes",               artist: "Snow Patrol",       album: "Eyes Open",                        coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",  duration: "5:42", src: "/music/Open Your Eyes - Snow Patrol.mp3" },
  // ── NEW LOVE ──────────────────────────────────────────────
  { id: "240", title: "Let Her Go",                   artist: "Passenger",         album: "All The Little Lights",            coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",  duration: "4:13", src: "/music/Let Her Go - Passenger.mp3" },
  { id: "241", title: "With You",                     artist: "Dean Lewis",        album: "The Epilogue",                     coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",  duration: "3:10", src: "/music/With You - Dean Lewis.mp3" },
  { id: "242", title: "Waves",                        artist: "Dean Lewis",        album: "Same Kind of Different",           coverUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",  duration: "4:02", src: "/music/Waves - Dean Lewis.mp3" },
  { id: "243", title: "Stay With Me",                 artist: "Sam Smith",         album: "In The Lonely Hour",               coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=800&q=80",  duration: "2:53", src: "/music/Stay With Me - Sam Smith.mp3" },
  { id: "244", title: "Minefields",                   artist: "Faouzia",           album: "Minefields",                       coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&q=80",  duration: "3:11", src: "/music/Minefields - Faouzia & John Legend.mp3" },
  { id: "245", title: "Belong Together",              artist: "Mark Ambor",        album: "Belong Together",                  coverUrl: "https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=800&q=80",  duration: "2:29", src: "/music/Belong Together - Mark Ambor.mp3" },
  { id: "246", title: "Let's Hurt Tonight",           artist: "OneRepublic",       album: "Oh My My",                         coverUrl: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80",  duration: "3:15", src: "/music/Let's Hurt Tonight - OneRepublic.mp3" },
  { id: "247", title: "Cold Heart (PNAU Remix)",      artist: "Elton John",        album: "The Lockdown Sessions",            coverUrl: "https://images.unsplash.com/photo-1504151932400-72d4384f04b3?w=800&q=80",  duration: "3:23", src: "/music/Cold Heart - Elton John & Dua Lipa.mp3" },
  // ── NEW LEGENDS ───────────────────────────────────────────
  { id: "250", title: "Big in Japan",                 artist: "Alphaville",        album: "Forever Young",                    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",  duration: "4:45", src: "/music/Big in Japan - Alphaville.mp3" },
  { id: "251", title: "Everybody Wants to Rule the World", artist: "Tears For Fears", album: "Songs from the Big Chair",      coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=800&q=80",  duration: "4:12", src: "/music/Everybody Wants To Rule The World - Tears For Fears.mp3" },
  { id: "252", title: "Zombie",                       artist: "The Cranberries",   album: "No Need to Argue",                 coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",  duration: "5:08", src: "/music/Zombie - The Cranberries.mp3" },
  { id: "253", title: "What a Wonderful World",       artist: "Louis Armstrong",   album: "What a Wonderful World",           coverUrl: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=800&q=80",  duration: "2:20", src: "/music/What A Wonderful World - Louis Armstrong.mp3" },
  { id: "254", title: "Man in the Mirror",            artist: "Michael Jackson",   album: "Bad",                              coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",  duration: "5:20", src: "/music/Man in the Mirror - Michael Jackson.mp3" },
  { id: "255", title: "Sweet Caroline",               artist: "Neil Diamond",      album: "Sweet Caroline",                   coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",  duration: "3:24", src: "/music/Sweet Caroline - Neil Diamond.mp3" },
  { id: "256", title: "Wind of Change",               artist: "Scorpions",         album: "Crazy World",                      coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",  duration: "5:13", src: "/music/Wind Of Change - Scorpions.mp3" },
  { id: "257", title: "I'm Gonna Be (500 Miles)",     artist: "The Proclaimers",   album: "Sunshine on Leith",                coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&q=80",  duration: "3:40", src: "/music/I'm Gonna Be (500 Miles) - The Proclaimers.mp3" },
  { id: "258", title: "Don't Let the Sun Go Down",    artist: "Elton John",        album: "Twenty Five",                      coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=800&q=80",  duration: "5:48", src: "/music/Don't Let the Sun Go Down on Me - Elton John & George Michael.mp3" },
  { id: "259", title: "I Don't Want to Miss a Thing", artist: "Aerosmith",         album: "Armageddon OST",                   coverUrl: "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80",  duration: "4:59", src: "/music/I Don't Want to Miss a Thing - Aerosmith.mp3" },
  { id: "260", title: "Lean on Me",                   artist: "Bill Withers",      album: "Still Bill",                       coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80",  duration: "4:19", src: "/music/Lean on Me - Bill Withers.mp3" },
  { id: "261", title: "Ain't No Sunshine",            artist: "Bill Withers",      album: "Just As I Am",                     coverUrl: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",  duration: "2:06", src: "/music/Ain't No Sunshine - Bill Withers.mp3" },
  { id: "262", title: "Stand By Me",                  artist: "Ben E. King",       album: "Stand By Me",                      coverUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=800&q=80",  duration: "2:58", src: "/music/Stand By Me - Ben E. King.mp3" },
  { id: "263", title: "I'm Still Standing",           artist: "Elton John",        album: "Too Low for Zero",                 coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",  duration: "3:04", src: "/music/I'm Still Standing - Elton John.mp3" },
  { id: "264", title: "Save Tonight",                 artist: "Eagle-Eye Cherry",  album: "Desireless",                       coverUrl: "https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=800&q=80",  duration: "4:01", src: "/music/Save Tonight - Eagle-Eye Cherry.mp3" },
  { id: "265", title: "It's My Life",                 artist: "Bon Jovi",          album: "Crush",                            coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&q=80",  duration: "3:45", src: "/music/It's My Life - Bon Jovi.mp3" },
  { id: "266", title: "Renegades",                    artist: "X Ambassadors",     album: "VHS",                              coverUrl: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",  duration: "3:16", src: "/music/Renegades - X Ambassadors.mp3" },
  { id: "267", title: "Lovely Day",                   artist: "Bill Withers",      album: "Menagerie",                        coverUrl: "https://images.unsplash.com/photo-1490750967868-88df5691240e?w=800&q=80",  duration: "4:15", src: "/music/Lovely Day - Bill Withers.mp3" },
  { id: "268", title: "Grey Lynn Park",               artist: "The Veils",         album: "Troubles of the Brain",            coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80",  duration: "2:40", src: "/music/Grey Lynn Park - The Veils.mp3" },
  { id: "269", title: "Drift Away",                   artist: "Dobie Gray",        album: "Drift Away",                       coverUrl: "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",  duration: "3:59", src: "/music/Drift Away - Dobie Gray.mp3" },
  { id: "270", title: "Bittersweet Symphony",         artist: "Marc Scibilia",     album: "Bittersweet Symphony",             coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80",  duration: "4:30", src: "/music/Bittersweet Symphony - Marc Scibilia.mp3" },
  { id: "271", title: "What's Up?",                   artist: "4 Non Blondes",     album: "Bigger Better Faster More",        coverUrl: "https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80",  duration: "4:56", src: "/music/What's Up - 4 Non Blondes.mp3" },
  { id: "272", title: "Breakfast at Tiffany's",       artist: "Deep Blue Something",album: "Home",                            coverUrl: "https://images.unsplash.com/photo-1445294211564-3ca59d999abd?w=800&q=80",  duration: "4:18", src: "/music/Breakfast At Tiffany's - Deep Blue Something.mp3" },
  { id: "273", title: "The Best",                     artist: "Tina Turner",       album: "Foreign Affair",                   coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",  duration: "5:31", src: "/music/The Best - Tina Turner.mp3" },
  // ── NEW VIBES ─────────────────────────────────────────────
  { id: "280", title: "Geronimo",                     artist: "Sheppard",          album: "Bombs Away",                       coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",  duration: "3:39", src: "/music/Geronimo - Sheppard.mp3" },
  { id: "281", title: "Budapest",                     artist: "George Ezra",       album: "Wanted on Voyage",                 coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",  duration: "3:21", src: "/music/Budapest - George Ezra.mp3" },
  { id: "282", title: "High on Life",                 artist: "Martin Garrix",     album: "High on Life",                     coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",  duration: "3:51", src: "/music/High On Life - Martin Garrix.mp3" },
  { id: "283", title: "Here Comes the Hotstepper",    artist: "Ini Kamoze",        album: "Here Comes the Hotstepper",        coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=800&q=80",  duration: "4:11", src: "/music/Here Comes the Hotstepper - Ini Kamoze.mp3" },
  { id: "284", title: "Love Me Again",                artist: "John Newman",       album: "Tribute",                          coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",  duration: "4:00", src: "/music/Love Me Again - John Newman.mp3" },
  { id: "285", title: "Can't Feel My Face",           artist: "The Weeknd",        album: "Beauty Behind the Madness",        coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",  duration: "3:34", src: "/music/Can't Feel My Face - The Weeknd.mp3" },
  // ── NEW OTHER ─────────────────────────────────────────────
  { id: "290", title: "Skin",                         artist: "Rag'n'Bone Man",    album: "Human (Deluxe)",                   coverUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",  duration: "4:00", src: "/music/Skin - Rag'n'Bone Man.mp3" },
  { id: "291", title: "Superman",                     artist: "Lazlo Bane",        album: "All The Time in the World",        coverUrl: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80",  duration: "3:46", src: "/music/Superman - Lazlo Bane.mp3" },
  { id: "292", title: "Ordinary",                     artist: "Alex Warren",       album: "You'll Be Alright, Kid",           coverUrl: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=800&q=80",  duration: "3:07", src: "/music/Ordinary - Alex Warren.mp3" },
  // ── PEAK ──────────────────────────────────────────────────
  { id: "300", title: "Nessun Dorma (Live)",          artist: "Luciano Pavarotti", album: "The Three Tenors in Concert",      coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",  duration: "3:25", src: "/music/Nessun Dorma - Pavarotti.mp3" },
  { id: "301", title: "Tere Bina",                    artist: "A.R. Rahman",       album: "Guru OST",                         coverUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?w=800&q=80",  duration: "5:10", src: "/music/Tere Bina - AR Rahman.mp3" },
  // ── TECHNO ────────────────────────────────────────────────
  { id: "310", title: "One Last Waltz",               artist: "DannyHO",           album: "Afterglow",                        coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",  duration: "5:08", src: "/music/One Last Waltz - DannyHO.mp3" },
  { id: "311", title: "Against the Tide",             artist: "DannyHO",           album: "Afterglow",                        coverUrl: "https://images.unsplash.com/photo-1535223289429-72aad301b73d?w=800&q=80",  duration: "4:32", src: "/music/Against the Tide - DannyHO.mp3" },
  { id: "312", title: "Tell Me Why (James Carter Remix)", artist: "Supermode",     album: "Tell Me Why",                      coverUrl: "https://images.unsplash.com/photo-1598387993441-a364f854cfdd?w=800&q=80",  duration: "2:59", src: "/music/Tell Me Why (James Carter Remix) - Supermode.mp3" },
  { id: "313", title: "Inner Light",                  artist: "Elderbrook",        album: "Inner Light",                      coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",  duration: "4:18", src: "/music/Inner Light - Elderbrook & Bob Moses.mp3" },
  { id: "314", title: "Shots (Broiler Remix)",        artist: "Imagine Dragons",   album: "Shots EP",                         coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",  duration: "3:12", src: "/music/Shots (Broiler Remix) - Imagine Dragons.mp3" },
];

// ── Helpers ────────────────────────────────────────────────
const byArtist = (...artists: string[]) =>
  ALL_TRACKS.filter(t => artists.includes(t.artist));

const byIds = (...ids: string[]) =>
  ALL_TRACKS.filter(t => ids.includes(t.id));
export const PLAYLISTS: Playlist[] = [
  {
    id: "coldplay",
    name: "Coldplay",
    description: "Every Coldplay track in the collection",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80",
    tracks: byArtist("Coldplay"),
  },
  {
    id: "instrumentals",
    name: "Instrumentals",
    description: "Pure music, no words needed",
    coverUrl: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=800&q=80",
    tracks: byArtist("Chet Faker", "Ludovico Einaudi", "Erik Satie", "Yann Tiersen", "Yiruma", "Claude Debussy"),
  },
  {
    id: "movies",
    name: "Movies",
    description: "Scores and soundtracks that hit different",
    coverUrl: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&q=80",
    tracks: byArtist("Hans Zimmer", "Nino Rota", "Clint Mansell", "Klaus Badelt", "Celine Dion"),
  },
  {
    id: "calm",
    name: "Calm",
    description: "Wind down. Breathe.",
    coverUrl: "https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80",
    tracks: byArtist("Bon Iver", "Anna Nalick", "Manchester Orchestra", "Kacey Musgraves", "Bright Eyes", "Stateless", "Daughter"),
  },
  {
    id: "love",
    name: "Love",
    description: "For the moments that matter",
    coverUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80",
    tracks: byArtist("Adele", "John Legend", "Christina Perri", "Ed Sheeran", "Elvis Presley", "Taylor Swift"),
  },
  {
    id: "legends",
    name: "Legends",
    description: "Old music that never gets old",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80",
    tracks: byArtist("Queen", "Eagles", "Led Zeppelin", "Pink Floyd", "The Beatles", "John Lennon", "David Bowie", "The Police", "Toto", "a-ha", "Simple Minds"),
  },
  {
    id: "vibes",
    name: "Vibes",
    description: "Whatever the mood calls for",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    tracks: byArtist("M83", "The xx", "Erykah Badu", "Childish Gambino", "Arctic Monkeys", "Bahamas", "MGMT"),
  },
  {
    id: "other",
    name: "Other",
    description: "Everything else that slaps",
    coverUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
    tracks: byArtist("The Weeknd", "Post Malone", "Dua Lipa", "Harry Styles", "Glass Animals", "JVKE", "Justin Bieber", "Miley Cyrus"),
  },
  {
    id: "techno",
    name: "Techno",
    description: "Hard-hitting electronic and techno",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&q=80",
    tracks: [],
  },
  {
    id: "peak",
    name: "Peak",
    description: "The absolute best — your personal hall of fame",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
    tracks: [],
  },
];
