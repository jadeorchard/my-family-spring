#!/usr/bin/env python3
"""Check the static site's local links, referenced assets, and HTML IDs offline."""

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1] / "preview"


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.references = []
        self.ids = []

    def handle_starttag(self, tag, attributes):
        attrs = dict(attributes)
        if attrs.get("id"):
            self.ids.append(attrs["id"])
        for attribute in ("href", "src"):
            if attrs.get(attribute):
                self.references.append(attrs[attribute])


def main():
    errors = []
    pages = sorted(ROOT.rglob("*.html"))
    for required in ("index.html", "thank-you/index.html", "review.js", "tracking.js", "site.css", "review.css"):
        if not (ROOT / required).is_file():
            errors.append(f"Missing required file: {required}")

    for page in pages:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))
        relative = page.relative_to(ROOT)
        for identifier, count in Counter(parser.ids).items():
            if count > 1:
                errors.append(f"{relative}: duplicate HTML id {identifier!r}")
        for reference in parser.references:
            url = urlsplit(reference)
            if url.scheme or url.netloc or not url.path:
                continue
            path = unquote(url.path)
            target = (ROOT / path.lstrip("/")) if path.startswith("/") else (page.parent / path)
            target = target.resolve()
            if not target.is_relative_to(ROOT.resolve()):
                errors.append(f"{relative}: local reference escapes preview/: {reference}")
                continue
            if target.is_dir():
                target = target / "index.html"
            if not target.is_file():
                errors.append(f"{relative}: missing local target: {reference}")

    if errors:
        for error in errors:
            print(error, file=sys.stderr)
        return 1
    print(f"Validated {len(pages)} HTML pages: required files, local references, and unique IDs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
