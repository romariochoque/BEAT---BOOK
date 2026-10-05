/* ==========================================================================
   BEET & BOOK - MOTOR DE AUDIO Y GENERADOR DE AMBIENTE LO-FI
   Utiliza Web Audio API para generar música relajante en tiempo real
   sin depender de archivos externos que puedan fallar.
   ========================================================================== */

class BeetAudioPlayer {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.currentTrackIndex = 0;
    this.tracks = [];
    this.volume = 0.75;
    this.currentTime = 0;
    this.duration = 180; // Segundos simulados por pista
    this.timer = null;

    // Nodos de sintetizador Web Audio
    this.masterGain = null;
    this.vinylGain = null;
    this.rainGain = null;
    this.isSynthLoopRunning = false;
    this.synthLoopInterval = null;

    // Configuración de acordes Lo-Fi / Jazz cálidos (en Hz)
    this.chordProgressions = {
      'lofi-rhodes': [
        [293.66, 349.23, 440.00, 523.25], // Dm7
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [349.23, 440.00, 523.25, 659.25]  // Fmaj7
      ],
      'smooth-jazz': [
        [220.00, 277.18, 329.63, 392.00, 493.88], // A9
        [293.66, 370.00, 440.00, 554.37],         // Dmaj7
        [329.63, 392.00, 493.88, 587.33],         // Em7
        [246.94, 311.13, 370.00, 440.00]          // Bm7
      ],
      'acoustic-piano': [
        [261.63, 329.63, 392.00], // C
        [196.00, 246.94, 293.66], // G
        [220.00, 261.63, 329.63], // Am
        [174.61, 220.00, 261.63]  // F
      ],
      'chopin-lofi': [
        [311.13, 392.00, 466.16, 587.33], // Ebmaj7
        [233.08, 293.66, 349.23, 440.00], // Bb7
        [261.63, 311.13, 392.00, 466.16], // Cm7
        [207.65, 261.63, 311.13, 392.00]  // Abmaj7
      ],
      'warm-guitar': [
        [164.81, 246.94, 329.63, 392.00], // Em
        [130.81, 196.00, 261.63, 329.63], // C
        [146.83, 220.00, 293.66, 370.00], // D
        [196.00, 246.94, 293.66, 392.00]  // G
      ],
      'rain-ambience': []
    };

    this.currentChordIndex = 0;
  }

  init(tracks) {
    this.tracks = tracks;
    this.renderTrackInUI();
  }

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Vinilo ambiental
      this.setupVinylCrackle();

      // Lluvia ambiental
      this.setupRainAmbience();
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setupVinylCrackle() {
    // Ruido blanco filtrado para emular aguja de tocadiscos
    const bufferSize = this.audioCtx.sampleRate * 2;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1200;
    filter.Q.value = 2.0;

    this.vinylGain = this.audioCtx.createGain();
    this.vinylGain.gain.setValueAtTime(0.015, this.audioCtx.currentTime); // Sutil

    whiteNoise.connect(filter);
    filter.connect(this.vinylGain);
    this.vinylGain.connect(this.masterGain);

    whiteNoise.start();
  }

  setupRainAmbience() {
    // Generador de lluvia suave
    const bufferSize = this.audioCtx.sampleRate * 3;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5; // Pink noise
    }

    const rainSource = this.audioCtx.createBufferSource();
    rainSource.buffer = buffer;
    rainSource.loop = true;

    const rainFilter = this.audioCtx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 850;

    this.rainGain = this.audioCtx.createGain();
    this.rainGain.gain.setValueAtTime(0.025, this.audioCtx.currentTime); // Lluvia relajante

    rainSource.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);

    rainSource.start();
  }

  // Toca una nota individual con timbre cálido de piano Rhodes / sintetizador
  playRhodesNote(freq, startTime, duration = 2.5) {
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const oscHarmonic = this.audioCtx.createOscillator();
    const noteGain = this.audioCtx.createGain();
    const lowpass = this.audioCtx.createBiquadFilter();

    // Filtro cálido para dar ese sonido Lo-Fi 'vintage'
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1400, startTime);
    lowpass.frequency.exponentialRampToValueAtTime(450, startTime + duration);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, startTime);

    // Armónico suave para cuerpo acústico
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);

    // Envolvente acústica (Attack suave, decay largo tipo campana de piano)
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(0.07, startTime + 0.08);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(lowpass);
    oscHarmonic.connect(lowpass);
    lowpass.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(startTime);
    oscHarmonic.start(startTime);
    osc.stop(startTime + duration);
    oscHarmonic.stop(startTime + duration);
  }

  playSubBass(freq, startTime, duration = 3.2) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const bassGain = this.audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq / 2, startTime); // Una octava abajo

    bassGain.gain.setValueAtTime(0.001, startTime);
    bassGain.gain.exponentialRampToValueAtTime(0.12, startTime + 0.05);
    bassGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(bassGain);
    bassGain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  // Bucle generativo en tiempo real según el tema actual
  startGenerativeLoop() {
    this.stopGenerativeLoop();
    this.isSynthLoopRunning = true;

    const playNextBar = () => {
      if (!this.isPlaying || !this.audioCtx) return;

      const track = this.getCurrentTrack();
      const toneType = track ? track.toneType : 'lofi-rhodes';
      const progression = this.chordProgressions[toneType] || this.chordProgressions['lofi-rhodes'];

      if (progression.length > 0) {
        const chord = progression[this.currentChordIndex % progression.length];
        const now = this.audioCtx.currentTime;

        // Arpegio cálido y elegante
        chord.forEach((freq, idx) => {
          this.playRhodesNote(freq, now + (idx * 0.12), 3.4);
        });

        // Bajo de acompañamiento
        this.playSubBass(chord[0], now, 3.2);

        this.currentChordIndex++;
      }
    };

    // Tocar el primer acorde de inmediato
    playNextBar();

    // Repetir armónicamente cada 3.2 segundos (ritmo Lo-Fi ~75 BPM)
    this.synthLoopInterval = setInterval(() => {
      if (this.isPlaying) {
        playNextBar();
      }
    }, 3200);
  }

  stopGenerativeLoop() {
    this.isSynthLoopRunning = false;
    if (this.synthLoopInterval) {
      clearInterval(this.synthLoopInterval);
      this.synthLoopInterval = null;
    }
  }

  play() {
    this.ensureAudioContext();
    this.isPlaying = true;
    this.startGenerativeLoop();

    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.currentTime++;
      if (this.currentTime >= this.duration) {
        this.next();
      }
      this.updateProgressUI();
    }, 1000);

    this.updatePlayBtnUI(true);
    this.triggerPlayingRowStyle();
  }

  pause() {
    this.isPlaying = false;
    this.stopGenerativeLoop();
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.updatePlayBtnUI(false);
    this.triggerPlayingRowStyle();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  next() {
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    this.currentTime = 0;
    this.renderTrackInUI();
    if (this.isPlaying) {
      this.play();
    }
  }

  prev() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.currentTime = 0;
    this.renderTrackInUI();
    if (this.isPlaying) {
      this.play();
    }
  }

  playTrackById(trackId) {
    const idx = this.tracks.findIndex(t => t.id === trackId);
    if (idx !== -1) {
      this.currentTrackIndex = idx;
      this.currentTime = 0;
      this.renderTrackInUI();
      this.play();
    }
  }

  playTrackByTitle(title) {
    const idx = this.tracks.findIndex(t => t.title.toLowerCase() === title.toLowerCase());
    if (idx !== -1) {
      this.currentTrackIndex = idx;
      this.currentTime = 0;
      this.renderTrackInUI();
      this.play();
    }
  }

  getCurrentTrack() {
    return this.tracks[this.currentTrackIndex] || null;
  }

  setVolume(val) {
    this.volume = parseFloat(val);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
    }
  }

  setVinylVolume(val) {
    if (this.vinylGain && this.audioCtx) {
      this.vinylGain.gain.setValueAtTime(parseFloat(val) * 0.05, this.audioCtx.currentTime);
    }
  }

  setRainVolume(val) {
    if (this.rainGain && this.audioCtx) {
      this.rainGain.gain.setValueAtTime(parseFloat(val) * 0.06, this.audioCtx.currentTime);
    }
  }

  seekToPercent(percent) {
    this.currentTime = Math.floor(this.duration * percent);
    this.updateProgressUI();
  }

  formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  renderTrackInUI() {
    const track = this.getCurrentTrack();
    if (!track) return;

    const titleEl = document.getElementById('player-track-title');
    const artistEl = document.getElementById('player-track-artist');
    const coverEl = document.getElementById('player-cover');
    const totalTimeEl = document.getElementById('player-time-total');

    if (titleEl) titleEl.textContent = track.title;
    if (artistEl) artistEl.textContent = track.artist;
    if (coverEl) coverEl.textContent = track.cover || '🎵';
    if (totalTimeEl) totalTimeEl.textContent = track.duration || '3:00';

    this.updateProgressUI();
    this.triggerPlayingRowStyle();
  }

  updateProgressUI() {
    const currentEl = document.getElementById('player-time-current');
    const fillEl = document.getElementById('player-progress-fill');

    if (currentEl) currentEl.textContent = this.formatTime(this.currentTime);
    if (fillEl) {
      const pct = (this.currentTime / this.duration) * 100;
      fillEl.style.width = `${pct}%`;
    }
  }

  updatePlayBtnUI(playing) {
    const playBtn = document.getElementById('player-main-play-btn');
    if (playBtn) {
      playBtn.innerHTML = playing ? '⏸' : '▶';
      playBtn.setAttribute('title', playing ? 'Pausar' : 'Reproducir');
    }
  }

  triggerPlayingRowStyle() {
    const track = this.getCurrentTrack();
    if (!track) return;

    document.querySelectorAll('.track-row-item').forEach(row => {
      if (row.dataset.id === track.id) {
        if (this.isPlaying) {
          row.classList.add('playing');
        } else {
          row.classList.remove('playing');
        }
      } else {
        row.classList.remove('playing');
      }
    });
  }
}

window.beetPlayer = new BeetAudioPlayer();
