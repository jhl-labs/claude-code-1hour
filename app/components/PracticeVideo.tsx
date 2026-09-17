"use client";
import { useRef } from "react";
import { assetPath } from "@/app/lib/assetPath";
import { pauseOtherVideos } from "@/app/lib/pauseOtherVideos";
import recordings from "@/public/videos/practice-demos.json";
export function PracticeVideo({ id }: { id: string }) {
  const player = useRef<HTMLVideoElement>(null);
  const recording = recordings.find((r) => r.id === id);
  if (!recording) return null;
  const version = recording.sha256.slice(0,12);
  return <figure data-practice-video={id} className="my-5 rounded-xl border border-accent/30 bg-bg-soft p-4 sm:p-6">
    <figcaption className="flex flex-wrap gap-3 text-sm"><span className="text-accent">실제 Claude Code 시연</span><span className="text-ink-muted">{Math.round(recording.duration)}초 · 무음 · 자막 제공</span></figcaption>
    <p className="mt-3 leading-relaxed text-ink-soft">{recording.summary}</p>
    <video ref={player} controls playsInline preload="metadata" className="mt-4 w-full rounded bg-black" poster={assetPath(`/videos/posters/${id}.jpg?v=${version}`)} src={assetPath(`/videos/${id}.mp4?v=${version}`)} onPlay={(event)=>pauseOtherVideos(event.currentTarget)}>
      <track default kind="captions" srcLang="ko" label="한국어 해설" src={assetPath(`/videos/${id}.vtt?v=${version}`)}/>
    </video>
    <div className="mt-4 flex flex-wrap gap-2" aria-label="실습 장면 이동">{recording.chapters.map(c=><button key={c.second} type="button" className="rounded border border-white/20 px-3 py-2 text-sm hover:text-accent" onClick={()=>{if(player.current){player.current.currentTime=c.second;player.current.pause();}}}>{Math.floor(c.second/60)}:{String(c.second%60).padStart(2,'0')} · {c.title}</button>)}</div>
    <p className="mt-3 text-sm leading-relaxed text-ink-muted">Claude Code {recording.cliVersion} · {recording.model} · {recording.recordedAt}. {recording.editing}</p>
    <details className="mt-4 border-t border-white/10 pt-4"><summary className="cursor-pointer font-semibold">시연 결과·명령·검증 범위</summary><ul className="mt-3 space-y-2 text-sm leading-relaxed">{recording.results.map(r=><li key={r}>{r}</li>)}</ul><pre className="mt-4 overflow-x-auto rounded bg-bg p-3 text-sm"><code>{recording.commands.join('\n')}</code></pre><p className="mt-3 text-sm text-ink-muted">{recording.limitations}</p></details>
    <div className="mt-4 flex flex-wrap gap-4 text-sm"><a className="text-accent underline" href={assetPath(`/videos/source/${id}-uncut.mp4`)} download>{recording.rawNote}</a><a className="text-accent underline" href={`https://github.com/jhl-labs/claude-code-1hour/tree/feature/plan-01-scaffold/demos/uboot-sessions`}>요청·코드·검증 기록 ↗</a></div>
  </figure>;
}
