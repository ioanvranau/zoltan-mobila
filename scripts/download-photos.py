#!/usr/bin/env python3
"""Download all photos listed in photo-manifest.json from Unsplash.

Run from repo root: python scripts/download-photos.py
Idempotent — skips files that already exist with non-zero size.

URL pattern: https://unsplash.com/photos/<shortId>/download?w=2400&q=80&fm=jpg
The /download endpoint 302-redirects to the full-size CDN image. urllib follows
redirects by default, so the short slug ID we store in the manifest resolves
to the correct CDN URL automatically.
"""
import json
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "photo-manifest.json"

URL_TEMPLATE = "https://unsplash.com/photos/{id}/download?w=2400&q=80&fm=jpg"


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        print(f"  skip {dest.relative_to(ROOT)} ({dest.stat().st_size} bytes)")
        return True
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (zoltan-mobila-poc)"})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            data = r.read()
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(data)
        print(f"  saved {dest.relative_to(ROOT)} ({len(data)} bytes)")
        return True
    except Exception as e:
        print(f"  FAIL {dest.relative_to(ROOT)}: {e}  (url={url})", file=sys.stderr)
        return False


def main():
    if not MANIFEST.exists():
        print(f"Missing manifest: {MANIFEST}", file=sys.stderr)
        sys.exit(1)
    spec = json.loads(MANIFEST.read_text(encoding="utf-8"))
    photos = spec["photos"]
    print(f"Downloading {len(photos)} photos...")
    ok = 0
    fail = 0
    for p in photos:
        url = URL_TEMPLATE.format(id=p["unsplashId"])
        dest = ROOT / p["targetPath"]
        if download(url, dest):
            ok += 1
        else:
            fail += 1
        time.sleep(0.15)
    print(f"Done. ok={ok} fail={fail}")
    if fail:
        sys.exit(2)


if __name__ == "__main__":
    main()
