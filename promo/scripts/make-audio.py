"""Synthesizes the promo soundtrack (SFX + soft music bed) into public/promo-audio.wav.
Every sound is generated here, so there are no licensing concerns.
Event frames match src/Root.tsx (30 fps). Run: python3 scripts/make-audio.py"""
import wave
import numpy as np

SR, FPS, DUR = 48000, 30, 30.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
L = np.zeros(N)
R = np.zeros(N)

def t_of(n): return np.arange(n) / SR
def at(frame): return int(frame / FPS * SR)

def add(sig, frame, gain=1.0, pan=0.0):
    """Mix a mono signal in at a video frame. pan: -1 left .. 1 right."""
    i = at(frame)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * np.sqrt((1 - pan) / 2)
    R[i:i + len(sig)] += sig * np.sqrt((1 + pan) / 2)

def lowpass(x, cutoff):
    """One-pole lowpass; cutoff may be an array (sweeps)."""
    cutoff = np.broadcast_to(cutoff, x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x); s = 0.0
    for k in range(len(x)):
        s += a[k] * (x[k] - s); y[k] = s
    return y

# ---------- SFX ----------
def key():
    n = int(0.035 * SR); t = t_of(n)
    noise = np.diff(rng.standard_normal(n + 1))          # highpassed noise = plastic click
    thump = np.sin(2 * np.pi * rng.uniform(140, 190) * t)
    return (noise * 0.25 * np.exp(-t * 260) + thump * 0.5 * np.exp(-t * 90)) * rng.uniform(0.6, 1.0)

def whoosh(length=0.45, lo=300, hi=5000, up=True):
    n = int(length * SR); t = t_of(n); x = np.linspace(0, 1, n)
    env = np.sin(np.pi * x ** (0.7 if up else 1.4)) ** 2
    cut = lo + (hi - lo) * (np.sin(np.pi * x) if up else x)
    return lowpass(rng.standard_normal(n), cut) * env * 1.6

def pop(f0=900, f1=260, length=0.12):
    n = int(length * SR); t = t_of(n)
    f = f1 + (f0 - f1) * np.exp(-t * 45)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 30)

def click():
    n = int(0.05 * SR); t = t_of(n)
    body = np.sin(2 * np.pi * 1700 * t) * np.exp(-t * 220) * 0.5
    tick = np.diff(rng.standard_normal(n + 1)) * np.exp(-t * 1200) * 0.08
    return body + tick

def chime(notes=(1318.5, 1975.5), gap=0.07):
    n = int(1.2 * SR); out = np.zeros(n + int(gap * SR * len(notes)))
    for k, f in enumerate(notes):
        t = t_of(n); s = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t)) * np.exp(-t * 5)
        o = int(k * gap * SR); out[o:o + n] += s
    return out * 0.5

def riser(length):
    n = int(length * SR); t = t_of(n); x = np.linspace(0, 1, n)
    tone = np.sin(2 * np.pi * np.cumsum(180 + 1100 * x ** 2) / SR) * 0.3
    noise = lowpass(rng.standard_normal(n), 400 + 7000 * x ** 2)
    return (tone + noise) * x ** 2.2

def sparkle():
    out = np.zeros(int(0.9 * SR))
    for k, f in enumerate([2093, 2637, 3136, 4186]):
        n = int(0.6 * SR); t = t_of(n); o = int(k * 0.05 * SR)
        out[o:o + n] += np.sin(2 * np.pi * f * t) * np.exp(-t * 9) * 0.25
    return out

# ---------- Typing Fatigue (0-270): keystrokes speed up with each repeat ----------
REPEATS = [(10, .55), (70, .8), (112, 1.1), (145, 1.6), (170, 2.4), (190, 3.4), (206, 5), (220, 8), (232, 12)]
CHARS = len("123 Main Street, Apt 4B")
shown = lambda f, start, cpf: min(CHARS, max(0, int((f - start) * cpf)))   # same as typed() in components.tsx
for i, (start, cpf) in enumerate(REPEATS):
    end = REPEATS[i + 1][0] if i + 1 < len(REPEATS) else 270
    for f in range(start + 1, end):
        new = shown(f, start, cpf) - shown(f - 1, start, cpf)
        for k in range(min(new, 3)):                       # several chars in one frame -> a quick rattle
            add(key(), f + k / 3, gain=0.42, pan=0.0)

# ---------- Overflow (270-306 flood, hard cut to silence at 306) ----------
add(riser((306 - 262) / FPS), 262, 0.4)

# ---------- The Click (starts 330) ----------
C0 = 330
add(pop(700, 220, 0.18), C0 + 6, 0.55)                  # button pops in
add(click(), C0 + 34, 0.6)                              # click 1
add(whoosh(0.32, 700, 7000), C0 + 36, 0.16)   # panel opens
add(click(), C0 + 62, 0.6)                              # click 2
add(chime(), C0 + 65, 0.6)                              # "Copied" toast

# ---------- Paste Anywhere (starts 420, 5 apps x 66 frames) ----------
P0, PER = 420, 66
for i in range(5):
    s = P0 + i * PER
    land = s + 16 if i == 0 else s + 6                   # Sequence starts at start-10 for i>0
    add(pop(1100, 380, 0.1), land, 0.38)                 # snippet lands
    add(click(), land, 0.3)

# ---------- Outro (starts 750) ----------
O0 = 750
add(whoosh(0.6, 400, 6000), O0 - 6, 0.17)
add(pop(500, 160, 0.3), O0 + 4, 0.6)                    # logo lands
add(chime((1046.5, 1568, 2093), 0.08), O0 + 32, 0.45)   # CTA
add(sparkle(), O0 + 45, 0.9)                            # shine sweep

# ---------- shared room ----------
def room(x, wet=0.14, decay=0.22, length=0.7):
    n = int(length * SR); t = t_of(n)
    ir = lowpass(rng.standard_normal(n), 5000) * np.exp(-t / decay)
    ir /= np.sqrt(np.sum(ir ** 2))
    m = len(x) + n - 1; size = 1 << (m - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[: len(x)]
    return x * (1 - wet) + y * wet * 2.2
L = room(L); R = room(R)

# ---------- Music bed ----------
def pad_note(f, length):
    n = int(length * SR); t = t_of(n)
    s = sum(np.sin(2 * np.pi * f * d * t + rng.uniform(0, 6)) for d in (1, 1.004, 0.996))
    s += 0.25 * np.sin(2 * np.pi * f * 2 * t)
    a = int(0.4 * SR); env = np.ones(n); env[:a] = np.linspace(0, 1, a); env[-a:] = np.linspace(1, 0, a)
    return s * env / 3

def pluck(f):
    n = int(0.7 * SR); t = t_of(n)
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(4 * np.pi * f * t) * np.exp(-t * 12)) * np.exp(-t * 6)

music = np.zeros(N)
def mput(sig, sec, g):
    i = int(sec * SR)
    if i >= N: return
    sig = sig[: N - i]; music[i:i + len(sig)] += sig * g

hz = lambda m: 440 * 2 ** ((m - 69) / 12)
# tense, sparse pad under the typing: Am - F (fades out into the silence)
for k, chord in enumerate([(57, 60, 64), (53, 57, 60), (57, 60, 64), (53, 57, 60)]):
    for m in chord: mput(pad_note(hz(m), 2.6), k * 2.5, 0.10)
# after the click: brighter C - G - Am - F at 120 BPM with a pluck arpeggio
B0, BAR = 392 / FPS, 2.0
prog = [(48, 55, 60, 64), (43, 55, 59, 62), (45, 57, 60, 64), (41, 57, 60, 65)]
bars = int((DUR - B0) / BAR) + 1
for b in range(bars):
    chord = prog[b % 4]
    for m in chord: mput(pad_note(hz(m), BAR + 0.4), B0 + b * BAR, 0.09)
    arp = [chord[1] + 12, chord[2] + 12, chord[3] + 12, chord[2] + 12]
    for s8 in range(8):
        mput(pluck(hz(arp[s8 % 4])), B0 + b * BAR + s8 * 0.25, 0.10 if s8 % 2 == 0 else 0.07)
    mput(pop(120, 45, 0.25) * 0.9, B0 + b * BAR, 0.5)        # soft kick on 1 and 3
    mput(pop(120, 45, 0.25) * 0.9, B0 + b * BAR + 1.0, 0.4)

# silence between the cut (306) and the button pop (336), then fade the whole bed out at the end
t = np.arange(N) / SR
gate = np.ones(N)
gate[(t >= 306 / FPS) & (t < 336 / FPS)] = 0
fade_in = (t >= 336 / FPS) & (t < B0)
gate[fade_in] = (t[fade_in] - 336 / FPS) / (B0 - 336 / FPS) * 0.5
gate *= np.clip((DUR - t) / 2.5, 0, 1)
# ---------- Voice-over (vo/LineN.mp3, optional) ----------
import os, subprocess
VO = [("vo/Line1.mp3", 1.0), ("vo/Line2.mp3", 11.0), ("vo/Line3.mp3", 13.6), ("vo/Line4.mp3", 26.0)]  # seconds
voice = np.zeros(N)
for path, sec in VO:
    if not os.path.exists(path): continue
    raw = subprocess.run(["ffmpeg", "-loglevel", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    v = np.frombuffer(raw, dtype="<f4").astype(float)
    i = int(sec * SR); v = v[: N - i]; voice[i:i + len(v)] += v
# duck the music bed while someone is talking (smoothed so it breathes, not pumps)
talking = np.convolve((np.abs(voice) > 0.01).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), mode="same")
duck = 1 - 0.6 * np.clip(talking * 4, 0, 1)

music *= gate * 0.55 * duck
L += music; R += music
# hard cut of all sound at the flash, for the "silence" beat
L[at(306):at(336)] *= 0; R[at(306):at(336)] *= 0

# voice goes in after the silence gate, so line 2 can break the silence
if voice.any():
    vg = 0.9 * max(np.abs(L).max(), np.abs(R).max()) / np.abs(voice).max()
    L += voice * vg; R += voice * vg

stereo = np.stack([L, R], axis=1)
stereo *= 0.89 / np.max(np.abs(stereo))                   # peak at about -1 dBFS
pcm = (stereo * 32767).astype("<i2")
with wave.open("public/promo-audio.wav", "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("wrote public/promo-audio.wav")
