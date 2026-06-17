"""Generate a tasteful ambient music bed + SFX locally (free/safe, no downloads).
Usage: python gen_audio.py [vo_wav_to_measure]"""
import sys, wave
import numpy as np

SR = 44100

def write_wav(path, data):
    data = np.clip(data, -1, 1)
    pcm = (data * 32767).astype('<i2')
    ch = 1 if data.ndim == 1 else data.shape[1]
    with wave.open(path, 'w') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())

def dur_of(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()

def env(n, a, r):
    e = np.ones(n); ai = int(a*SR); ri = int(r*SR)
    if ai > 0: e[:ai] = np.linspace(0, 1, ai)
    if ri > 0: e[-ri:] = np.linspace(1, 0, ri)
    return e

def chord(freqs, dur, amp=0.16):
    n = int(dur*SR); t = np.arange(n)/SR; sig = np.zeros(n)
    for f in freqs:
        for d in (-0.15, 0.15):                 # soft detune for warmth
            sig += np.sin(2*np.pi*(f+d)*t)
            sig += 0.28*np.sin(2*np.pi*2*(f+d)*t)
        sig += 0.5*np.sin(2*np.pi*(f/2)*t)      # sub octave
    sig /= np.max(np.abs(sig)) + 1e-9
    return sig * amp * env(n, dur*0.4, dur*0.5)

def music(total=30.0):
    prog = [
        [261.63, 329.63, 392.00, 493.88],  # Cmaj7
        [220.00, 261.63, 329.63, 392.00],  # Am7
        [174.61, 220.00, 261.63, 329.63],  # Fmaj7
        [196.00, 246.94, 293.66, 392.00],  # G
    ]
    parts, i = [], 0
    while sum(len(p) for p in parts)/SR < total + 4:
        parts.append(chord(prog[i % len(prog)], 4.0)); i += 1
    sig = np.concatenate(parts)[:int(total*SR)]
    d = int(0.012*SR)                            # tiny haas stereo widen
    L = sig; R = np.concatenate([np.zeros(d), sig])[:len(sig)]
    st = np.stack([L, R], axis=1) * env(len(sig), 1.5, 2.5)[:, None]
    return st

def whoosh(dur=0.55):
    n = int(dur*SR); t = np.arange(n)/SR; e = np.sin(np.pi*t/dur)**2
    sig = np.random.randn(n)*e*0.5 + 0.2*np.sin(2*np.pi*(180+1600*t/dur)*t)*e
    sig /= np.max(np.abs(sig)) + 1e-9
    s = sig*0.32
    return np.stack([s, s], axis=1)

def ding(dur=0.7):
    n = int(dur*SR); t = np.arange(n)/SR; f = 784
    sig = (np.sin(2*np.pi*f*t) + 0.4*np.sin(2*np.pi*2*f*t) + 0.2*np.sin(2*np.pi*3*f*t))*np.exp(-t*5)
    sig /= np.max(np.abs(sig)) + 1e-9
    s = sig*0.22
    return np.stack([s, s], axis=1)

if __name__ == '__main__':
    write_wav('public/audio/music.wav', music(30.0))
    write_wav('public/audio/whoosh.wav', whoosh())
    write_wav('public/audio/ding.wav', ding())
    if len(sys.argv) > 1:
        print('VO_DUR', round(dur_of(sys.argv[1]), 2))
    print('AUDIO_OK')
