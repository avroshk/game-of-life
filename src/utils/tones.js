const frequencyFromNote = (note) => 440 * Math.pow(2, (note - 69) / 12)

export class Tones {
  constructor(noteDuration) {
    // create web audio api context
    self.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    self.noteDuration = noteDuration
    self.envelope = {
      a: noteDuration/8,
      d: noteDuration/8,
      s: noteDuration/4,
      r: noteDuration/2,
      egMode: 1,
      velocity: 1
    }

    self.numNotesOn = 0;
    self.maxTones = 20;
    self.active = false;
  }

  envGenOn = (vcaGain, {a,d,s,r}, velocity) => {
    const now = self.audioCtx.currentTime;
    // a *= egMode;
    // d *= egMode;
    // vcaGain.cancelScheduledValues(0);
    // vcaGain.cancelScheduledValues(0);
    vcaGain.setValueAtTime(0, now);
    vcaGain.linearRampToValueAtTime(velocity, now + a);
    vcaGain.linearRampToValueAtTime(velocity, now + a + d);
    vcaGain.linearRampToValueAtTime(velocity, now + a + d + s);
    vcaGain.linearRampToValueAtTime(0, now + a + d + s + r);
  }

  getOctaveFromRow = (row, midRow) => {
    const numOctaves = 5

    let rowDiff = row - midRow

    if (rowDiff < 0) {
      return (Math.abs(rowDiff)%numOctaves)+1
    }
    return (rowDiff%numOctaves)+1
  }

  getNoteFromCol = (row, col, midCol) => {
    // const notes = ['C','G','D','A','E','B','F#','C#','G#','D#','A#','F'] //
    const notes = ['C','G','D','A','E','B'] //
    // const notes = ['F#','C#','G#','D#','A#','F']

    let colDiff = col - midCol
    let isEvenRow = row % 2 === 0

    let note = colDiff%notes.length
    if (colDiff < 0) {
      note = Math.abs(colDiff)%notes.length
    }

    return isEvenRow ? notes[note] : notes[note+1]
  }

  noteToMIDI = (note, octave) => {
    const minMidi = 24
    const notes = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
    let noteIndex = notes.indexOf(note)

    return ((octave-1)*12)+noteIndex+minMidi
  }

  getTone = (row, col, M, N) => {
    const midRow = Math.round(M/2)
    const midCol = Math.round(N/2)
    const octave = this.getOctaveFromRow(row, midRow)
    const note = this.getNoteFromCol(row, col, midCol)
    return this.noteToMIDI(note, octave)
  }

  setActive = (active) => {
    self.active = active
  }

  playGridNotes = (grid) => {
    if (self.active) {
      let M = grid.M
      let N = grid.N

      let midiNotes = grid.cells.map((alive, i) => {
        if (alive) {
          let col = (i%M);
          let row = Math.floor(i/M);
          return this.getTone(row, col, M, N)
        }
        return null
      }).filter(midiNote => {
        return midiNote !== null
      })

      const now = self.audioCtx.currentTime;
      this.play(now, midiNotes);
    }
  }

  play = (now, notes) => {
    const newVelocity = 0.5/(self.numNotesOn+notes.length);
    notes.map((newNote) => {
      if (self.numNotesOn > self.maxTones) {
        return
      }
      const vco = self.audioCtx.createOscillator();
      const vca = self.audioCtx.createGain();
      self.numNotesOn += 1;
      vco.type = 'sine';
      vco
        .connect(vca)
        .connect(self.audioCtx.destination)

      vco.frequency.setValueAtTime(frequencyFromNote(newNote), now);
      this.envGenOn(vca.gain, self.envelope, newVelocity);

      vco.start(now);
      const endTime = now+self.envelope.a+self.envelope.d+self.envelope.s+self.envelope.r;
      vco.stop(endTime);

      vco.onended = () => {
        vco.disconnect()
        vca.disconnect()
        self.numNotesOn -= 1;
      }
    })
  }
}
