'use client'

import * as mm from '@magenta/music/es6';

let melodyRnn: mm.MusicRNN | null = null;
let melodyVae: mm.MusicVAE | null = null;
let initialized = false;

export async function initializeMagenta() {
  if (!initialized) {
    melodyRnn = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
    melodyVae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_4bar_small_q2');
    await Promise.all([melodyRnn.initialize(), melodyVae.initialize()]);
    initialized = true;
  }
}

export async function generateMelody(
  steps: number = 32,
  temperature: number = 1.0
): Promise<mm.NoteSequence> {
  if (!melodyRnn || !melodyVae) {
    throw new Error('Magenta is not initialized');
  }

  // Generate a random seed melody
  const seed = mm.sequences.quantizeNoteSequence({
    notes: [
      { pitch: 60, startTime: 0.0, endTime: 0.5 },
      { pitch: 62, startTime: 0.5, endTime: 1.0 },
      { pitch: 64, startTime: 1.0, endTime: 1.5 },
      { pitch: 65, startTime: 1.5, endTime: 2.0 },
    ],
    totalTime: 2
  }, 4);

  // Generate a longer sequence using MusicVAE
  const vaeOutput = await melodyVae.sample(1, temperature);
  const longSequence = vaeOutput[0];

  // Continue the sequence using MusicRNN
  const rnnOutput = await melodyRnn.continueSequence(longSequence, steps, temperature);

  // Combine the VAE and RNN outputs
  const combinedSequence = mm.sequences.concatenate([longSequence, rnnOutput]);

  return combinedSequence;
}

export function convertToMIDI(noteSequence: mm.NoteSequence): Uint8Array {
  const midiData = mm.sequenceProtoToMidi(noteSequence);
  return midiData;
}

export function convertToAudio(noteSequence: mm.NoteSequence): Promise<AudioBuffer> {
  const player = new mm.SoundFontPlayer('https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus');
  return player.loadSamples(noteSequence).then(() => {
    return player.synthesize(noteSequence);
  });
}

