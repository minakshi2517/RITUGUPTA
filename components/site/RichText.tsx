export function RichText({ text, dropCap = false }: { text: string; dropCap?: boolean }) {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\n+/).map((block) => block.trim()).filter(Boolean);
  return (
    <div className={dropCap ? "essay drop-cap" : "essay"}>
      {blocks.map((block, index) => {
        if (block.startsWith("## ")) {
          return (
            <h2 key={index} className="font-serif">
              {block.slice(3)}
            </h2>
          );
        }
        if (block.startsWith("> ")) {
          return (
            <blockquote key={index}>
              <p>{block.replace(/^>\s?/gm, "")}</p>
            </blockquote>
          );
        }
        const lines = block.split("\n");
        return (
          <p key={index}>
            {lines.map((line, lineIndex) => (
              <span key={lineIndex}>
                {lineIndex > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
