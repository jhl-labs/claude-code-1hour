"use client";
import { Prism } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = { lang?: string; children: string };
export function CodeBlock({ lang = "bash", children }: Props) {
  return (
    <div className="rounded-md overflow-hidden text-sm">
      <Prism language={lang} style={vscDarkPlus} customStyle={{ margin: 0, background: "#101014" }}>
        {children.trim()}
      </Prism>
    </div>
  );
}
