// Beautiful synth player using the Web Audio API to play a chime-like "Happy Birthday" melody dynamically.

class BirthdaySynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private currentTimeout: number | undefined = undefined;

  // Frequencies for the melody
  private notesMap: { [key: string]: number } = {
    'C4': 261.63,
    'D4': 293.66,
    'E4': 329.63,
    'F4': 349.23,
    'G4': 392.00,
    'A4': 440.00,
    'Bb4': 466.16,
    'C5': 523.25,
    'D5': 587.33
  };

  // Happy Birthday Melody Representation: [note, duration_factor]
  private melody: [string, number][] = [
    ['C4', 0.5], ['C4', 0.5], ['D4', 1], ['C4', 1], ['F4', 1], ['E4', 2],
    ['C4', 0.5], ['C4', 0.5], ['D4', 1], ['C4', 1], ['G4', 1], ['F4', 2],
    ['C4', 0.5], ['C4', 0.5], ['C5', 1], ['A4', 1], ['F4', 1], ['E4', 1], ['D4', 2],
    ['Bb4', 0.5], ['Bb4', 0.5], ['A4', 1], ['F4', 1], ['G4', 1], ['F4', 2]
  ];

  public start() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    
    // Lazy initialize standard safe AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    this.ctx = new AudioContextClass();
    
    this.playLoop();
  }

  private playLoop() {
    if (!this.isPlaying || !this.ctx) return;
    
    let time = this.ctx.currentTime + 0.2;
    const tempo = 600; // time factor for beats

    this.melody.forEach(([noteName, duration]) => {
      const frequency = this.notesMap[noteName];
      const durationSeconds = duration * (tempo / 1000);
      
      if (frequency && this.ctx) {
        this.playTone(frequency, time, durationSeconds);
      }
      time += durationSeconds + 0.05;
    });

    // Schedule next repetition
    const totalMelodyDuration = this.melody.reduce((sum, [_, dur]) => sum + dur * (tempo / 1000) + 0.05, 0) * 1000;
    this.currentTimeout = window.setTimeout(() => {
      this.playLoop();
    }, totalMelodyDuration + 1000);
  }

  private playTone(frequency: number, startTime: number, duration: number) {
    if (!this.ctx) return;

    // Node configuration
    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    // Create a beautiful premium chime-like sound (sine + mellow envelope)
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, startTime);
    
    // Subtly mix a soft warm second harmonic
    const oscHarmonic = this.ctx.createOscillator();
    const harmonicGain = this.ctx.createGain();
    oscHarmonic.type = 'triangle';
    oscHarmonic.frequency.setValueAtTime(frequency * 2, startTime);
    harmonicGain.gain.setValueAtTime(0.02, startTime);
    harmonicGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    // Main envelope
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.12, startTime + 0.05); // quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // smooth, organic decay

    osc.connect(gainNode);
    oscHarmonic.connect(harmonicGain);
    
    gainNode.connect(this.ctx.destination);
    harmonicGain.connect(this.ctx.destination);

    osc.start(startTime);
    oscHarmonic.start(startTime);
    
    osc.stop(startTime + duration);
    oscHarmonic.stop(startTime + duration);
  }

  public stop() {
    this.isPlaying = false;
    if (this.currentTimeout) {
      clearTimeout(this.currentTimeout);
    }
    if (this.ctx && this.ctx.state !== 'closed') {
      this.ctx.close();
    }
    this.ctx = null;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const birthdaySynthInstance = new BirthdaySynth();
