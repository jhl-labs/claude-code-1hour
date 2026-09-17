"use client";
import { useId, useState } from "react";
import lessons from "@/app/content/lessons.json";

/** Reading material: no timer, media player or automatic progression. */
export function LessonSlides({ id }: { id: string }) {
  const lesson = lessons.find((item) => item.id === id);
  const [index, setIndex] = useState(0);
  const panelId = useId();
  if (!lesson) throw new Error(`Unknown lesson: ${id}`);
  const scene = lesson.scenes[index];
  return (
    <section aria-label={`${lesson.title} 슬라이드`} data-slide-deck={id}
      className="my-6 overflow-hidden rounded-xl border border-white/10 bg-bg-soft"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          setIndex((n) => Math.max(0, Math.min(lesson.scenes.length - 1, n + (e.key === "ArrowRight" ? 1 : -1))));
        }
      }}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3">
        <span className="text-sm text-ink-muted">읽는 예제 · 직접 넘기기</span>
        <span className="text-sm tabular-nums" aria-label="현재 슬라이드">{index + 1} / {lesson.scenes.length}</span>
      </div>
      <div id={panelId} role="group" aria-roledescription="슬라이드" aria-label={`${index + 1}: ${scene.title}`} aria-live="polite" className="p-5 sm:p-7">
        <h4 className="text-xl font-semibold text-accent">{scene.title}</h4>
        <pre className="my-5 overflow-x-auto rounded-lg bg-bg p-4 text-sm leading-7 sm:text-base"><code>{scene.code.join("\n")}</code></pre>
        <ul className="space-y-3 leading-relaxed text-ink-soft">
          {scene.points.map((point) => <li key={point}>{point}</li>)}
        </ul>
      </div>
      <div className="grid grid-cols-2 items-center gap-3 border-t border-white/10 p-4 sm:grid-cols-[auto_1fr_auto]">
        <button type="button" aria-controls={panelId} disabled={index === 0} onClick={() => setIndex(index - 1)} className="order-2 whitespace-nowrap rounded border border-white/20 px-4 py-2 disabled:opacity-30 sm:order-1">← 이전</button>
        <div className="order-1 col-span-2 flex flex-wrap justify-center gap-2 sm:order-2 sm:col-span-1">
          {lesson.scenes.map((s, n) => <button key={s.title} type="button" aria-label={`${n + 1}번 슬라이드: ${s.title}`} aria-current={n === index ? "step" : undefined} aria-controls={panelId} onClick={() => setIndex(n)} className={`h-9 w-9 rounded ${n === index ? "bg-accent text-bg" : "bg-bg text-ink-muted"}`}>{n + 1}</button>)}
        </div>
        <button type="button" aria-controls={panelId} disabled={index === lesson.scenes.length - 1} onClick={() => setIndex(index + 1)} className="order-3 whitespace-nowrap rounded border border-white/20 px-4 py-2 disabled:opacity-30">다음 →</button>
      </div>
      <details className="border-t border-white/10 p-5">
        <summary className="cursor-pointer text-sm text-ink-muted">전체 내용을 한 번에 읽기</summary>
        {lesson.scenes.map((s) => <article key={s.title} className="mt-6"><h4 className="font-semibold">{s.title}</h4><pre className="my-3 overflow-x-auto text-sm"><code>{s.code.join("\n")}</code></pre>{s.points.map((p) => <p key={p} className="mt-2 text-sm text-ink-soft">{p}</p>)}</article>)}
      </details>
      <p className="px-5 pb-4 text-sm"><a href={lesson.source} target="_blank" rel="noreferrer" className="text-accent underline">공식 참고 자료 ↗</a></p>
    </section>
  );
}
