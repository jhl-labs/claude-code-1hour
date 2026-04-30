type Props = {
  source: string;
  className?: string;
};

type Align = "left" | "center" | "right";

type Parsed = {
  headers: string[];
  aligns: Align[];
  rows: string[][];
};

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function parseMarkdownTable(src: string): Parsed | null {
  const lines = src
    .trim()
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);
  if (lines.length < 2) return null;

  const headers = splitRow(lines[0]);
  const sepCells = splitRow(lines[1]);
  const isSeparator =
    sepCells.length === headers.length &&
    sepCells.every((cell) => /^:?-{3,}:?$/.test(cell));
  if (!isSeparator) return null;

  const aligns: Align[] = sepCells.map((cell) => {
    const left = cell.startsWith(":");
    const right = cell.endsWith(":");
    if (left && right) return "center";
    if (right) return "right";
    return "left";
  });

  const rows = lines
    .slice(2)
    .map(splitRow)
    .filter((row) => row.length === headers.length);

  return { headers, aligns, rows };
}

const ALIGN_CLASS: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

const containsHangul = (text: string) => /[가-힣]/.test(text);

export function MarkdownTable({ source, className = "" }: Props) {
  const parsed = parseMarkdownTable(source);
  if (!parsed) {
    return (
      <pre className="overflow-x-auto rounded-md bg-bg-soft p-3 text-xs text-ink-muted ring-1 ring-white/5">
        {source}
      </pre>
    );
  }

  const { headers, aligns, rows } = parsed;

  return (
    <div
      className={`overflow-x-auto rounded-md ring-1 ring-white/10 ${className}`}
    >
      <table className="w-full border-collapse text-sm">
        <thead className="bg-white/5">
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider text-ink-muted ${ALIGN_CLASS[aligns[i]]}`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {rows.map((row, ri) => (
            <tr key={ri} className="align-top">
              {row.map((cell, ci) => {
                const useMono = !containsHangul(cell);
                return (
                  <td
                    key={ci}
                    className={`px-3 py-2 text-ink-soft ${ALIGN_CLASS[aligns[ci]]} ${useMono ? "font-mono text-xs" : "text-sm"}`}
                  >
                    {cell || " "}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
