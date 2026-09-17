import {describe,expect,it} from "vitest";
import {readFileSync} from "node:fs";
import {createHash} from "node:crypto";
import manifest from "@/public/videos/manifest.json";
import {getLesson,durationSeconds} from "@/remotion/lessons";
describe("published videos",()=>{
 it("keeps video files, captions, cue sheets and page durations together",()=>{
  expect(manifest).toHaveLength(5);
  for(const video of manifest){
   const lesson=getLesson(video.id);
   expect(video.duration).toBe(durationSeconds(lesson));
   expect(video.cues).toEqual(lesson.scenes.map((scene,i)=>({second:i*lesson.sceneSeconds,title:scene.title})));
   const bytes=readFileSync(`public/videos/${video.id}.mp4`);
   expect(createHash('sha256').update(bytes).digest('hex')).toBe(video.sha256);
   const captions=readFileSync(`public/videos/${video.id}.vtt`,'utf8');
   expect(captions.startsWith('WEBVTT')).toBe(true);
   for(const scene of lesson.scenes){expect(captions).toContain(scene.title);for(const point of scene.points)expect(captions).toContain(point);}
   expect(readFileSync(`public/videos/posters/${video.id}.jpg`).length).toBeGreaterThan(0);
  }
 });
});
