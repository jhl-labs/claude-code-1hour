import { ScrollSection } from "@/app/components/ScrollSection";
import { SectionIntro, DocLink } from "@/app/components/SectionIntro";
import { Card } from "@/app/components/Card";
import { sections } from "@/app/lib/sections";
const meta = sections[1];
export function History({
  onEnter,
}: {
  onEnter?: (id: typeof meta.id) => void;
}) {
  return (
    <ScrollSection section={meta} onEnter={onEnter}>
      <SectionIntro label="§1 · 4분" title="Claude, 앱, Claude Code">
        Claude는 모델 제품군이고 Claude Code는 그 모델이 저장소와 개발 도구를
        사용할 수 있게 하는 에이전트입니다. CLI뿐 아니라 IDE·Desktop·Web에서도
        사용할 수 있습니다.
      </SectionIntro>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="모델">
          추론과 응답을 담당합니다. 모델 이름과 Claude Code 프로그램 버전은
          별개입니다.
        </Card>
        <Card title="실행 환경">
          로컬과 클라우드는 파일·네트워크·인증 환경이 다릅니다. 실행 위치를
          확인하세요.
        </Card>
        <Card title="검증 책임">
          도구를 실행할 수 있어도 결과의 정확성은 보장되지 않습니다.
          로그·diff·보드 검증을 함께 봅니다.
        </Card>
      </div>
      <h3 className="mt-6 text-xl font-semibold">지금 사용할 모델 확인</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-3">모델</th>
              <th className="p-3">CLI 최소 버전</th>
              <th className="p-3">확인할 점</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Sonnet 5", "2.1.197", "제공자별 alias 해석 확인"],
              ["Opus 5", "2.1.219", "계정·조직의 사용 가능 여부"],
              ["Fable 5.1", "2.1.257", "추가 usage credits 및 접근 권한"],
            ].map((row) => (
              <tr key={row[0]} className="border-b border-white/10">
                {row.map((c) => (
                  <td key={c} className="p-3">
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 leading-relaxed text-ink-soft">
        /model에서 실제 모델을 확인하세요. Fable은 모든 계정의 기본 모델이
        아니며, Mythos 5.1은 제한 접근입니다. 최신이라는 이유만으로 가장 큰
        모델을 항상 선택할 필요는 없습니다.
      </p>
      <p className="mt-4">
        <DocLink path="model-config">모델·제공자·이용 조건</DocLink> ·{" "}
        <a
          href="https://www.anthropic.com/claude-fable-and-mythos-5-1"
          className="text-accent underline"
        >
          Fable / Mythos 공식 발표
        </a>
      </p>
    </ScrollSection>
  );
}
