"""Publish reviewed cuts from actual Claude Code recordings, never generated output.
python scripts/videos/publish-practices.py demos/uboot-sessions/edit-plan.json
Raw inputs default to .audit/uboot-demo/SESSION/raw.mp4, or use --published-raw.
"""
import hashlib,json,pathlib,shutil,subprocess,sys
plan=json.loads(pathlib.Path(sys.argv[1]).read_text());out=pathlib.Path('public/videos');manifest=[]
def run(args):subprocess.run(args,check=True)
def stamp(s):return f'{int(s)//3600:02d}:{int(s)//60%60:02d}:{int(s)%60:02d}.000'
for item in plan:
 ident=item['id'];raw=out/'source'/f'{ident}-uncut.mp4'
 if '--published-raw' not in sys.argv:
  captured=pathlib.Path('.audit/uboot-demo')/item['session']/'raw.mp4'
  if item.get('redactions'):
   filters=[]
   for a,b in item['redactions']:
    enable=f"between(t,{a},{b})"
    filters.extend([f"drawbox=x=0:y=0:w=iw:h=ih:color=black:t=fill:enable='{enable}'",f"drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf:text='System account information redacted':fontcolor=white:fontsize=32:x=(w-text_w)/2:y=(h-text_h)/2:enable='{enable}'"])
   run(['ffmpeg','-y','-v','error','-i',str(captured),'-vf',','.join(filters),'-c:v','libx264','-preset','fast','-crf','18','-movflags','+faststart',str(raw)])
  else:shutil.copyfile(captured,raw)
 cuts=item['cuts'];parts=[]
 for i,c in enumerate(cuts):parts.append(f"[0:v]trim=start={c['start']}:end={c['end']},setpts=PTS-STARTPTS[v{i}]")
 parts.append(''.join(f'[v{i}]' for i in range(len(cuts)))+f'concat=n={len(cuts)}:v=1:a=0[out]')
 target=out/f'{ident}.mp4'
 run(['ffmpeg','-y','-v','error','-i',str(raw),'-filter_complex',';'.join(parts),'-map','[out]','-c:v','libx264','-crf','19','-preset','medium','-pix_fmt','yuv420p','-movflags','+faststart',str(target)])
 duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
 run(['ffmpeg','-y','-v','error','-ss',str(item['posterSecond']),'-i',str(target),'-frames:v','1',str(out/'posters'/f'{ident}.jpg')])
 captions=[]
 for i,ch in enumerate(item['chapters']):
  end=item['chapters'][i+1]['second'] if i+1<len(item['chapters']) else duration
  captions.append(f"{stamp(ch['second'])} --> {stamp(end)}\n{ch['caption']}")
 (out/f'{ident}.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(captions)+'\n')
 meta={**item,'rawNote':'원본 녹화 · 시스템 정보 구간 가림' if item.get('redactions') else '편집 전 원본 녹화','duration':duration,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'rawSha256':hashlib.sha256(raw.read_bytes()).hexdigest(),'cliVersion':'2.1.274','model':'Sonnet 5 · low effort','recordedAt':'2026-09-17','sourceCommit':'127a42c7257a6ffbbd1575ed1cbaa8f5408a44b3','editing':'응답 대기·승인 대기·정지 구간 일부를 잘랐습니다. 남긴 화면은 원래 순서와 속도입니다.'}
 manifest.append(meta);print(ident,duration,flush=True)
(out/'practice-demos.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
