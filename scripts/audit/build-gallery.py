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
document = ('''<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Claude 강의 영상 전수 점검</title>
<style>body{font:16px/1.6 system-ui,sans-serif;background:#16181d;color:#e8eaf1;margin:24px auto;padding:0 20px;max-width:1400px}a{color:#95caff}h1{font-size:28px}section{border-top:1px solid #454954;margin-top:32px}summary{cursor:pointer;padding:12px;background:#272a33}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px;padding-top:12px}.grid a{display:block;text-decoration:none;background:#272a33}.grid img{width:100%;display:block}.grid span{padding:4px 8px;display:block}nav{line-height:2.1}</style>
<h1>Claude Code 강의 · 수정 전 영상 점검</h1><p>2026-09-17 · 영상 14개 · 1초 간격 851장. 장면표 48장을 육안 검토했습니다. 샘플링 사이의 모든 원본 프레임을 검토했다는 뜻은 아닙니다. 이미지를 누르면 크게 볼 수 있습니다.</p><p>MP4 5개는 원본에서 추출했고, Remotion 9개는 현재 활성 composition을 렌더링했습니다. 정지 구간과 내용 오류는 별도 Markdown 보고서에서 확인하세요.</p><nav>''' + nav + '</nav>' + ''.join(blocks) + '</html>')
document = document.replace('영상 14개 · 1초 간격 851장', f'영상 {len(metrics)}개 · 1초 간격 {sum(v["samples"] for v in metrics)}장').replace('장면표 48장', f'장면표 {len(list(root.glob("*-sheet-*.jpg")))}장').replace('수정 전', '수정 후' if 'after' in str(root) else '수정 전').replace('Remotion 9개', f'Remotion {len(metrics)-5}개')
(root / 'index.html').write_text(document, encoding='utf-8')
print(root / 'index.html')
