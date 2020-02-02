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
    if (!this.initialized) {
        this.initialized = true;
    } else {
        return;
    }

    if (this.bgmUrl) {
      loop(this.bgm);
      this.bgm.play();
    }
  }

  playStart() {
    if (this.initialized) {
      this.startAudio.play();
    }
  }

  playSweep() {
    if (this.initialized && !this.sweeping) {
      this.sweep.play();
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
          this.win.play();
      }
  }

  stop() {
    if (this.bgm) this.bgm.pause();
    if (this.sweep) this.sweep.pause();
    if (this.win) this.win.pause();
    this.initialized = false;
  }

}

function loop(audio) {
  if (typeof audio.loop === 'boolean') {
    audio.loop = true;
  } else {
    audio.addEventListener("ended", function() { 
      this.currentTime = 0.0;
      this.play();
    }, false);
  }
}

export default new SoundManager();