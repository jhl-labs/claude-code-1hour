"""Capture a real interactive Claude Code terminal. Requires Xvfb, xterm, ffmpeg.
Run: python scripts/videos/capture-session.py ID PROMPT_FILE WORKDIR XTERM_PATH
Write keys to .audit/uboot-demo/ID/input; touch STOP there to end the recording.
No CLI output is synthesized. Raw footage and terminal events remain local.
"""
import os,sys,time,json,pathlib,subprocess,pty,tty,select,fcntl,termios,struct
if len(sys.argv)>1 and sys.argv[1]=='--terminal':
 root=pathlib.Path(sys.argv[2]); conf=json.loads((root/'capture.json').read_text()); fifo=root/'input'
 if fifo.exists():fifo.unlink()
 os.mkfifo(fifo); fd=os.open(fifo,os.O_RDWR|os.O_NONBLOCK);tty.setraw(0)
 pid,master=pty.fork()
 if pid==0:
  os.chdir(conf['workdir']);os.environ['PWD']=conf['workdir'];os.environ['TERM']='xterm-256color'
  args=['claude','--safe-mode','--verbose','--tools','Read,Grep,Glob,Bash,Edit,Write','--setting-sources','user','--strict-mcp-config','--mcp-config','{"mcpServers":{}}','--permission-mode','acceptEdits','--allowedTools','Read','Grep','Glob','Edit','Write','Bash(git rev-parse *)','Bash(git diff *)','Bash(git status *)','Bash(echo *)','Bash(scripts/config *)','Bash(make *)','Bash(arm-linux-gnueabi-*)','Bash(python3 *)','Bash(cc *)','Bash(./*)','Bash(file *)','Bash(grep *)','Bash(sed *)','Bash(nl *)','Bash(ls *)','Bash(cat *)','Bash(mkdir *)','--',conf['prompt']]
  os.execvp('claude',args)
 fcntl.ioctl(master,termios.TIOCSWINSZ,struct.pack('HHHH',33,100,0,0))
 with (root/'events.jsonl').open('w') as log:
  while True:
   ready,_,_=select.select([master,fd,0],[],[],.1)
   for key in [0,fd]:
    if key in ready:
     data=os.read(key,65536)
     if data:os.write(master,data)
   if master in ready:
    try:data=os.read(master,65536)
    except OSError:break
    if not data:break
    os.write(1,data);log.write(json.dumps({'t':round(time.monotonic()-conf['start'],3),'output':data.decode('utf-8','replace')},ensure_ascii=False)+'\n');log.flush()
 sys.exit()
ident,promptfile,workdir,xterm=sys.argv[1:]
root=(pathlib.Path('.audit/uboot-demo')/ident).resolve();root.mkdir(parents=True,exist_ok=True)
(root/'STOP').unlink(missing_ok=True)
conf={'workdir':str(pathlib.Path(workdir).resolve()),'prompt':pathlib.Path(promptfile).read_text(),'start':time.monotonic()};(root/'capture.json').write_text(json.dumps(conf,ensure_ascii=False))
env=dict(os.environ,DISPLAY=':94')
record=subprocess.Popen(['ffmpeg','-y','-v','error','-f','x11grab','-draw_mouse','0','-framerate','15','-video_size','1504x994','-i',':94','-c:v','libx264','-preset','ultrafast','-crf','18',str(root/'raw.mp4')],stdin=subprocess.PIPE)
term=subprocess.Popen([str(pathlib.Path(xterm).resolve()),'-geometry','100x33+0+0','-fa','DejaVu Sans Mono','-fs','18','-bg','#101218','-fg','#e8e8e8','-e',sys.executable,str(pathlib.Path(__file__).resolve()),'--terminal',str(root)],env=env)
try:
 while not (root/'STOP').exists() and term.poll() is None:time.sleep(.2)
finally:
 record.communicate(b'q');term.terminate();term.wait()
print(root)
