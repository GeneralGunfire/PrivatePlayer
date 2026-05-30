// ============================================================
//  PrivatePlayer — player logic
// ============================================================

(function () {
  const audio       = document.getElementById('audio');
  const playBtn     = document.getElementById('playBtn');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const volumeSlider= document.getElementById('volumeSlider');
  const trackTitle  = document.getElementById('trackTitle');
  const trackIndex  = document.getElementById('trackIndex');
  const currentTime = document.getElementById('currentTime');
  const duration    = document.getElementById('duration');
  const trackList   = document.getElementById('trackList');
  const emptyMsg    = document.getElementById('emptyMsg');

  let currentIndex = 0;

  // ── Build track list ──────────────────────────────────────
  if (!tracks || tracks.length === 0) {
    emptyMsg.style.display = 'block';
    document.getElementById('player').style.opacity = '0.4';
  } else {
    tracks.forEach((track, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="track-num">${i + 1}</span>${track.title}`;
      li.addEventListener('click', () => loadTrack(i, true));
      trackList.appendChild(li);
    });
    loadTrack(0, false);
  }

  // ── Load a track ─────────────────────────────────────────
  function loadTrack(index, autoplay) {
    currentIndex = index;
    const track = tracks[index];

    audio.src = track.file;
    trackTitle.textContent = track.title;
    trackIndex.textContent = `${index + 1} / ${tracks.length}`;

    // Highlight active row
    document.querySelectorAll('.track-list li').forEach((li, i) => {
      li.classList.toggle('active', i === index);
    });

    progressBar.value = 0;
    currentTime.textContent = '0:00';
    duration.textContent = '0:00';

    if (autoplay) {
      audio.play();
      setPlayIcon(true);
    } else {
      setPlayIcon(false);
    }
  }

  // ── Play / Pause ──────────────────────────────────────────
  playBtn.addEventListener('click', () => {
    if (!tracks || tracks.length === 0) return;
    if (audio.paused) {
      audio.play();
      setPlayIcon(true);
    } else {
      audio.pause();
      setPlayIcon(false);
    }
  });

  function setPlayIcon(playing) {
    playBtn.innerHTML = playing ? '&#9646;&#9646;' : '&#9654;';
    playBtn.title = playing ? 'Pause' : 'Play';
  }

  // ── Prev / Next ───────────────────────────────────────────
  prevBtn.addEventListener('click', () => {
    if (!tracks || tracks.length === 0) return;
    const idx = (currentIndex - 1 + tracks.length) % tracks.length;
    loadTrack(idx, !audio.paused);
  });

  nextBtn.addEventListener('click', () => {
    if (!tracks || tracks.length === 0) return;
    const idx = (currentIndex + 1) % tracks.length;
    loadTrack(idx, !audio.paused);
  });

  // Auto-advance to next track
  audio.addEventListener('ended', () => {
    const idx = (currentIndex + 1) % tracks.length;
    loadTrack(idx, true);
  });

  // ── Progress bar ──────────────────────────────────────────
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    currentTime.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener('loadedmetadata', () => {
    progressBar.max = 100;
    duration.textContent = fmt(audio.duration);
  });

  progressBar.addEventListener('input', () => {
    if (!audio.duration) return;
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  });

  // ── Volume ────────────────────────────────────────────────
  volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
  });

  // ── Keyboard shortcuts ────────────────────────────────────
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;
    if (e.code === 'Space') { e.preventDefault(); playBtn.click(); }
    if (e.code === 'ArrowRight') nextBtn.click();
    if (e.code === 'ArrowLeft')  prevBtn.click();
  });

  // ── Helpers ───────────────────────────────────────────────
  function fmt(secs) {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
})();
