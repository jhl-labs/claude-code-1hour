import {describe,expect,it} from "vitest";
import {readFileSync,readdirSync} from "node:fs";
import {createHash} from "node:crypto";
import recording from "@/public/videos/real-demo.json";
import practices from "@/public/videos/practice-demos.json";
const hash=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
describe("published actual recordings",()=>{
 it("provides a real recording for each of the four U-Boot exercises",()=>{
  expect(practices.map(p=>p.id)).toEqual(['V7-A-legacy-c','V7-C-build','V7-E-unit-test','V7-H-docs']);
  expect(readdirSync('public/videos').filter(f=>f.endsWith('.mp4')).sort()).toEqual([...practices.map(p=>p.id+'.mp4'),'claude-code-real.mp4'].sort());
  for(const video of practices){
   expect(hash(`public/videos/${video.id}.mp4`)).toBe(video.sha256);
   expect(hash(`public/videos/source/${video.id}-uncut.mp4`)).toBe(video.rawSha256);
   expect(video.cuts.reduce((n,c)=>n+c.end-c.start,0)).toBeCloseTo(video.duration,1);
   expect(video.chapters[0].second).toBe(0);
   for(let i=1;i<video.chapters.length;i++)expect(video.chapters[i].second).toBeGreaterThan(video.chapters[i-1].second);
   expect(video.chapters.at(-1)!.second).toBeLessThan(video.duration);
   const vtt=readFileSync(`public/videos/${video.id}.vtt`,'utf8');
   expect(vtt.startsWith('WEBVTT')).toBe(true);
   for(const cue of video.chapters)expect(vtt).toContain(cue.caption);
   expect(readFileSync(`public/videos/posters/${video.id}.jpg`).length).toBeGreaterThan(0);
  }
 });
 it("retains the optional beginner recording with original evidence",()=>{
  expect(hash('public/videos/claude-code-real.mp4')).toBe(recording.sha256);
  expect(hash('public/videos/source/claude-code-real-uncut.mp4')).toBe(recording.rawSha256);
  expect(recording.cuts.reduce((n,c)=>n+c.sourceEnd-c.sourceStart,0)).toBeCloseTo(recording.duration,1);
  expect(recording.chapters[0].second).toBe(0);
  for(let i=1;i<recording.chapters.length;i++)expect(recording.chapters[i].second).toBeGreaterThan(recording.chapters[i-1].second);
  expect(recording.chapters.at(-1)!.second).toBeLessThan(recording.duration);
  expect(readFileSync('public/videos/posters/claude-code-real.jpg').length).toBeGreaterThan(0);
  expect(readFileSync('public/videos/claude-code-real.vtt','utf8')).toContain('exit code 134');
 });
});
