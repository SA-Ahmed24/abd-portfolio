"""Generate a tasteful, lightly-produced music bed + SFX locally (free/safe, no downloads).
Warm pads + a subtle lo-fi beat, plus whoosh / ding / riser. Usage: python gen_audio.py [vo_wav]"""
import sys, wave
import numpy as np

SR = 44100

def write_wav(path, data):
    data = np.clip(data, -1, 1)
    pcm = (data * 32767).astype('<i2')
    ch = 1 if data.ndim == 1 else data.shape[1]
    with wave.open(path, 'w') as w:
        w.setnchannels(ch); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())

def dur_of(path):
    with wave.open(path) as w:
        return w.getnframes() / w.getframerate()

def env(n, a, r):
    e = np.ones(n); ai = int(a*SR); ri = int(r*SR)
    if ai > 0: e[:ai] = np.linspace(0, 1, ai)
    if ri > 0: e[-ri:] = np.linspace(1, 0, ri)
    return e

def chord(freqs, dur, amp=0.15):
    n = int(dur*SR); t = np.arange(n)/SR; sig = np.zeros(n)
    for f in freqs:
        for d in (-0.15, 0.15):
            sig += np.sin(2*np.pi*(f+d)*t) + 0.28*np.sin(2*np.pi*2*(f+d)*t)
        sig += 0.5*np.sin(2*np.pi*(f/2)*t)
    sig /= np.max(np.abs(sig)) + 1e-9
    return sig * amp * env(n, dur*0.4, dur*0.5)

def kick(dur=0.32):
    n = int(dur*SR); t = np.arange(n)/SR
    f = 110*np.exp(-t*22) + 48                 # pitch drop
    return np.sin(2*np.pi*f*t) * np.exp(-t*8) * 0.5

def hat(dur=0.06):
    n = int(dur*SR)
    return np.random.randn(n) * np.exp(-np.linspace(0, 1, n)*40) * 0.12

def music(total=42.0):
    prog = [
        [261.63, 329.63, 392.00, 493.88],  # Cmaj7
        [220.00, 261.63, 329.63, 392.00],  # Am7
        [174.61, 220.00, 261.63, 329.63],  # Fmaj7
        [196.00, 246.94, 293.66, 392.00],  # G
    ]
    parts, i = [], 0
    while sum(len(p) for p in parts)/SR < total + 4:
        parts.append(chord(prog[i % len(prog)], 4.0)); i += 1
    pad = np.concatenate(parts)[:int(total*SR)]

    # subtle lo-fi beat ~84 BPM (kick on the 1 & 3, soft hats on every beat)
    beat = np.zeros(len(pad)); bps = 84/60.0; step = SR/bps
    k, h = kick(), hat()
    for b in range(int(total*bps)):
        s = int(b*step)
        if b % 2 == 0 and s+len(k) < len(beat): beat[s:s+len(k)] += k
        hs = int((b+0.5)*step)
        if hs+len(h) < len(beat): beat[hs:hs+len(h)] += h
    beat *= np.clip(np.linspace(0, 1, len(beat))*3, 0, 1)   # beat fades in over first ~1/3

    mix = pad + 0.5*beat
    mix /= np.max(np.abs(mix)) + 1e-9
    mix *= 0.5
    d = int(0.012*SR); R = np.concatenate([np.zeros(d), mix])[:len(mix)]
    st = np.stack([mix, R], axis=1) * env(len(mix), 1.2, 2.5)[:, None]
    return st

def whoosh(dur=0.5):
    n = int(dur*SR); t = np.arange(n)/SR; e = np.sin(np.pi*t/dur)**2
    sig = np.random.randn(n)*e*0.5 + 0.2*np.sin(2*np.pi*(180+1600*t/dur)*t)*e
    sig /= np.max(np.abs(sig)) + 1e-9; s = sig*0.3
    return np.stack([s, s], axis=1)

def riser(dur=1.6):
    n = int(dur*SR); t = np.arange(n)/SR; p = t/dur
    sig = np.random.randn(n)*(p**2)*0.4 + 0.25*np.sin(2*np.pi*(120+900*p)*t)*(p**1.5)
    sig /= np.max(np.abs(sig)) + 1e-9; s = sig*0.32
    return np.stack([s, s], axis=1)

def ding(dur=0.7):
    n = int(dur*SR); t = np.arange(n)/SR; f = 784
    sig = (np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*2*f*t)+0.2*np.sin(2*np.pi*3*f*t))*np.exp(-t*5)
    sig /= np.max(np.abs(sig)) + 1e-9; s = sig*0.2
    return np.stack([s, s], axis=1)

def pop(dur=0.12):
    n = int(dur*SR); t = np.arange(n)/SR
    sig = np.sin(2*np.pi*(420+260*np.exp(-t*30))*t)*np.exp(-t*22)
    s = sig*0.18
    return np.stack([s, s], axis=1)

if __name__ == '__main__':
    write_wav('public/audio/music.wav', music(42.0))
    write_wav('public/audio/whoosh.wav', whoosh())
    write_wav('public/audio/riser.wav', riser())
    write_wav('public/audio/ding.wav', ding())
    write_wav('public/audio/pop.wav', pop())
    if len(sys.argv) > 1:
        print('VO_DUR', round(dur_of(sys.argv[1]), 2))
    print('AUDIO_OK')
