"""Extract integer-second MP4 frames; build timestamped contact sheets and metrics.
Requires ffmpeg/ffprobe, Pillow, numpy. Never modifies the source videos.
"""
import hashlib, json, subprocess, sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
root = Path(sys.argv[1] if len(sys.argv)>1 else '.audit/before')
root.mkdir(parents=True, exist_ok=True)
font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',16)
manifest=[]
for video in sorted(Path('public/videos').glob('*.mp4')):
    info=json.loads(subprocess.check_output(['ffprobe','-v','quiet','-show_format','-show_streams','-of','json',str(video)]))
    folder=root/video.stem
    folder.mkdir(exist_ok=True)
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(video),'-vf','fps=1:start_time=0,scale=960:-1','-q:v','3',str(folder/'second-%04d.jpg')],check=True)
    manifest.append({'id':video.stem,'sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'duration':float(info['format']['duration']),'streams':[{k:s.get(k) for k in ['codec_type','codec_name','width','height','r_frame_rate']} for s in info['streams']]})
(root/'mp4-manifest.json').write_text(json.dumps(manifest,indent=2))
metrics=[]
for folder in sorted(root.iterdir()):
    if not folder.is_dir(): continue
    files=sorted(folder.glob('*.jpeg')) or sorted(folder.glob('*.jpg'))
    if not files: continue
    samples=[]
    for i,f in enumerate(files):
        im=Image.open(f).convert('RGB')
        arr=np.array(im.resize((480,270)),dtype=np.int16)
        delta=float(np.abs(arr-prev).mean()) if i else None
        samples.append({'second':i,'file':str(f),'mean_pixel_delta':delta})
        prev=arr
    # These are candidates, not semantic proof: cursors and subtle fades affect delta.
    runs=[]; start=None
    for i in range(1,len(samples)+1):
        low=i<len(samples) and samples[i]['mean_pixel_delta']<0.3
        if low and start is None: start=i-1
        if not low and start is not None:
            if i-1-start>=3: runs.append([start,i-1])
            start=None
    metrics.append({'id':folder.name,'samples':len(files),'low_change_candidates':runs,'frames':samples})
    for page,offset in enumerate(range(0,len(files),20)):
        sheet=Image.new('RGB',(4*480,5*294),'#111118'); draw=ImageDraw.Draw(sheet)
        for j,f in enumerate(files[offset:offset+20]):
            x=(j%4)*480; y=(j//4)*294
            im=Image.open(f); im.thumbnail((480,270)); sheet.paste(im,(x,y+24))
            draw.text((x+8,y+3),f'{folder.name}  {offset+j:03d}s',font=font,fill='white')
        sheet.save(root/f'{folder.name}-sheet-{page+1:02d}.jpg',quality=88)
(root/'metrics.json').write_text(json.dumps(metrics,indent=2))
print(json.dumps([{k:v for k,v in m.items() if k!='frames'} for m in metrics],indent=2))
