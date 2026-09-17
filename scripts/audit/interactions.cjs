const {openBrowser}=require('@remotion/renderer');
const fs=require('node:fs');
const manifest=require('../../public/videos/practice-demos.json');
(async()=>{
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome'});
 try {
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
 await page.goto({url:process.env.AUDIT_URL || 'http://localhost:3000',timeout:120000,options:{}});
 const result=await page.evaluate(async(expected)=>{
  const wait=async(predicate)=>{ const end=Date.now()+15000;while(!predicate()){if(Date.now()>end)throw new Error('Timed out');await new Promise(r=>setTimeout(r,50));}};
  await wait(()=>document.querySelector('nav [aria-current]'));
  const videos=[...document.querySelectorAll('video')];
  const initiallyPaused=videos.every(v=>v.paused);
  const practices=[...document.querySelectorAll('[data-practice-video]')];
  const allExercisesRecorded=practices.length===4&&videos.length===5;
  let captionsLoad=true,chapterSeek=true,singlePlayback=true;let previous;
  for(const spec of expected){
   const figure=document.querySelector(`[data-practice-video="${spec.id}"]`);const video=figure.querySelector('video');
   video.textTracks[0].mode='hidden';await wait(()=>video.textTracks[0].cues?.length===spec.chapters.length);
   captionsLoad=captionsLoad&&video.textTracks[0].cues.length===spec.chapters.length;
   figure.querySelectorAll('button')[spec.chapters.length-1].click();
   const second=spec.chapters[spec.chapters.length-1].second;
   await wait(()=>Math.abs(video.currentTime-second)<.2&&!video.seeking);
   chapterSeek=chapterSeek&&video.paused&&Math.abs(video.duration-spec.duration)<.2;
   await video.play();await wait(()=>video.currentTime>second+.1);
   if(previous)singlePlayback=singlePlayback&&previous.paused;
   previous=video;
  }
  const warmup=document.querySelector('[data-real-demo]');warmup.closest('details').open=true;
  await warmup.querySelector('video').play();singlePlayback=singlePlayback&&previous.paused;
  videos.forEach(v=>v.pause());
  const decks=[...document.querySelectorAll('[data-slide-deck]')];let slidesWork=decks.length===9;
  for(const deck of decks){
   const outer=deck.closest('details');if(outer)outer.open=true;
   const panel=deck.querySelector('[aria-roledescription="슬라이드"]');const first=panel.textContent;
   [...deck.querySelectorAll('button')].find(b=>b.textContent==='다음 →').click();await wait(()=>panel.textContent!==first);
   const after=panel.textContent;await new Promise(r=>setTimeout(r,200));slidesWork=slidesWork&&panel.textContent===after&&!deck.querySelector('video,canvas');
   deck.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));await wait(()=>panel.textContent===first);
  }
  return {allExercisesRecorded,initiallyPaused,captionsLoad,chapterSeek,singlePlayback,slidesWork,practiceVideos:practices.length,totalVideos:videos.length,deckCount:decks.length};
 },manifest);
 fs.mkdirSync('.audit/practices',{recursive:true});fs.writeFileSync('.audit/practices/interactions.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
 if(!result.allExercisesRecorded||!result.initiallyPaused||!result.captionsLoad||!result.chapterSeek||!result.singlePlayback||!result.slidesWork)process.exitCode=1;
 } finally {await browser.close({silent:true});}
})().catch(e=>{console.error(e);process.exit(1)});
