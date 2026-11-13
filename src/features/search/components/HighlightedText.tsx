const escapeRegExp = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function HighlightedText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  const trimmedQuery = query.trim();
  if (!trimmedQuery) return text;

  const parts = text.split(new RegExp(`(${escapeRegExp(trimmedQuery)})`, "gi"));

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
