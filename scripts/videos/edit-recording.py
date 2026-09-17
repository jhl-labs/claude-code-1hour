"""Cut reviewed intervals from a REAL screen recording. Never synthesize CLI output.
Usage: python scripts/videos/edit-recording.py path/to/raw.mp4
The cuts below belong only to the documented 2026-09-17 session.
"""
import hashlib, json, pathlib, subprocess, sys
source = pathlib.Path(sys.argv[1])
out = pathlib.Path('public/videos'); (out/'posters').mkdir(parents=True, exist_ok=True)
cuts = [(2.8,13.8),(21.3,39.3),(61.8,66.8),(72,80),(114.8,122.8)]
parts=[]
for i,(start,end) in enumerate(cuts):
 parts.append(f'[0:v]trim=start={start}:end={end},setpts=PTS-STARTPTS[v{i}]')
parts.append(''.join(f'[v{i}]' for i in range(len(cuts)))+f'concat=n={len(cuts)}:v=1:a=0[out]')
target=out/'claude-code-real.mp4'
subprocess.run(['ffmpeg','-y','-v','error','-i',str(source),'-filter_complex',';'.join(parts),'-map','[out]','-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(target)],check=True)
subprocess.run(['ffmpeg','-y','-v','error','-ss','8','-i',str(target),'-frames:v','1',str(out/'posters/claude-code-real.jpg')],check=True)
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(target)]))
manifest={'id':'claude-code-real','duration':duration,'sha256':hashlib.sha256(target.read_bytes()).hexdigest(),'rawSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'recordedAt':'2026-09-17','cliVersion':'2.1.274','model':'Sonnet 5 · low effort','editing':'응답 완료 후 대기와 로그 탐색 사이의 정지 구간을 잘랐습니다. 남긴 구간은 원래 속도이며, 화면 출력과 실행 순서는 바꾸지 않았습니다.','cuts':[{'sourceStart':a,'sourceEnd':b} for a,b in cuts],'chapters':[{'second':0,'title':'수정 없이 코드 분석'},{'second':11,'title':'실패 재현과 한 줄 수정'},{'second':29,'title':'실제 실행 로그 펼치기'},{'second':34,'title':'실패 로그와 diff 확인'},{'second':42,'title':'통과 결과와 검증 범위'}]}
(out/'real-demo.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
def stamp(sec): return f'00:{sec//60:02d}:{sec%60:02d}.000'
texts=['실제 Claude Code에 파일 분석만 요청합니다. Read로 읽은 코드에서 8비트 마스크 오류를 찾습니다.','실패를 먼저 재현하고 한 줄을 수정한 뒤 같은 컴파일·테스트 명령을 다시 실행하도록 요청합니다.','상세 로그를 펼쳐 실제 Bash 명령과 4 boundary cases passed 출력을 확인합니다.','앞선 실패 기록도 확인합니다. assertion 실패(exit code 134)와 0x00ffu → 0x0fffu diff입니다.','수정 후 네 가지 입력에서 테스트가 통과했습니다. U-Boot와 실제 하드웨어를 검증한 것은 아닙니다.']
starts=[0,11,29,34,42,50]
(out/'claude-code-real.vtt').write_text('WEBVTT\n\n'+'\n\n'.join(f'{stamp(starts[i])} --> {stamp(starts[i+1])}\n{text}' for i,text in enumerate(texts))+'\n')
print(json.dumps(manifest,ensure_ascii=False,indent=2))
