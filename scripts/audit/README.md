# 강의 영상·페이지 점검

```sh
python scripts/audit/inspect-video.py .audit/review
python scripts/audit/build-gallery.py .audit/review
AUDIT_URL=http://localhost:3000 node scripts/audit/page.cjs .audit/review
AUDIT_URL=http://localhost:3000 node scripts/audit/interactions.cjs
```

필요 도구: pnpm 의존성, Chrome, ffmpeg/ffprobe, Python Pillow·numpy.
`inspect-video.py`는 게시된 편집본의 1초 간격 이미지·장면표·변화량을 수집한다. 첫 이미지가 0초다. 변화량은 정지 후보를 찾는 보조 지표이며, 대기인지 읽을 결과인지 실제 이미지를 검토해야 한다.
`page.cjs`는 데스크톱·모바일의 섹션 이동과 레이아웃을 기록한다.
`interactions.cjs`는 실습 영상 4개와 워밍업 1개, 자막, 수동 재생·장면 이동·동시 재생 방지, 슬라이드 9개의 클릭·키보드 이동을 검증한다.
영상 탐색에는 HTTP Range를 지원하는 서버가 필요하다.
