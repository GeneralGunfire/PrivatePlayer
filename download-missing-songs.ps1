# PrivatePlayer — Missing Songs Downloader (auto-generated)
# Downloads the 74 songs from the Liked Music list that have no local mp3 yet.
# Uses yt-dlp's ytsearch to find each song automatically.
# After running, regenerate the src map: node scripts/gen-src-map.js

$ytdlp     = "C:\Users\Gener\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts\yt-dlp.exe"
$ffmpegDir = "C:\Users\Gener\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin"
$outDir    = "C:\CODING\Old\PrivatePlayer\public\music"

$songs = @(
  'Tell Me Why (James Carter Remix) - Supermode'
  'Phantoms and Friends - Old Man Canyon'
  'Man in the Mirror - Michael Jackson'
  'The Night We Met - Lord Huron'
  "I Don't Want to Miss a Thing - Aerosmith"
  "Hold On, I'm Comin' - Sam & Dave"
  'I Play Rocky Trailer Music EPIC VERSION - Jamie Evans Music'
  "With the Devil I'm Going Down - Steelfeather"
  'Hymn for the Weekend - Coldplay'
  'Leave Me Alone - Michael Jackson'
  'Call Your Name - Alesso & John Newman'
  'Come And Get It - John Newman'
  'Until The End Of Time (Julian Bunetta Remix) - Justin Timberlake'
  'Is It Scary - Michael Jackson'
  'The Devils Share - Ramin Djawadi'
  'Chicago - Michael Jackson'
  'Lost Highway - NightCrawl'
  'Love Me - Lil Tecca'
  'Quarles and Limehouse - Steve Porcaro'
  'Let Your Body Fly - MAISON ROYALE'
  'Paper Trails - Trent Dabbs'
  "Shakin' Off The Rust - The Blue Stones"
  'One By One - The Blue Stones'
  'Waiting On the World to Change - John Mayer'
  'Human Nature - Michael Jackson'
  'Billie Jean - Michael Jackson'
  'Bad - Michael Jackson'
  'Home - Passenger'
  'The Starting Line - Keane'
  'Doors - Noah Kahan'
  'The Greatest - James Blunt'
  'A Moment Apart - ODESZA'
  'Have It All - Jeremy Kay'
  'Extreme Ways - Moby'
  'Happier - Marshmello and Bastille'
  'Wind Beneath My Wings - Bette Midler'
  'Shine - Elmo'
  'Hello - Adele'
  'Say Something - Justin Timberlake'
  'Way Back Into Love - Hugh Grant and Haley Bennett'
  'My Blood - Ellie Goulding'
  'Kal Ho Naa Ho - Shankar Ehsaan Loy and Sonu Nigam'
  'Skyfall - Adele'
  'Demons - Imagine Dragons'
  "We Didn't Start the Fire - Billy Joel"
  'This Is What You Came For - Calvin Harris and Rihanna'
  'Ticking Bomb - Aloe Blacc'
  'HOLD ON - ill peach'
  'Howl - Jake Houlsby'
  'Always - Panama'
  'Across The Room - ODESZA'
  'Sunny Came Home - Shawn Colvin'
  'Fields Of Gold - Sting'
  'Headlights - In Color'
  'Now I Know You - Bennett Coast'
  'Home - Good Neighbours'
  'Violet City - Mansionair'
  'Fell Again - Cikho'
  'Low Gravity - S Hill'
  'Love Is Blind - Dustin Tebbutt'
  'Rose Tint - Billy Sharp'
  'Move On - Michael Marcagi'
  'Sun is Dark - Sonaba and Henry Chris'
  'The Chase Rebuke Remix - Emmit Fenn and Rebuke'
  'Porch Light - Noah Kahan'
  "I'm Coming Home Fire Country Season 2 - Tristan Bushman"
  'Enemy Epic Version - Samuel Kim'
  'Misplaced - Riley Pearce'
  'How Long - The Howlers'
  'Under The Weight - Bobby Bazini'
  'Times Are Changing - Built by Titan and Skybourne'
  'Long Hard Times To Come - Gangstagrass'
  'Give Me Your Love - Sigala and John Newman'
  'The Crossing Osiyeza - Johnny Clegg'
)

$flags = @(
  "--no-check-certificate",
  "--ffmpeg-location", $ffmpegDir,
  "-x", "--audio-format", "mp3", "--audio-quality", "0",
  "-o", "$outDir\%(title)s.%(ext)s",
  "--no-playlist",
  "--default-search", "ytsearch"
)

Write-Host "Downloading $($songs.Count) missing songs to: $outDir" -ForegroundColor Yellow
Write-Host ""

$success = 0
$failed  = 0

foreach ($song in $songs) {
  $song = $song.Trim()
  if (-not $song) { continue }

  Write-Host "downloading  $song" -ForegroundColor DarkCyan
  $result = & $ytdlp @flags "ytsearch1:$song" 2>&1

  if ($LASTEXITCODE -eq 0) {
    Write-Host "   ok" -ForegroundColor Green
    $success++
  } else {
    $errLines = $result | Where-Object { $_ -match "ERROR:" } | Select-Object -Last 2
    Write-Host "   FAILED: $($errLines -join ' | ')" -ForegroundColor Red
    $failed++
  }
}

Write-Host ""
Write-Host "Downloaded: $success   Failed: $failed" -ForegroundColor Cyan
Write-Host "Now run: node scripts/gen-src-map.js" -ForegroundColor Yellow
