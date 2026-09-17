const {openBrowser}=require('@remotion/renderer');
const fs=require('node:fs');
(async()=>{
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome'});
 try {
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
 await page.goto({url:process.env.AUDIT_URL || 'http://localhost:3000',timeout:120000,options:{}});
 const result=await page.evaluate(async()=>{
  const wait=async(predicate)=>{ const end=Date.now()+15000;while(!predicate()){if(Date.now()>end)throw new Error('Timed out');await new Promise(r=>setTimeout(r,50));}};
  await wait(()=>document.querySelector('nav [aria-current]'));
  const videos=[...document.querySelectorAll('video')];const video=videos[0];
  const oneRealVideo=videos.length===1&&!!video.closest('[data-real-demo]');
  const initiallyPaused=video.paused;
  video.textTracks[0].mode='hidden';await wait(()=>video.textTracks[0].cues?.length===5);
  const captionsLoad=video.textTracks[0].cues.length===5;
  await video.play();await wait(()=>video.currentTime>0.1);video.pause();
  const real=video.closest('[data-real-demo]');real.querySelectorAll('button')[3].click();
  await wait(()=>Math.abs(video.currentTime-34)<.2&&!video.seeking);
  const chapterSeek=video.paused;
  const decks=[...document.querySelectorAll('[data-slide-deck]')];
  let slidesWork=decks.length===9;
  for(const deck of decks){
   const panel=deck.querySelector('[aria-roledescription="슬라이드"]');
   const first=panel.textContent;
   const next=[...deck.querySelectorAll('button')].find(b=>b.textContent==='다음 →');
   next.click();await wait(()=>panel.textContent!==first);
   const after=panel.textContent;
   await new Promise(r=>setTimeout(r,200));
   slidesWork=slidesWork&&panel.textContent===after;
   deck.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
   await wait(()=>panel.textContent===first);
  }
  const noSlideMedia=decks.every(d=>!d.querySelector('video,canvas'));
  return {oneRealVideo,initiallyPaused,captionsLoad,chapterSeek,slidesWork,noSlideMedia,deckCount:decks.length,videoDuration:video.duration};
 });
 fs.mkdirSync('.audit/redesign',{recursive:true});fs.writeFileSync('.audit/redesign/interactions.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(!result.oneRealVideo||!result.initiallyPaused||!result.captionsLoad||!result.chapterSeek||!result.slidesWork||!result.noSlideMedia)process.exitCode=1;
 } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
