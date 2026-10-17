class TacticAnimator {
  constructor({ onStep, getTactic, getSpeed }) {
    this.onStep = onStep; this.getTactic = getTactic; this.getSpeed = getSpeed;
    this.stepIndex = 0; this.playing = false; this.frame = null; this.startedAt = 0; this.duration = 1500; this.progress = 0;
  }
  get step() { return this.getTactic().steps[this.stepIndex]; }
  render() { this.onStep(this.stepIndex, this.progress); }
  goTo(index) {
    this.stop(); const max = this.getTactic().steps.length - 1;
    this.stepIndex = Math.max(0, Math.min(max, index)); this.progress = 0; this.render();
  }
  next() { if (this.stepIndex < this.getTactic().steps.length - 1) this.goTo(this.stepIndex + 1); else this.goTo(0); }
  previous() { this.goTo(this.stepIndex - 1); }
  toggle() { if (this.playing) this.pause(); else this.play(); }
  play() {
    if (this.playing) return;
    if (this.stepIndex >= this.getTactic().steps.length - 1 && this.progress === 0) this.stepIndex = 0;
    this.playing = true; this.startedAt = performance.now() - this.progress * this.duration;
    this.onStep(this.stepIndex, this.progress, true); this.frame = requestAnimationFrame(t => this.tick(t));
  }
  pause() { this.playing = false; if (this.frame) cancelAnimationFrame(this.frame); this.frame = null; this.render(); }
  stop() { this.playing = false; if (this.frame) cancelAnimationFrame(this.frame); this.frame = null; }
  reset() { this.stop(); this.stepIndex = 0; this.progress = 0; this.render(); }
  tick(now) {
    if (!this.playing) return;
    this.progress = Math.min(1, (now - this.startedAt) * this.getSpeed() / this.duration);
    this.onStep(this.stepIndex, this.progress, true);
    if (this.progress >= 1) {
      if (this.stepIndex < this.getTactic().steps.length - 1) { this.stepIndex++; this.progress = 0; this.startedAt = now; this.onStep(this.stepIndex, 0, true); }
      else { this.playing = false; this.progress = 0; this.onStep(this.stepIndex, 0, false); return; }
    }
    this.frame = requestAnimationFrame(t => this.tick(t));
  }
  setTactic() { this.reset(); }
}
