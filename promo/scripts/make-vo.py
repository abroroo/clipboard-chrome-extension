"""Generates voice-over lines with ElevenLabs into vo/<voice>/lineN.mp3.
Key is read from promo/.env (ELEVENLABS_API_KEY). Usage: python3 scripts/make-vo.py name:voice_id [...]"""
import json, os, subprocess, sys, urllib.request

LINES = ["Typing the same thing... again?", "Or... just click.", "Cliply. Paste it anywhere.", "Free on Chrome."]
key = next(l.split("=", 1)[1].strip() for l in open(".env") if l.startswith("ELEVENLABS_API_KEY="))

for arg in sys.argv[1:]:
    name, vid = arg.split(":")
    os.makedirs(f"vo/{name}", exist_ok=True)
    for i, text in enumerate(LINES, 1):
        req = urllib.request.Request(
            f"https://api.elevenlabs.io/v1/text-to-speech/{vid}?output_format=mp3_44100_128",
            data=json.dumps({"text": text, "model_id": "eleven_multilingual_v2",
                             "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.25}}).encode(),
            headers={"xi-api-key": key, "Content-Type": "application/json"})
        try:
            with urllib.request.urlopen(req) as r: open(f"vo/{name}/line{i}.mp3", "wb").write(r.read())
        except urllib.error.HTTPError as e:
            sys.exit(f"{name} line{i}: HTTP {e.code} {e.read()[:300]!r}")
    # one preview file per voice: all lines with short gaps
    ins = sum([["-i", f"vo/{name}/line{i}.mp3"] for i in range(1, 5)], [])
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", *ins, "-f", "lavfi", "-t", "0.6", "-i", "anullsrc=r=44100:cl=mono",
                    "-filter_complex", "[0][4][1][4][2][4][3]concat=n=7:v=0:a=1", f"vo/sample-{name}.mp3"], check=True)
    print("ok", name)
