export function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) return text;

  const parts = text.split(new RegExp(`(${query.trim()})`, "gi"));

  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="bg-transparent text-red-500">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
