"use client";
import { useRef } from "react";
import { pauseOtherVideos } from "@/app/lib/pauseOtherVideos";
import { assetPath } from "@/app/lib/assetPath";
import recording from "@/public/videos/real-demo.json";

export function RealDemoVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const revision = recording.sha256.slice(0, 12);
  return (
    <article className="my-8 rounded-xl border border-accent/30 bg-bg-soft p-4 sm:p-6" data-real-demo>
      <div className="flex flex-wrap items-center gap-3"><span className="rounded bg-accent/15 px-3 py-1 text-sm text-accent">실제 Claude Code 실행 녹화</span><span className="text-sm text-ink-muted">{Math.round(recording.duration)}초 · 무음 · 수동 재생</span></div>
      <h3 className="mt-4 text-2xl font-semibold">C 코드의 버그를 찾고, 고치고, 테스트하기</h3>
      <p className="mt-3 leading-relaxed text-ink-soft">하위 12비트를 추출해야 하는 함수에 8비트 마스크를 넣었습니다. Claude Code에 먼저 읽기만 요청하고, 실패를 재현한 뒤 한 줄을 수정하도록 요청합니다.</p>
      <video onPlay={(e)=>pauseOtherVideos(e.currentTarget)} ref={video} controls playsInline preload="metadata" className="mt-5 w-full rounded-lg bg-black" poster={assetPath(`/videos/posters/claude-code-real.jpg?v=${revision}`)} src={assetPath(`/videos/claude-code-real.mp4?v=${revision}`)}>
        <track kind="captions" srcLang="ko" label="한국어 해설" default src={assetPath(`/videos/claude-code-real.vtt?v=${revision}`)} />
      </video>
      <p className="mt-3 text-sm leading-relaxed text-ink-muted">{recording.recordedAt} · Claude Code {recording.cliVersion} · {recording.model}. 실제 터미널 화면을 녹화했습니다. {recording.editing} 작은 화면에서는 전체화면으로 보세요.</p>
      <a className="mt-2 inline-block text-sm text-accent underline" href={assetPath("/videos/source/claude-code-real-uncut.mp4")} download>편집 전 원본 녹화 내려받기 (2분 5초 · 9.3 MB)</a>
      <div className="mt-4 flex flex-wrap gap-2" aria-label="시연 장면 이동">{recording.chapters.map((chapter) => <button key={chapter.title} type="button" className="rounded border border-white/20 px-3 py-2 text-sm hover:text-accent" onClick={() => { if (video.current) { video.current.currentTime = chapter.second; video.current.pause(); } }}>{Math.floor(chapter.second / 60)}:{String(chapter.second % 60).padStart(2, "0")} · {chapter.title}</button>)}</div>
      <details className="mt-5 border-t border-white/10 pt-4"><summary className="cursor-pointer font-semibold">요청·실제 결과·재현 방법 읽기</summary>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-ink-soft">
          <li>“bitfield.c를 읽고 요구사항과 구현이 일치하는지 설명해줘. 아직 수정하지 마.” → Claude Code가 Read로 파일을 읽고 8비트 마스크를 지적했습니다.</li>
          <li>“먼저 실패를 재현하고, 마스크 한 곳만 수정한 뒤 같은 명령으로 재검증해줘.” → Bash 실행에서 assertion 실패와 exit code 134가 나왔습니다.</li>
          <li>Edit로 <code>0x00ffu → 0x0fffu</code> 한 줄을 수정했습니다.</li>
          <li>같은 컴파일·실행 명령에서 <code>4 boundary cases passed</code>를 확인했습니다. 녹화 마지막에는 상세 로그를 펼쳐 명령과 출력을 검토합니다.</li>
        </ol>
        <pre className="mt-4 overflow-x-auto rounded bg-bg p-4 text-sm"><code>{`cc -std=c11 -Wall -Wextra -Werror bitfield.c -o bitfield-test\n./bitfield-test`}</code></pre>
        <p className="mt-3 text-sm">독립 C 예제의 네 가지 입력만 검사했습니다. U-Boot 빌드, ECC 알고리즘, MMIO와 실제 보드 동작은 검증하지 않았습니다. 녹화는 safe mode로 사용자 확장을 끄고, 파일 편집과 지정한 컴파일·실행 명령을 허용한 환경에서 진행했습니다.</p>
        <a className="mt-3 inline-block text-accent underline" href="https://github.com/jhl-labs/claude-code-1hour/tree/feature/plan-01-scaffold/demos/real-session">수정 전·후 코드와 녹화 기록 ↗</a>
      </details>
    </article>
  );
}
