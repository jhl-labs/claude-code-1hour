const {openBrowser}=require('@remotion/renderer');
const fs=require('node:fs');
const root=process.argv[2] || '.audit/before';
fs.mkdirSync(root,{recursive:true});
(async()=>{
 const browser=await openBrowser('chrome',{browserExecutable:'/usr/bin/google-chrome'});
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:null,onLog:()=>{}});
 await page.setViewport({width:1440,height:1000,deviceScaleFactor:1});
 await page.goto({url:process.env.AUDIT_URL || 'http://localhost:3000',timeout:120000,options:{}});
 await page.evaluate(()=>document.fonts.ready);
 await page.evaluate(()=>{document.documentElement.style.scrollBehavior="auto"});
 const result=[];
 const navigation=[];
 for (const width of [1440,390]) {
  await page.setViewport({width,height:1000,deviceScaleFactor:1});
  for (const id of ['hero','history','features','embedded-demos','impact','getting-started','qa']) {
   await page.evaluate(id=>document.getElementById(id)?.scrollIntoView(),id);
   await new Promise(r=>setTimeout(r,700));
   navigation.push(await page.evaluate(expected=>({expected,active:document.querySelector('nav [aria-current]')?.getAttribute('href')}),id));
   const shot=await page._client().send('Page.captureScreenshot',{format:'jpeg',quality:85});
   fs.writeFileSync(`${root}/page-${width}-${id}.jpg`,Buffer.from(shot.value.data,'base64'));
  }
  result.push(await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,
   videos:[...document.querySelectorAll('video')].map(v=>({src:v.getAttribute('src'),width:v.getBoundingClientRect().width,height:v.getBoundingClientRect().height,paused:v.paused})),
   sections:[...document.querySelectorAll("section[id]")].map(s=>({id:s.id,height:s.getBoundingClientRect().height,maxIntersectionRatio:Math.min(1,innerHeight/s.getBoundingClientRect().height)})),
   players:[...document.querySelectorAll(".remotion-player")].map(p=>({width:p.getBoundingClientRect().width})),
   headings:[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>h.textContent)})));
 }
 fs.writeFileSync(`${root}/page-metrics.json`,JSON.stringify(result,null,2));
 fs.writeFileSync(`${root}/navigation.json`,JSON.stringify(navigation,null,2));
 await browser.close({silent:true});
})().catch(e=>{console.error(e);process.exit(1)});
