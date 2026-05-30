# PrivatePlayer — Song Downloader (Search Edition)
# Uses yt-dlp's ytsearch to find each song automatically — no guessing URLs
# Usage: Run as-is to download all songs, or add more to $songs at the bottom

$ytdlp     = "C:\Users\Gener\AppData\Local\Packages\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\LocalCache\local-packages\Python313\Scripts\yt-dlp.exe"
$ffmpegDir = "C:\Users\Gener\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin"
$outDir    = "C:\PrivatePlayer\public\music"

# ─────────────────────────────────────────────────────────────
# Song list: "Title - Artist"
# yt-dlp will search YouTube and download the top result
# ─────────────────────────────────────────────────────────────
$songs = @(
  # ── COLDPLAY ──
  "Paradise - Coldplay"
  "In My Place - Coldplay"
  "The Scientist - Coldplay"
  "Yellow - Coldplay"
  "Fix You - Coldplay"
  "Speed of Sound - Coldplay"
  "Clocks - Coldplay"
  "Viva la Vida - Coldplay"
  "A Sky Full of Stars - Coldplay"
  "Magic - Coldplay"
  "The Hardest Part - Coldplay"
  "Shiver - Coldplay"
  "Trouble - Coldplay"
  "Every Teardrop Is a Waterfall - Coldplay"
  "Charlie Brown - Coldplay"

  # ── INSTRUMENTALS ──
  "Talk Is Cheap - Chet Faker"
  "Experience - Ludovico Einaudi"
  "Nuvole Bianche - Ludovico Einaudi"
  "Divenire - Ludovico Einaudi"
  "Gymnopédie No.1 - Erik Satie"
  "Comptine d'un autre été - Yann Tiersen"
  "River Flows in You - Yiruma"
  "Clair de Lune - Debussy"

  # ── MOVIES / SOUNDTRACKS ──
  "Time - Hans Zimmer Inception"
  "Gladiator Now We Are Free - Hans Zimmer"
  "Interstellar Main Theme - Hans Zimmer"
  "My Heart Will Go On - Celine Dion"
  "The Godfather Waltz - Nino Rota"
  "Requiem for a Dream theme - Clint Mansell"
  "Pirates of the Caribbean He's a Pirate - Klaus Badelt"

  # ── CALM ──
  "Holocene - Bon Iver"
  "Skinny Love - Bon Iver"
  "Breathe 2 AM - Anna Nalick"
  "Slow Burn - Kacey Musgraves"
  "Youth - Daughter"
  "Medicine - Daughter"
  "Bloodstream - Stateless"

  # ── LOVE ──
  "Make You Feel My Love - Adele"
  "Someone Like You - Adele"
  "All of Me - John Legend"
  "A Thousand Years - Christina Perri"
  "Perfect - Ed Sheeran"
  "Thinking Out Loud - Ed Sheeran"
  "Can't Help Falling in Love - Elvis Presley"
  "Lover - Taylor Swift"
  "Wildest Dreams - Taylor Swift"

  # ── LEGENDS ──
  "Bohemian Rhapsody - Queen"
  "Hotel California - Eagles"
  "Stairway to Heaven - Led Zeppelin"
  "Comfortably Numb - Pink Floyd"
  "Wish You Were Here - Pink Floyd"
  "Let It Be - The Beatles"
  "Hey Jude - The Beatles"
  "Imagine - John Lennon"
  "Space Oddity - David Bowie"
  "Heroes - David Bowie"
  "Roxanne - The Police"
  "Every Breath You Take - The Police"
  "Africa - Toto"
  "Take On Me - a-ha"
  "Don't You Forget About Me - Simple Minds"

  # ── VIBES ──
  "Midnight City - M83"
  "Intro - The xx"
  "On and On - Erykah Badu"
  "Redbone - Childish Gambino"
  "Do I Wanna Know - Arctic Monkeys"
  "R U Mine - Arctic Monkeys"
  "505 - Arctic Monkeys"
  "Electric Feel - MGMT"
  "Kids - MGMT"

  # ── OTHER ──
  "Blinding Lights - The Weeknd"
  "Starboy - The Weeknd"
  "Circles - Post Malone"
  "Sunflower - Post Malone"
  "Levitating - Dua Lipa"
  "As It Was - Harry Styles"
  "Heat Waves - Glass Animals"
  "golden hour - JVKE"
  "Anti-Hero - Taylor Swift"
  "Flowers - Miley Cyrus"
  "Cruel Summer - Taylor Swift"
  "Peaches - Justin Bieber"

  # ── ADD MORE SONGS HERE ──
  # Format: "Song Title - Artist Name"
  #
)

# ─────────────────────────────────────────────────────────────
$flags = @(
  "--no-check-certificate",
  "--ffmpeg-location", $ffmpegDir,
  "-x", "--audio-format", "mp3", "--audio-quality", "0",
  "-o", "$outDir\%(title)s.%(ext)s",
  "--no-playlist",
  "--default-search", "ytsearch"
)

Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   PrivatePlayer — Song Downloader v2         ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "Downloading $($songs.Count) songs to: $outDir" -ForegroundColor Yellow
Write-Host ""

$success = 0
$failed  = 0
$skipped = 0

foreach ($song in $songs) {
  $song = $song.Trim()
  if (-not $song -or $song.StartsWith("#")) { continue }

  # Check if we likely already have this song
  $titlePart = ($song -split " - ")[0].Trim().ToLower() -replace "[^a-z0-9 ]", ""
  $existing = Get-ChildItem $outDir -Filter "*.mp3" | Where-Object {
    $fn = $_.BaseName.ToLower() -replace "[^a-z0-9 ]", ""
    $fn -like "*$titlePart*"
  }
  if ($existing) {
    Write-Host "  ↷ Already have: $song" -ForegroundColor DarkGray
    $skipped++
    continue
  }

  Write-Host "⏬  $song" -ForegroundColor DarkCyan
  $result = & $ytdlp @flags "ytsearch1:$song" 2>&1

  if ($LASTEXITCODE -eq 0) {
    $mp3line = $result | Where-Object { $_ -match "Destination:.*\.mp3" } | Select-Object -Last 1
    if ($mp3line) {
      $filename = [System.IO.Path]::GetFileName(($mp3line -replace ".*Destination: ", "").Trim())
      Write-Host "   ✓ $filename" -ForegroundColor Green
    } else {
      Write-Host "   ✓ Downloaded" -ForegroundColor Green
    }
    $success++
  } else {
    $errLines = $result | Where-Object { $_ -match "ERROR:" } | Select-Object -Last 2
    Write-Host "   ✗ FAILED: $($errLines -join ' | ')" -ForegroundColor Red
    $failed++
  }
}

Write-Host ""
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host "  ✓ Downloaded : $success" -ForegroundColor Green
Write-Host "  ↷ Skipped    : $skipped" -ForegroundColor DarkGray
if ($failed -gt 0) {
  Write-Host "  ✗ Failed     : $failed" -ForegroundColor Red
}
Write-Host "─────────────────────────────────────────" -ForegroundColor DarkGray
Write-Host ""
Write-Host "Done! MP3s are in: $outDir" -ForegroundColor Cyan
Write-Host "Open http://localhost:3000 to listen." -ForegroundColor DarkGray
