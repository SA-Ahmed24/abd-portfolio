"""Confirm the rendered video's audio actually contains the current VO.
Cross-correlates the rendered mp4 audio against public/audio/rentez-vo.wav."""
import wave, numpy as np

def load(p):
    w = wave.open(p); n = w.getnframes(); sr = w.getframerate()
    d = np.frombuffer(w.readframes(n), dtype='<i2').astype(float)
    if w.getnchannels() == 2:
        d = d.reshape(-1, 2).mean(1)
    return d, sr

def resample(x, src, dst):
    n = int(len(x) * dst / src)
    idx = (np.arange(n) * src / dst).astype(int)
    return x[idx[idx < len(x)]]

def norm(x):
    x = x - x.mean()
    return x / (x.std() + 1e-9)

mp4, sr = load('/tmp/mp4aud.wav')
vo, svr = load('public/audio/rentez-vo.wav')
vo = resample(vo, svr, sr)
a = mp4[: sr * 9]          # first 9s of the rendered mix
b = norm(vo[: sr * 6])     # first 6s of the VO
best, bl = -1, 0
for lag in range(0, max(1, len(a) - len(b)), 80):
    c = np.dot(norm(a[lag:lag + len(b)]), b) / len(b)
    if c > best:
        best, bl = c, lag
print("VOICE_MATCH corr=%.3f at lag=%.2fs  (>0.2 = new voice is embedded)" % (best, bl / sr))
