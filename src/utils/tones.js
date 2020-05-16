import Tone from 'tone';
// import { Synth } from 'tone';

class Tones {
  constructor() {
    const synth = new Tone.Synth();

    this.synth = new Tone.PolySynth(3, Tone.Synth).toMaster();
    this.notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    this.range = [2,3,4,5,6];
  }

  init() {
    Tone.start();
    console.log('Got here!')
  }

  play(data) {
    let n = [];
    data.cells.map((state, i) => {
      if (state) {
        let col = i%data.M;
        let row = Math.floor(i/data.M);
        n.push(`${this.notes[col%this.notes.length]}${this.range[Math.floor(row/Math.floor(data.N/this.range.length))]}`)
      }
    })
    console.log(n);
    if (n.length >=3)  {
      this.synth.triggerAttackRelease(n.slice(0,3), '8n');
    }
    //
    //play a middle 'C' for the duration of an 8th note

    // this.synth.triggerAttackRelease("C4", "8n");
  }

}

export default Tones;
