"""Build web images from original PNG masters. Run from the repository root."""
from pathlib import Path
import json
import re
from PIL import Image

root = Path(__file__).resolve().parents[1]
assets = root / 'src/assets'
sources = list((root / 'src').rglob('*.tsx')) + list((root / 'src').rglob('*.ts'))
paths = set()
for source in sources:
    for match in re.finditer(r"(?:from\s+|import\s*)['\"]([^'\"]+assets/[^'\"]+\.png)['\"]", source.read_text(encoding='utf-8-sig')):
        paths.add((source.parent / match[1]).resolve())
# Include existing optimized references when rebuilding.
for image in (assets / 'optimized').rglob('*.webp') if (assets / 'optimized').exists() else []:
    original = assets / image.relative_to(assets / 'optimized').with_suffix('.png')
    if original.exists():
        paths.add(original)

report = []
for original in sorted(paths):
    if not original.exists():
        continue
    relative = original.relative_to(assets)
    output = assets / 'optimized' / relative.with_suffix('.webp')
    output.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(original) as img:
        img = img.convert('RGBA' if 'A' in img.getbands() else 'RGB')
        limit = 1600 if 'jewelry' in str(relative) or original.stem == 'clean_herobg' else 1280
        if original.stem in ['j1', 'j2', 'j3', 'j4']:
            limit = 800
        img.thumbnail((limit, limit), Image.Resampling.LANCZOS)
        img.save(output, 'WEBP', quality=86, method=6)
        if original.stem in ['m1', 'm2', 'm3', 'm4']:
            img.thumbnail((640, 640), Image.Resampling.LANCZOS)
            img.save(output.with_name(output.stem + '-small.webp'), 'WEBP', quality=82, method=6)
    report.append({'source': str(relative), 'originalBytes': original.stat().st_size, 'webBytes': output.stat().st_size})

for source in sources:
    text = source.read_text(encoding='utf-8-sig')
    updated = re.sub(r"(['\"])([^'\"]*assets/)([^'\"]+\.png)\1", lambda m: m[1] + m[2] + 'optimized/' + str(Path(m[3]).with_suffix('.webp')).replace('\\', '/') + m[1] if (assets / 'optimized' / Path(m[3]).with_suffix('.webp')).exists() else m[0], text)
    if text != updated:
        source.write_text(updated, encoding='utf-8')

(assets / 'optimized/size-report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps({'images': len(report), 'originalBytes': sum(r['originalBytes'] for r in report), 'webBytes': sum(r['webBytes'] for r in report)}))
