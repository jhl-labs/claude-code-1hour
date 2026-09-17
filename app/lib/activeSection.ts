export function activeSectionAt<T extends string>(
  positions: { id: T; top: number }[],
  anchor: number,
  atBottom = false,
): T | null {
  if (!positions.length) return null;
  if (atBottom) return positions[positions.length - 1].id;
  return positions.reduce(
    (active, item) => (item.top <= anchor ? item.id : active),
    positions[0].id,
  );
}
