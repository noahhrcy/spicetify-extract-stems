import json
import subprocess
import tempfile
import urllib.parse
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory, abort

app = Flask(__name__)
STEMS_DIR = Path("stems")
STEMS_DIR.mkdir(exist_ok=True)


def safe_path(name: str) -> Path:
    """Return a safe path for storing stems of a track."""
    safe = "".join(c for c in name if c.isalnum() or c in (" ", "-", "_"))
    return STEMS_DIR / safe


@app.route("/process")
def process():
    track = request.args.get("track")
    if not track:
        return jsonify(error="Missing track parameter"), 400

    try:
        with tempfile.TemporaryDirectory() as tmpdir:
            tmpdir = Path(tmpdir)
            audio_path = tmpdir / "audio.mp3"
            yt_cmd = [
                "yt-dlp",
                "-x",
                "--audio-format",
                "mp3",
                "-o",
                str(audio_path),
                f"ytsearch1:{track}",
            ]
            subprocess.run(yt_cmd, check=True)

            stem_out = safe_path(track)
            stem_out.mkdir(parents=True, exist_ok=True)
            demucs_cmd = [
                "demucs",
                "-n",
                "htdemucs",
                "-o",
                str(stem_out),
                str(audio_path),
            ]
            subprocess.run(demucs_cmd, check=True)
    except subprocess.CalledProcessError as e:
        return jsonify(error=str(e)), 500

    url = f"http://localhost:5000/download?stem_path={urllib.parse.quote(str(stem_out))}"
    return jsonify(url=url)


@app.route("/download")
def download():
    stem_path = request.args.get("stem_path")
    if not stem_path:
        files = [str(p.relative_to(STEMS_DIR)) for p in STEMS_DIR.rglob("*") if p.is_file()]
        return jsonify(files=files)

    path = Path(urllib.parse.unquote(stem_path))
    if not path.exists():
        abort(404)
    if path.is_dir():
        files = [f.name for f in path.iterdir() if f.is_file()]
        links = [f'<a href="/download?stem_path={urllib.parse.quote(str(path / f))}">{f}</a>' for f in files]
        return "<br>".join(links)
    return send_from_directory(path.parent, path.name, as_attachment=True)


if __name__ == "__main__":
    app.run(debug=True)
