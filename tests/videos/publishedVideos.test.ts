import {describe,expect,it} from "vitest";
import {readFileSync,readdirSync} from "node:fs";
import {createHash} from "node:crypto";
import recording from "@/public/videos/real-demo.json";
const hash=(path:string)=>createHash('sha256').update(readFileSync(path)).digest('hex');
describe("published actual recording",()=>{
 it("publishes only the real demonstration with traceable cuts and captions",()=>{
  expect(readdirSync('public/videos').filter(f=>f.endsWith('.mp4'))).toEqual(['claude-code-real.mp4']);
  expect(hash('public/videos/claude-code-real.mp4')).toBe(recording.sha256);
  expect(hash('public/videos/source/claude-code-real-uncut.mp4')).toBe(recording.rawSha256);
  expect(recording.cuts.reduce((n,c)=>n+c.sourceEnd-c.sourceStart,0)).toBeCloseTo(recording.duration,1);
  expect(recording.chapters[0].second).toBe(0);
  for(let i=1;i<recording.chapters.length;i++) expect(recording.chapters[i].second).toBeGreaterThan(recording.chapters[i-1].second);
  expect(recording.chapters.at(-1)!.second).toBeLessThan(recording.duration);
  expect(readFileSync('public/videos/claude-code-real.vtt','utf8')).toContain('exit code 134');
  expect(readFileSync('public/videos/posters/claude-code-real.jpg').length).toBeGreaterThan(0);
 });
});
