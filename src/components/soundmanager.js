class SoundManager {

  constructor() {
    this.bgmUrl = require('../../sound/MUSIC/MAIN_THEME.ogg');
    if (this.bgmUrl) this.bgm = new Audio(this.bgmUrl);
    this.startUrl = require('../../sound/FX_WAV/start1.wav');
    this.startAudio = new Audio(this.startUrl);
    this.sweepUrl = require('../../sound/FX_WAV/sweep.wav');
    this.sweep = new Audio(this.sweepUrl);
    this.winUrl = require('../../sound/FX_WAV/win1.wav');
    this.win = new Audio(this.winUrl);
  }

  start() {
    if (this.initialized) {
        return;
    }

    if (this.bgmUrl) {
      loop(this.bgm);
      play(this.bgm).then(() => {
        this.initialized = true;
      }).catch(console.error);
    }
  }

  playStart() {
    if (this.initialized) {
      play(this.startAudio);
    }
  }

  playSweep() {
    if (this.initialized && !this.sweeping) {
      play(this.sweep);
      this.sweeping = true;
    }
  }

  stopSweep() {
      this.sweeping = false;
      this.sweep.pause();
      this.sweep.currentTime = 0.0;
  }

  playWin(){
      if (this.initialized) {
          play(this.win);
      }
  }

  stop() {
    if (this.bgm) this.bgm.pause();
    if (this.sweep) this.sweep.pause();
    if (this.win) this.win.pause();
    this.initialized = false;
  }

}

function play(audio) {
  var p = audio.play();
  p.catch(console.error);
  return p;
}

function loop(audio) {
  if (typeof audio.loop === 'boolean') {
    audio.loop = true;
  } else {
    audio.addEventListener("ended", function() { 
      this.currentTime = 0.0;
      this.play().catch(console.error);
    }, false);
  }
}

export default new SoundManager();