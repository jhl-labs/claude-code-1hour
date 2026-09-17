"""Build a local, timestamped review gallery from inspect-video.py outputs."""
import html
import json
import sys
from pathlib import Path

root = Path(sys.argv[1] if len(sys.argv)>1 else '.audit/before')
metrics = json.loads((root / 'metrics.json').read_text())
blocks = []
for video in metrics:
    vid = video['id']
    sheets = sorted(root.glob(f'{vid}-sheet-*.jpg'))
    frames = []
    for sample in video['frames']:
        path = Path(sample['file']).relative_to(root).as_posix()
        sec = sample['second']
        frames.append(f'<a href="{html.escape(path)}" target="_blank"><img loading="lazy" src="{html.escape(path)}" alt="{vid} {sec}초"><span>{sec//60:02}:{sec%60:02}</span></a>')
    sheets_html = ''.join(f'<a href="{p.name}" target="_blank">장면표 {i+1}</a> ' for i, p in enumerate(sheets))
    blocks.append(f'<section id="{vid}"><h2>{vid} · {video["samples"]}장</h2><p>{sheets_html}</p><details><summary>1초 간격 이미지 모두 보기</summary><div class="grid">{"".join(frames)}</div></details></section>')
nav = ' · '.join(f'<a href="#{v["id"]}">{v["id"]}</a>' for v in metrics)
document = '<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>실제 시연 점검</title><style>body{background:#101218;color:#eee;font:16px sans-serif;margin:24px}img{max-width:100%}a{color:#dab784}</style><h1>실제 시연 · 1초 간격 이미지 점검</h1><p>픽셀 변화량만으로 대기의 적절성을 판단하지 않습니다. 로그를 읽는 장면과 응답 대기를 구분해 검토하세요.</p><nav>' + nav + '</nav>' + ''.join(blocks) + '</html>'
(root/'index.html').write_text(document)
print(root/'index.html')
